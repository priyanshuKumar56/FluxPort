"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Copy, Download, Eye, Code, Clock, Database } from "lucide-react"
import { toast } from "sonner"

interface ApiResponse {
  status: number
  statusText: string
  time: number
  size: number
  headers: Record<string, string>
  data: any
  ok: boolean
  error?: boolean
  message?: string
  suggestions?: string[]
  contentType?: string
}

interface PostmanResponseViewerProps {
  response: ApiResponse | null
  loading: boolean
}

export function PostmanResponseViewer({ response, loading }: PostmanResponseViewerProps) {
  const [activeTab, setActiveTab] = useState("body")

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return "bg-green-100 text-green-800 border-green-200"
    if (status >= 300 && status < 400) return "bg-yellow-100 text-yellow-800 border-yellow-200"
    if (status >= 400 && status < 500) return "bg-red-100 text-red-800 border-red-200"
    if (status >= 500) return "bg-red-100 text-red-800 border-red-200"
    return "bg-gray-100 text-gray-800 border-gray-200"
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard")
  }

  const formatJson = (obj: any) => {
    try {
      return JSON.stringify(obj, null, 2)
    } catch {
      return String(obj)
    }
  }

  if (loading) {
    return (
      <div className="h-full border-l border-gray-200 bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-500">Sending request...</p>
        </div>
      </div>
    )
  }

  if (!response) {
    return (
      <div className="h-full border-l border-gray-200 bg-white flex items-center justify-center">
        <div className="text-center text-gray-500">
          <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No response yet</p>
          <p className="text-sm">Send a request to see the response</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full border-l border-gray-200 bg-white flex flex-col">
      {/* Response Status Bar */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(response.status)}>
              {response.status} {response.statusText}
            </Badge>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              {response.time}ms
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Database className="h-4 w-4" />
              {formatBytes(response.size)}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => copyToClipboard(formatJson(response.data))}>
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </div>

        {response.error && response.message && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-2">
            <p className="text-red-800 text-sm font-medium">Error</p>
            <p className="text-red-700 text-sm">{response.message}</p>
            {response.suggestions && response.suggestions.length > 0 && (
              <div className="mt-2">
                <p className="text-red-800 text-sm font-medium">Suggestions:</p>
                <ul className="list-disc list-inside text-red-700 text-sm">
                  {response.suggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Response Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="body">Body</TabsTrigger>
            <TabsTrigger value="headers">Headers</TabsTrigger>
            <TabsTrigger value="cookies">Cookies</TabsTrigger>
            <TabsTrigger value="test-results">Test Results</TabsTrigger>
          </TabsList>

          <TabsContent value="body" className="flex-1 p-4">
            <div className="space-y-4 h-full flex flex-col">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Response Body</h3>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Pretty
                  </Button>
                  <Button variant="outline" size="sm">
                    <Code className="h-4 w-4 mr-2" />
                    Raw
                  </Button>
                </div>
              </div>
              <ScrollArea className="flex-1">
                {response.contentType && !response.contentType.includes("application/json") ? (
                  <div className="space-y-2">
                    <div className="text-xs text-gray-500">{response.contentType}</div>
                    <pre className="text-sm font-mono bg-gray-50 p-4 rounded-md overflow-auto whitespace-pre-wrap break-words">
                      {typeof response.data === "string" ? response.data : formatJson(response.data)}
                    </pre>
                  </div>
                ) : (
                  <pre className="text-sm font-mono bg-gray-50 p-4 rounded-md overflow-auto">
                    {formatJson(response.data)}
                  </pre>
                )}
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="headers" className="flex-1 p-4">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Response Headers</h3>
              <ScrollArea className="h-64">
                <div className="space-y-2">
                  {Object.entries(response.headers || {}).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-4 py-2 border-b border-gray-100">
                      <span className="font-medium text-sm w-1/3">{key}</span>
                      <span className="text-sm text-gray-600 flex-1">{value}</span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="cookies" className="flex-1 p-4">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Cookies</h3>
              <p className="text-sm text-gray-500">No cookies received</p>
            </div>
          </TabsContent>

          <TabsContent value="test-results" className="flex-1 p-4">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Test Results</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-800">Status code is {response.status}</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-800">Response time is {response.time}ms</span>
                </div>
                {response.data && (
                  <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-800">Response body is valid JSON</span>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
