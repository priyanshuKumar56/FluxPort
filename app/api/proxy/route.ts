import { proxyRequest } from "@/lib/proxy-engine-v2";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const contentType = request.headers.get("content-type") || "";

  let targetUrl: string;
  let workspaceId: string | undefined;
  let method = "GET";
  let headers: Record<string, string> = {};
  let body: any;
  let isMultipart = false;

  // Handle multipart/form-data for file uploads
  if (contentType.includes("multipart/form-data")) {
    isMultipart = true;
    const formData = await request.formData();
    targetUrl = formData.get("url") as string;
    workspaceId = formData.get("workspaceId") as string | undefined;
    method = (formData.get("method") as string) || "POST";

    // Parse headers from form data
    const headersJson = formData.get("headers") as string;
    if (headersJson) {
      try {
        headers = JSON.parse(headersJson);
      } catch (e) {
        console.error("Failed to parse headers:", e);
      }
    }

    // Reconstruct FormData for forwarding (excluding metadata fields)
    const forwardFormData = new FormData();
    for (const [key, value] of formData.entries()) {
      if (!["url", "workspaceId", "method", "headers"].includes(key)) {
        forwardFormData.append(key, value);
      }
    }
    body = forwardFormData;
  } else {
    // Handle JSON requests
    const jsonBody = await request.json();
    targetUrl = jsonBody.url;
    workspaceId = jsonBody.workspaceId;
    method = jsonBody.method || "GET";
    headers = jsonBody.headers || {};
    body = jsonBody.body;
  }

  if (!targetUrl) {
    return new Response(JSON.stringify({ error: "Target URL is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Get auth token from request headers
  const authHeader = request.headers.get("authorization");
  if (authHeader) {
    headers["Authorization"] = authHeader;
  }

  // Create a new request with the target URL
  const proxyReq = new Request(targetUrl, {
    method,
    headers,
    body: isMultipart
      ? body
      : body
        ? typeof body === "string"
          ? body
          : JSON.stringify(body)
        : undefined,
  });

  try {
    const response = await proxyRequest(proxyReq, targetUrl, workspaceId);

    if (response instanceof Response) {
      return response;
    }

    // If proxyRequest returns something else, wrap it
    return new Response(
      JSON.stringify({ error: "Invalid response from proxy" }),
      {
        status: 502,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      },
    );
  } catch (error) {
    console.error("Proxy error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Proxy error",
      }),
      {
        status: 502,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      },
    );
  }
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return new Response(JSON.stringify({ error: "Target URL is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const proxyReq = new Request(url, {
    method: "GET",
    headers: request.headers,
  });

  return await proxyRequest(proxyReq, url);
}
