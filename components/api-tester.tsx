"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Play,
  Plus,
  X,
  Copy,
  Save,
  Clock,
  Database,
  AlertCircle,
  CheckCircle,
  Wifi,
  WifiOff,
  ExternalLink,
  Info,
} from "lucide-react"
import { toast } from "sonner"
import { LocalhostSetupGuide } from "@/components/localhost-setup-guide"

interface Header {
  key: string
  value: string
}

interface QueryParam {
  key: string
  value: string
}

interface ApiRequest {
  method: string
  url: string
  headers: Header[]
  queryParams: QueryParam[]
  body: string
}

interface ApiResponse {
  status: number
  statusText: string
  headers: Record<string, string>
  data: any
  time: number
  size: number
  ok: boolean
  error?: boolean
  message?: string
  suggestions?: string[]
  url?: string
}

export function ApiTester() {
  const [request, setRequest] = useState<ApiRequest>({
    method: "GET",
    url: "https://jsonplaceholder.typicode.com/posts/1",
    headers: [{ key: "Content-Type", value: "application/json" }],
    queryParams: [],
    body: "",
  })
  const [response, setResponse] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [proxyStatus, setProxyStatus] = useState<"checking" | "online" | "offline">("checking")
  const [requestHistory, setRequestHistory] = useState<
    Array<ApiRequest & { timestamp: string; response?: ApiResponse }>
  >([])

  // Load request history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("api-request-history")
    if (saved) {
      try {
        setRequestHistory(JSON.parse(saved))
      } catch {
        localStorage.removeItem("api-request-history")
      }
    }

    // Check proxy status
    checkProxyStatus()

    // Add this inside the useEffect hook
    const handleLoadRequest = (event: CustomEvent) => {
      const requestData = event.detail
      setRequest(requestData)
      toast.success("Request loaded from guide")
    }

    window.addEventListener("load-request", handleLoadRequest as EventListener)
    return () => {
      window.removeEventListener("load-request", handleLoadRequest as EventListener)
    }
  }, [])

  const checkProxyStatus = async () => {
    try {
      const response = await fetch("/api/proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method: "GET",
          url: "https://httpbin.org/status/200",
        }),
      })

      if (response.ok) {
        const result = await response.json()
        if (!result.error) {
          setProxyStatus("online")
        } else {
          setProxyStatus("offline")
        }
      } else {
        setProxyStatus("offline")
      }
    } catch {
      setProxyStatus("offline")
    }
  }

  const buildUrl = () => {
    let url = request.url.trim()

    // Add protocol if missing
    if (url && !url.match(/^https?:\/\//)) {
      url = `http://${url}`
    }

    const params = request.queryParams.filter((p) => p.key && p.value)
    if (params.length > 0) {
      const queryString = params.map((p) => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`).join("&")
      url += (url.includes("?") ? "&" : "?") + queryString
    }
    return url
  }

  const sendRequest = async () => {
    const finalUrl = buildUrl()

    if (!finalUrl) {
      toast.error("Please enter a valid URL")
      return
    }

    setLoading(true)
    setError(null)
    setResponse(null)
    const startTime = Date.now()

    try {
      // Prepare headers
      const headers: Record<string, string> = {}
      request.headers.forEach((header) => {
        if (header.key.trim() && header.value.trim()) {
          headers[header.key.trim()] = header.value.trim()
        }
      })

      console.log("Sending request:", {
        method: request.method,
        url: finalUrl,
        headers,
        body: request.body || undefined,
      })

      // Use our proxy API to handle the request
      const proxyResponse = await fetch("/api/proxy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          method: request.method,
          url: finalUrl,
          headers,
          body: request.method !== "GET" && request.body.trim() ? request.body : undefined,
        }),
      })

      const responseTime = Date.now() - startTime

      if (!proxyResponse.ok) {
        throw new Error(`Proxy server error: ${proxyResponse.status} ${proxyResponse.statusText}`)
      }

      let result
      try {
        const responseText = await proxyResponse.text()
        result = JSON.parse(responseText)
      } catch (parseError) {
        throw new Error("Invalid response from proxy server")
      }

      // Calculate response size
      const responseSize = new Blob([JSON.stringify(result.data || "")]).size

      const apiResponse: ApiResponse = {
        status: result.status || 0,
        statusText: result.statusText || "Unknown",
        headers: result.headers || {},
        data: result.data,
        time: responseTime,
        size: responseSize,
        ok: result.ok || false,
        error: result.error || false,
        message: result.message,
        suggestions: result.suggestions,
        url: result.url,
      }

      setResponse(apiResponse)

      // Save to history
      const historyItem = {
        ...request,
        timestamp: new Date().toISOString(),
        response: apiResponse,
      }
      const newHistory = [historyItem, ...requestHistory.slice(0, 49)] // Keep last 50
      setRequestHistory(newHistory)
      localStorage.setItem("api-request-history", JSON.stringify(newHistory))

      if (result.error) {
        setError(result.message || "Request failed")
        toast.error(result.message || "Request failed")
      } else if (apiResponse.ok) {
        toast.success(`Request completed successfully in ${responseTime}ms`)
      } else {
        toast.error(`Request failed with status ${apiResponse.status}`)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Network error occurred"
      setError(errorMessage)
      toast.error(errorMessage)
      console.error("Request error:", err)
    } finally {
      setLoading(false)
    }
  }

  const addHeader = () => {
    setRequest((prev) => ({
      ...prev,
      headers: [...prev.headers, { key: "", value: "" }],
    }))
  }

  const updateHeader = (index: number, field: "key" | "value", value: string) => {
    setRequest((prev) => ({
      ...prev,
      headers: prev.headers.map((header, i) => (i === index ? { ...header, [field]: value } : header)),
    }))
  }

  const removeHeader = (index: number) => {
    setRequest((prev) => ({
      ...prev,
      headers: prev.headers.filter((_, i) => i !== index),
    }))
  }

  const addQueryParam = () => {
    setRequest((prev) => ({
      ...prev,
      queryParams: [...prev.queryParams, { key: "", value: "" }],
    }))
  }

  const updateQueryParam = (index: number, field: "key" | "value", value: string) => {
    setRequest((prev) => ({
      ...prev,
      queryParams: prev.queryParams.map((param, i) => (i === index ? { ...param, [field]: value } : param)),
    }))
  }

  const removeQueryParam = (index: number) => {
    setRequest((prev) => ({
      ...prev,
      queryParams: prev.queryParams.filter((_, i) => i !== index),
    }))
  }

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return "bg-green-100 text-green-800 border-green-200"
    if (status >= 300 && status < 400) return "bg-blue-100 text-blue-800 border-blue-200"
    if (status >= 400 && status < 500) return "bg-yellow-100 text-yellow-800 border-yellow-200"
    if (status >= 500) return "bg-red-100 text-red-800 border-red-200"
    return "bg-gray-100 text-gray-800 border-gray-200"
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatResponseData = (data: any) => {
    if (data === null || data === undefined) return "null"
    if (typeof data === "string") return data
    if (typeof data === "object" && data.type === "binary") {
      return `${data.message || "Binary data"}\nContent-Type: ${data.contentType}\nSize: ${formatBytes(data.size || 0)}`
    }
    return JSON.stringify(data, null, 2)
  }

  const loadFromHistory = (historyItem: any) => {
    setRequest({
      method: historyItem.method,
      url: historyItem.url,
      headers: historyItem.headers,
      queryParams: historyItem.queryParams || [],
      body: historyItem.body,
    })
    if (historyItem.response) {
      setResponse(historyItem.response)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">REST API Client</h1>
          <p className="text-muted-foreground">Professional API testing tool - works with any HTTP endpoint</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={checkProxyStatus}>
            {proxyStatus === "online" ? <Wifi className="h-4 w-4 mr-2" /> : <WifiOff className="h-4 w-4 mr-2" />}
            {proxyStatus === "checking" ? "Checking..." : proxyStatus === "online" ? "Online" : "Offline"}
          </Button>
          <Button variant="outline" size="sm">
            <Save className="h-4 w-4 mr-2" />
            Save Request
          </Button>
        </div>
      </div>

      {/* Connection Status */}
      <Card className={proxyStatus === "online" ? "border-green-200 bg-green-50" : "border-yellow-200 bg-yellow-50"}>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            {proxyStatus === "online" ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-900">API Client Ready</span>
                <span className="text-green-700 text-sm">- Can test external APIs and some localhost endpoints</span>
              </>
            ) : (
              <>
                <Info className="h-5 w-5 text-yellow-600" />
                <span className="font-medium text-yellow-900">Limited Mode</span>
                <span className="text-yellow-700 text-sm">- External APIs only, localhost may not work</span>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Request Panel - Takes 2 columns */}
        <div className="xl:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>HTTP Request</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* URL and Method */}
              <div className="flex gap-2">
                <Select
                  value={request.method}
                  onValueChange={(value) => setRequest((prev) => ({ ...prev, method: value }))}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GET">GET</SelectItem>
                    <SelectItem value="POST">POST</SelectItem>
                    <SelectItem value="PUT">PUT</SelectItem>
                    <SelectItem value="DELETE">DELETE</SelectItem>
                    <SelectItem value="PATCH">PATCH</SelectItem>
                    <SelectItem value="HEAD">HEAD</SelectItem>
                    <SelectItem value="OPTIONS">OPTIONS</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Enter request URL (e.g., https://api.example.com/users)"
                  value={request.url}
                  onChange={(e) => setRequest((prev) => ({ ...prev, url: e.target.value }))}
                  className="flex-1"
                />
                <Button onClick={sendRequest} disabled={loading || !request.url.trim()} size="lg">
                  <Play className="h-4 w-4 mr-2" />
                  {loading ? "Sending..." : "Send"}
                </Button>
              </div>

              {/* Request Details */}
              <Tabs defaultValue="params" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="params">Query Params</TabsTrigger>
                  <TabsTrigger value="headers">Headers</TabsTrigger>
                  <TabsTrigger value="body">Body</TabsTrigger>
                </TabsList>

                <TabsContent value="params" className="space-y-3">
                  {request.queryParams.map((param, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder="Parameter key"
                        value={param.key}
                        onChange={(e) => updateQueryParam(index, "key", e.target.value)}
                      />
                      <Input
                        placeholder="Parameter value"
                        value={param.value}
                        onChange={(e) => updateQueryParam(index, "value", e.target.value)}
                      />
                      <Button variant="ghost" size="sm" onClick={() => removeQueryParam(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={addQueryParam}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Parameter
                  </Button>
                </TabsContent>

                <TabsContent value="headers" className="space-y-3">
                  {request.headers.map((header, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder="Header key (e.g., Authorization)"
                        value={header.key}
                        onChange={(e) => updateHeader(index, "key", e.target.value)}
                      />
                      <Input
                        placeholder="Header value (e.g., Bearer token123)"
                        value={header.value}
                        onChange={(e) => updateHeader(index, "value", e.target.value)}
                      />
                      <Button variant="ghost" size="sm" onClick={() => removeHeader(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={addHeader}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Header
                  </Button>
                </TabsContent>

                <TabsContent value="body">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Database className="h-4 w-4" />
                      <span>Request Body (JSON, XML, raw text)</span>
                    </div>
                    <Textarea
                      placeholder='{"name": "Product Name", "price": 99.99, "category": "electronics"}'
                      value={request.body}
                      onChange={(e) => setRequest((prev) => ({ ...prev, body: e.target.value }))}
                      rows={12}
                      className="font-mono text-sm"
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Response Panel - Takes 1 column */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Response</CardTitle>
                {response && (
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(response.status)}>
                      {response.status} {response.statusText}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {response.time}ms
                    </div>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {error || (response && response.error) ? (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <p className="text-red-800 font-medium">Request Failed</p>
                  </div>
                  <p className="text-red-600 text-sm mb-3">{error || response?.message}</p>

                  {response?.suggestions && (
                    <div className="mt-3">
                      <p className="text-red-700 font-medium text-sm mb-2">Suggestions:</p>
                      <ul className="text-red-600 text-sm space-y-1">
                        {response.suggestions.map((suggestion, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-red-400">•</span>
                            <span>{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : response ? (
                <div className="space-y-4">
                  {/* Response Stats */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Size: {formatBytes(response.size)}</span>
                    <span>Time: {response.time}ms</span>
                    <span>Status: {response.ok ? "Success" : "Error"}</span>
                    {response.url && response.url !== buildUrl() && (
                      <div className="flex items-center gap-1">
                        <ExternalLink className="h-3 w-3" />
                        <span>Redirected</span>
                      </div>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(formatResponseData(response.data))
                        toast.success("Response copied to clipboard")
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>

                  <Tabs defaultValue="body" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="body">Response Body</TabsTrigger>
                      <TabsTrigger value="headers">Headers ({Object.keys(response.headers).length})</TabsTrigger>
                    </TabsList>

                    <TabsContent value="body">
                      <ScrollArea className="h-96 w-full rounded-md border p-4">
                        <pre className="text-sm font-mono whitespace-pre-wrap">{formatResponseData(response.data)}</pre>
                      </ScrollArea>
                    </TabsContent>

                    <TabsContent value="headers">
                      <ScrollArea className="h-96 w-full rounded-md border p-4">
                        <div className="space-y-2">
                          {Object.entries(response.headers).map(([key, value]) => (
                            <div key={key} className="flex justify-between text-sm border-b pb-1">
                              <span className="font-medium">{key}:</span>
                              <span className="text-muted-foreground font-mono text-right break-all">{value}</span>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </TabsContent>
                  </Tabs>
                </div>
              ) : (
                <div className="flex items-center justify-center h-96 text-muted-foreground">
                  <div className="text-center">
                    <Play className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Send a request to see the response here</p>
                    <p className="text-sm mt-2">Supports all HTTP methods and response types</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Requests */}
          {requestHistory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-2">
                    {requestHistory.slice(0, 5).map((item, index) => (
                      <div
                        key={index}
                        className="p-2 border rounded cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => loadFromHistory(item)}
                      >
                        <div className="flex items-center gap-2 text-sm">
                          <Badge variant="outline" className="text-xs">
                            {item.method}
                          </Badge>
                          <span className="font-mono text-xs truncate flex-1">{item.url}</span>
                          {item.response && (
                            <Badge className={getStatusColor(item.response.status)} variant="outline">
                              {item.response.status}
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {new Date(item.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Localhost Setup Guide */}
      <LocalhostSetupGuide />

      {/* API Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Test Examples</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                name: "Localhost Health",
                method: "GET",
                url: "http://localhost:3000/api/health",
                description: "Test your local server",
              },
              {
                name: "JSONPlaceholder",
                method: "GET",
                url: "https://jsonplaceholder.typicode.com/posts/1",
                description: "Test external API",
              },
              {
                name: "HTTPBin GET",
                method: "GET",
                url: "https://httpbin.org/get",
                description: "Test GET request",
              },
              {
                name: "Local POST",
                method: "POST",
                url: "http://localhost:3000/api/users",
                description: "Test local POST",
                body: JSON.stringify({ name: "Test User", email: "test@example.com" }, null, 2),
              },
            ].map((example, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-4 flex flex-col items-start text-left bg-transparent"
                onClick={() =>
                  setRequest({
                    method: example.method,
                    url: example.url,
                    headers: [{ key: "Content-Type", value: "application/json" }],
                    queryParams: [],
                    body: example.body || "",
                  })
                }
              >
                <div className="font-medium">{example.name}</div>
                <div className="text-xs text-muted-foreground mt-1">{example.description}</div>
                <Badge variant="secondary" className="mt-2 text-xs">
                  {example.method}
                </Badge>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
