import { proxyRequest } from "@/lib/proxy-engine-v2"
import { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  // Extract target URL from request body
  const body = await request.json()
  const targetUrl = body.url

  if (!targetUrl) {
    return new Response(JSON.stringify({ error: "Target URL is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }

  // Get auth token from request headers
  const authHeader = request.headers.get('authorization')
  const headers: Record<string, string> = { ...body.headers }
  if (authHeader) {
    headers['Authorization'] = authHeader
  }

  // Create a new request with the target URL
  const proxyReq = new Request(targetUrl, {
    method: body.method || "GET",
    headers,
    body: body.body ? (typeof body.body === 'string' ? body.body : JSON.stringify(body.body)) : undefined,
  })

  try {
    const response = await proxyRequest(proxyReq, targetUrl)
    
    if (response instanceof Response) {
      return response
    }
    
    // If proxyRequest returns something else, wrap it
    return new Response(JSON.stringify({ error: "Invalid response from proxy" }), {
      status: 502,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      }
    })
  } catch (error) {
    console.error("Proxy error:", error)
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Proxy error" }), {
      status: 502,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      }
    })
  }
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url")

  if (!url) {
    return new Response(JSON.stringify({ error: "Target URL is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }

  const proxyReq = new Request(url, {
    method: "GET",
    headers: request.headers,
  })

  return await proxyRequest(proxyReq, url)
}
