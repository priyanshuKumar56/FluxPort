// NOTE: this file runs on the server side in a real Next.js app.
// Next.js emulates that server but still lets us write "server-only" code.

const FETCH_TIMEOUT_MS = 30_000

/**
 * Attempt the same request through the public CORS proxy if the first fetch
 * throws (network / CORS) or the browser returns an opaque response (status 0).
 */
async function fetchWithFallback(target: string, opts: RequestInit, controller: AbortController) {
  try {
    const res = await fetch(target, { ...opts, signal: controller.signal })
    // A successful no-CORS request resolves with status 0 – treat it as success,
    // we’ll read the body & headers below.
    if (res.status !== 0) return res
    // If status is 0 the body is opaque – fall through to proxy.
  } catch (err) {
    // swallow – we’ll retry through the proxy next
  }

  // --- Retry through public proxy ---
  const proxied = "https://corsproxy.io/?" + encodeURIComponent(target)
  return fetch(proxied, { ...opts, signal: controller.signal })
}

export async function POST(request: Request) {
  try {
    const body = await request.text()
    let requestData

    try {
      requestData = JSON.parse(body)
    } catch {
      return new Response(
        JSON.stringify({
          error: true,
          message: "Invalid JSON in request body",
          status: 400,
          statusText: "Bad Request",
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        },
      )
    }

    const { method = "GET", url, headers = {}, body: requestBody } = requestData

    // If the user typed “localhost”, convert it to 127.0.0.1 so the fetch
    // goes through even when localhost is blocked by the runtime.
    let targetUrl = url.trim()
    if (!targetUrl) {
      return new Response(
        JSON.stringify({
          error: true,
          message: "URL is required",
          status: 400,
          statusText: "Bad Request",
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        },
      )
    }

    // Add protocol if missing
    if (!targetUrl.match(/^https?:\/\//)) {
      targetUrl = `http://${targetUrl}`
      console.log(`[PROXY] Added http protocol: ${targetUrl}`)
    }

    // Build candidate localhost variants to maximize success across OS/network setups
    const buildCandidates = (u: string): string[] => {
      try {
        const parsed = new URL(u)
        const host = parsed.hostname
        const isLocal = ["localhost", "127.0.0.1", "::1", "0.0.0.0"].includes(host)
        if (!isLocal) return [u]

        const variants = new Set<string>()
        const hosts = ["localhost", "127.0.0.1", "::1", "0.0.0.0"]
        const protocols = [parsed.protocol.replace(":", ""), "http", "https"].filter(Boolean) as string[]
        const uniqueProtocols = Array.from(new Set(protocols))
        for (const h of hosts) {
          for (const proto of uniqueProtocols) {
            const alt = new URL(parsed.toString())
            alt.protocol = proto + ":"
            alt.hostname = h
            variants.add(alt.toString())
          }
        }
        // Original first
        return [u, ...Array.from(variants).filter((v) => v !== u)]
      } catch {
        return [u]
      }
    }
    const candidates = buildCandidates(targetUrl)

    if (!url) {
      return new Response(
        JSON.stringify({
          error: true,
          message: "URL is required",
          status: 400,
          statusText: "Bad Request",
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        },
      )
    }

    // Clean and prepare headers
    const cleanHeaders: Record<string, string> = {}
    if (headers && typeof headers === "object") {
      Object.entries(headers).forEach(([key, value]) => {
        const lowerKey = key.toLowerCase()
        // Skip problematic headers that browsers/servers handle automatically
        if (
          ![
            "host",
            "origin",
            "referer",
            "accept-encoding",
            "connection",
            "content-length",
            "transfer-encoding",
          ].includes(lowerKey)
        ) {
          cleanHeaders[key] = String(value)
        }
      })
    }

    console.log(`[PROXY] ${method} ${targetUrl}`)

    // Prepare fetch options
    const fetchOptions: RequestInit = {
      method: method.toUpperCase(),
      headers: cleanHeaders,
      // Add mode and credentials for better CORS handling
      mode: "cors",
      credentials: "omit",
    }

    // Add body for non-GET requests
    if (method.toUpperCase() !== "GET" && requestBody) {
      fetchOptions.body = requestBody
    }

    // Make the request with timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)

    let response: Response | null = null
    let lastError: any = null
    for (const candidate of candidates) {
      try {
        console.log(`[PROXY] Trying: ${candidate}`)
        response = await fetch(candidate, {
          ...fetchOptions,
          signal: controller.signal,
          redirect: "follow",
        })
        targetUrl = candidate
        break
      } catch (err) {
        lastError = err
      }
    }
    if (!response) {
      // Retry with alternate localhost hostname if applicable
      try {
        throw lastError || new Error("Fetch failed")
      } catch (retryError) {
        clearTimeout(timeoutId)

        let errorMessage = "Network error"
        let statusCode = 0

        const err = retryError as any
        if (err instanceof Error) {
          if (err.name === "AbortError") {
            errorMessage = "Request timeout (30s)"
            statusCode = 408
          } else if (err.message?.includes?.("Failed to fetch")) {
            if (url.includes("localhost") || url.includes("127.0.0.1") || targetUrl.includes("127.0.0.1")) {
              errorMessage = `Cannot connect to localhost server. Please check:\n  1. Is your server running on the correct port?\n  2. Is the endpoint path correct?\n  3. Try starting a simple server first`
              statusCode = 503
            } else {
              errorMessage = "CORS error or network failure. The server may not allow cross-origin requests."
              statusCode = 502
            }
          } else if (err.message?.includes?.("ECONNREFUSED")) {
            errorMessage = "Connection refused - server may be down"
            statusCode = 503
          } else if (err.message?.includes?.("ENOTFOUND")) {
            errorMessage = "Host not found - check the URL"
            statusCode = 404
          } else {
            errorMessage = err.message
            statusCode = 500
          }
        }

        console.error(`[PROXY] Fetch error:`, errorMessage)

        return new Response(
          JSON.stringify({
            error: true,
            message: errorMessage,
            status: statusCode,
            statusText: "Network Error",
            headers: {},
            data: null,
            suggestions:
              url.includes("localhost") || url.includes("127.0.0.1") || targetUrl.includes("127.0.0.1")
                ? [
                    "Start your local server first (e.g., npm start, python -m http.server)",
                    "Check if the port number is correct (common ports: 3000, 4000, 8000, 8080)",
                    "Verify the API endpoint exists (try /api/health or /api/status)",
                    "Make sure your server listens on 0.0.0.0 or 127.0.0.1 (not only ::1)",
                    "Try both http://localhost:PORT and http://127.0.0.1:PORT",
                  ]
                : [
                    "Check if the URL is correct",
                    "Verify the server allows CORS requests",
                    "Try adding proper headers like 'Access-Control-Allow-Origin'",
                    "Test the API directly in a new browser tab",
                  ],
          }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          },
        )
      }
    }

    clearTimeout(timeoutId)

    // Extract response headers
    const responseHeaders: Record<string, string> = {}
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value
    })

    // Handle response body based on content type
    let responseData: any = null
    const contentType = response.headers.get("content-type") || ""

    try {
      if (contentType.includes("application/json")) {
        const text = await response.text()
        if (text.trim()) {
          try {
            responseData = JSON.parse(text)
          } catch {
            responseData = text // Return as text if JSON parsing fails
          }
        } else {
          responseData = null
        }
      } else if (
        contentType.includes("text/") ||
        contentType.includes("application/xml") ||
        contentType.includes("application/html")
      ) {
        responseData = await response.text()
      } else if (
        contentType.includes("image/") ||
        contentType.includes("application/pdf") ||
        contentType.includes("application/octet-stream")
      ) {
        // For binary data, we'll indicate it's binary
        responseData = {
          type: "binary",
          contentType: contentType,
          message: `Binary content (${contentType}) - ${response.headers.get("content-length") || "unknown"} bytes`,
          size: Number.parseInt(response.headers.get("content-length") || "0"),
        }
      } else {
        // Try to read as text first, fallback to binary indicator
        try {
          responseData = await response.text()
        } catch {
          responseData = {
            type: "binary",
            contentType: contentType,
            message: `Binary or unreadable content (${contentType})`,
            size: 0,
          }
        }
      }
    } catch (bodyError) {
      console.error("[PROXY] Error reading response body:", bodyError)
      responseData =
        "Error reading response body: " + (bodyError instanceof Error ? bodyError.message : "Unknown error")
    }

    console.log(`[PROXY] Response: ${response.status} ${response.statusText}`)

    // Return successful response
    return new Response(
      JSON.stringify({
        error: false,
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
        data: responseData,
        ok: response.ok,
        url: response.url.replace("127.0.0.1", "localhost"),
        contentType,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      },
    )
  } catch (error) {
    console.error("[PROXY] Unexpected error:", error)

    return new Response(
      JSON.stringify({
        error: true,
        message: error instanceof Error ? error.message : "Internal server error",
        status: 500,
        statusText: "Internal Server Error",
        headers: {},
        data: null,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      },
    )
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With, Accept, Origin",
      "Access-Control-Max-Age": "86400",
    },
  })
}
