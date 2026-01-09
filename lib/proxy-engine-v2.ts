import { apiClient } from "@/lib/api/client"

export type InterceptorRule = {
  id: string
  matchPattern: string
  methods?: string[]
  type: "REDIRECT" | "REPLACE_BODY" | "INJECT_SCRIPT" | "BLOCK" | "MODIFY_HEADERS" | "DELAY" | "MOCK_RESPONSE"
  config?: any
  isActive: boolean
  priority: number
}

export async function proxyRequest(request: Request, targetUrl: string) {
  // Get token from request headers (optional - allow requests without auth for now)
  const authHeader = request.headers.get('authorization')
  
  if (authHeader) {
    // Set token for API client
    const token = authHeader.replace('Bearer ', '')
    apiClient.setToken(token)
  }

  // Fetch active rules
  let rules: InterceptorRule[] = []
  try {
    const allRules = await apiClient.getInterceptorRules()
    rules = allRules.filter(r => r.isActive)
  } catch (error) {
    console.error('Failed to fetch rules:', error)
  }

  // Logic to handle localhost and rule matching
  const url = new URL(targetUrl)
  const isLocal =
    url.hostname === "localhost" ||
    url.hostname === "127.0.0.1" ||
    url.hostname.startsWith("192.168.") ||
    url.hostname.startsWith("10.") ||
    url.hostname.endsWith(".local")

  if (isLocal) {
    // Return a specific error code that the client can catch to switch to direct fetch
    return new Response(
      JSON.stringify({
        error: "Localhost detected. Please use Direct Mode in the API Client.",
        isLocal: true,
        code: "LOCAL_ENDPOINT",
      }),
      { status: 502, headers: { "Content-Type": "application/json" } },
    )
  }

  const startTime = Date.now()
  try {
    // --- RULE EVALUATION (Requestly-style) ---
    // Sort rules by priority
    const sortedRules = [...rules].sort((a, b) => b.priority - a.priority)
    let appliedRuleId: string | null = null

    for (const rule of sortedRules) {
      const pattern = new RegExp(rule.matchPattern.replace(/\*/g, '.*'))
      if (pattern.test(targetUrl)) {
        // Method check if applicable
        if (rule.methods && rule.methods.length > 0 && Array.isArray(rule.methods) && !rule.methods.includes(request.method)) {
          continue
        }

        appliedRuleId = rule.id
        console.log(`[Proxy] Applying rule: ${rule.type} (${rule.id}) to ${targetUrl}`)

        if (rule.type === "BLOCK") {
          return new Response(JSON.stringify({ error: "Blocked by FluxPort Interceptor", ruleId: rule.id }), {
            status: 403,
            headers: { "Content-Type": "application/json" }
          })
        }

        if (rule.type === "DELAY" && rule.config?.delayMs) {
          await new Promise(resolve => setTimeout(resolve, rule.config.delayMs))
        }

        if (rule.type === "REDIRECT" && rule.config?.redirectUrl) {
          targetUrl = rule.config.redirectUrl
        }

        if (rule.type === "MOCK_RESPONSE" && rule.config) {
          return new Response(rule.config.body || "", {
            status: rule.config.status || 200,
            headers: { ...rule.config.headers, "X-FluxPort-Intercepted": "MOCK" }
          })
        }
        
        // Break after first matching rule for simplicity, or continue for MODIFIERS
        if (rule.type !== "MODIFY_HEADERS" && rule.type !== "DELAY") break
      }
    }

    // Clone request body if needed
    let requestBody: string | undefined = undefined
    if (request.method !== "GET" && request.method !== "HEAD") {
      try {
        requestBody = await request.text()
      } catch (e) {
        console.error('Failed to read request body:', e)
      }
    }

    // Apply MODIFY_HEADERS if a rule matched
    const fetchHeaders: Record<string, string> = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'X-FluxPort-Proxy': 'v2'
    }
    
    if (appliedRuleId) {
      const modRule = sortedRules.find(r => r.id === appliedRuleId && r.type === "MODIFY_HEADERS")
      if (modRule?.config?.headers) {
        Object.assign(fetchHeaders, modRule.config.headers)
      }
    }

    request.headers.forEach((value, key) => {
      const lowerKey = key.toLowerCase()
      // Skip headers that should be handled by the proxy or could cause issues
      if (!['host', 'connection', 'content-length', 'accept-encoding', 'origin', 'referer', 'content-type'].includes(lowerKey)) {
        if (!fetchHeaders[key]) fetchHeaders[key] = value
      }
    })

    // If there is a body, we need to pass the content-type through
    const originalContentType = request.headers.get('content-type')
    if (originalContentType && requestBody) {
      fetchHeaders['Content-Type'] = originalContentType
    }

    const response = await fetch(targetUrl, {
      method: request.method,
      headers: fetchHeaders,
      body: requestBody,
    })

    const latency = Date.now() - startTime
    
    // Read the response body as text
    let responseBody = ""
    try {
      responseBody = await response.text()
      
      // Apply REPLACE_BODY if a rule matched
      if (appliedRuleId) {
        const replaceRule = sortedRules.find(r => r.id === appliedRuleId && r.type === "REPLACE_BODY")
        if (replaceRule?.config?.body) {
          responseBody = replaceRule.config.body
        }
      }
    } catch (e: any) {
      console.error('Failed to read response body:', e)
      responseBody = `Error reading response: ${e instanceof Error ? e.message : 'Unknown error'}`
    }
    
    // Log the request asynchronously
    if (authHeader) {
      apiClient.createApiLog({
        requestUrl: targetUrl,
        requestMethod: request.method,
        responseStatus: response.status,
        latencyMs: latency,
      }).catch(error => {
        console.error('Failed to log request:', error)
      })
    }

    const responseHeaders = new Headers()
    response.headers.forEach((value, key) => {
      const lowerKey = key.toLowerCase()
      // Skip headers that would cause the browser to fail decoding or miscalculate size
      if (!['content-length', 'content-encoding', 'transfer-encoding'].includes(lowerKey)) {
        responseHeaders.set(key, value)
      }
    })
    
    responseHeaders.set('Access-Control-Allow-Origin', '*')
    responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    responseHeaders.set('X-FluxPort-Rule-Applied', appliedRuleId || 'none')
    
    if (!responseHeaders.has('content-type')) responseHeaders.set('Content-Type', 'text/plain')

    return new Response(responseBody, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    })
  } catch (error: any) {
    console.error('Proxy fetch error:', error)
    const errorMessage = error instanceof Error ? error.message : "Proxy Error"
    const errorCode = error.code || "FETCH_FAILED"
    
    let userMessage = `Proxy failed to connect to the target: ${errorMessage}`
    let suggestion = "Check your internet connection or verify the URL is correct."

    // Translate common low-level errors
    if (errorCode === 'ECONNREFUSED') {
      userMessage = "Target server refused the connection. Is it running?"
      suggestion = "Ensure the service at the target URL is active and listening on the correct port."
    } else if (errorCode === 'ENOTFOUND') {
      userMessage = "Target host not found (DNS failure)."
      suggestion = "Check the spelling of the hostname and your internet connection."
    } else if (errorCode === 'UND_ERR_CONNECT_TIMEOUT' || errorCode === 'ETIMEDOUT') {
      userMessage = "Connection timed out."
      suggestion = "The target server is taking too long to respond. It might be overloaded or blocked by a firewall."
    } else if (errorMessage.toLowerCase().includes('fetch failed')) {
      userMessage = "Connection failed in the proxy layer."
      suggestion = "Try unchecking 'Proxy' to connect directly from your browser. This often fixes issues with local or internal endpoints."
    }

    return new Response(JSON.stringify({ 
      error: userMessage,
      code: errorCode,
      details: error instanceof Error ? error.stack : undefined,
      suggestion: suggestion
    }), { 
      status: 502,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    })
  }
}
