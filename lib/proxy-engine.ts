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

export async function matchAndExecuteRule(request: Request, rules: InterceptorRule[]) {
  const url = new URL(request.url)
  const method = request.method

  // Sort rules by priority (descending)
  const sortedRules = [...rules].sort((a, b) => (b.priority || 0) - (a.priority || 0))

  const rule = sortedRules.find((r) => {
    if (!r.isActive) return false

    // Enhanced pattern matching with Regex support
    let patternMatch = false
    try {
      if (r.matchPattern.startsWith("/") && r.matchPattern.endsWith("/")) {
        const regex = new RegExp(r.matchPattern.slice(1, -1))
        patternMatch = regex.test(url.href)
      } else {
        patternMatch = url.href.includes(r.matchPattern) || r.matchPattern === "*"
      }
    } catch (e) {
      patternMatch = url.href.includes(r.matchPattern)
    }

    const methodMatch = !r.methods || r.methods.length === 0 || r.methods.includes(method) || r.methods.includes("ALL")
    return patternMatch && methodMatch
  })

  if (!rule) return null

  console.log(`[v0] Matching rule found: ${rule.id} (${rule.type})`)

  switch (rule.type) {
    case "DELAY":
      await new Promise((resolve) => setTimeout(resolve, rule.config?.delayMs || 1000))
      return { continue: true }

    case "MOCK_RESPONSE":
      return new Response(JSON.stringify(rule.config?.body || {}), {
        status: rule.config?.status || 200,
        headers: {
          "Content-Type": "application/json",
          ...rule.config?.headers,
        },
      })

    case "BLOCK":
      return new Response(null, { status: 403, statusText: "Blocked by API Gateway" })

    case "REDIRECT":
      return Response.redirect(rule.config?.destinationUrl || url.href, 307)

    case "REPLACE_BODY":
      return new Response(JSON.stringify(rule.config?.body), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })

    case "MODIFY_HEADERS":
      // This logic will be handled in the fetch wrapper
      return { modifyHeaders: rule.config?.headers }

    default:
      return null
  }
}

export async function proxyRequest(request: Request) {
  // Get token from request headers
  const authHeader = request.headers.get('authorization')
  if (!authHeader) {
    return new Response("Unauthorized", { status: 401 })
  }

  // Set token for API client
  const token = authHeader.replace('Bearer ', '')
  apiClient.setToken(token)

  const url = new URL(request.url)
  const isLocalhost =
    url.hostname === "localhost" || url.hostname === "127.0.0.1" || url.hostname.startsWith("192.168.")

  if (isLocalhost) {
    console.log(`[v0] Localhost request detected: ${url.href}. Note: Server-side proxy cannot reach user's localhost.`)
    // We return a specific header to tell the client to handle this locally if possible
    return new Response(
      JSON.stringify({
        error: "Localhost detected",
        message:
          "The server-side proxy cannot reach your local machine. Please disable 'Use Proxy' in the settings to fetch directly from your browser.",
        isLocal: true,
      }),
      { status: 502, headers: { "Content-Type": "application/json" } },
    )
  }

  // Fetch active rules
  let rules: InterceptorRule[] = []
  try {
    const allRules = await apiClient.getInterceptorRules()
    rules = allRules.filter(r => r.isActive)
  } catch (error) {
    console.error('Failed to fetch rules:', error)
  }

  const ruleResult = await matchAndExecuteRule(request, rules || [])

  if (ruleResult && "continue" in ruleResult) {
    // Continue execution if rule allows
  } else if (ruleResult instanceof Response) {
    return ruleResult
  }

  // Otherwise, proceed with the proxy fetch
  const startTime = Date.now()
  const headers = new Headers(request.headers)

  // Apply MODIFY_HEADERS rule if applicable
  if (ruleResult?.modifyHeaders) {
    Object.entries(ruleResult.modifyHeaders).forEach(([key, value]) => {
      headers.set(key, value as string)
    })
  }

  try {
    const response = await fetch(request.url, {
      method: request.method,
      headers,
      body: request.method !== "GET" && request.method !== "HEAD" ? await request.clone().text() : undefined,
    })

    const latency = Date.now() - startTime

    // Async log the request
    try {
      await apiClient.createApiLog({
        requestUrl: request.url,
        requestMethod: request.method,
        responseStatus: response.status,
        latencyMs: latency,
      })
    } catch (error) {
      console.error('Failed to log request:', error)
    }

    return response
  } catch (error) {
    console.error("[v0] Proxy Error:", error)
    return new Response("Gateway Error", { status: 502 })
  }
}
