"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Trash2, Plus, Send, Save, Code, Play } from "lucide-react"
import { toast } from "sonner"

interface Tab {
  id: string
  name: string
  method: string
  url: string
  isModified: boolean
  isSaved: boolean
}

interface Header {
  id: string
  key: string
  value: string
  enabled: boolean
}

interface PostmanRequestBuilderProps {
  request: Tab
  onSend: (requestData: any) => void
  onSave: () => void
  onRequestChange?: (updates: Partial<Tab>) => void
}

export function PostmanRequestBuilder({ request, onSend, onSave, onRequestChange }: PostmanRequestBuilderProps) {
  const [method, setMethod] = useState(request.method)
  const [url, setUrl] = useState(request.url)
  const [headers, setHeaders] = useState<Header[]>([
    { id: "1", key: "Content-Type", value: "application/json", enabled: true },
    { id: "2", key: "", value: "", enabled: true },
  ])
  const [body, setBody] = useState("")
  const [preRequestScript, setPreRequestScript] = useState(`// Pre-request Script
// This script will be executed before the request is sent

// Set environment variables
pm.environment.set("timestamp", Date.now());

// Add custom headers
pm.request.headers.add({
    key: "X-Request-ID", 
    value: Math.random().toString(36).substr(2, 9)
});

console.log("Pre-request script executed");`)

  const [testScript, setTestScript] = useState(`// Test Script
// This script will be executed after the response is received

// Test status code
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

// Test response time
pm.test("Response time is less than 1000ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(1000);
});

// Test response body
pm.test("Response has required fields", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('id');
});

console.log("Test script executed");`)

  // Update local state when request prop changes
  useEffect(() => {
    setMethod(request.method)
    setUrl(request.url)
  }, [request.id, request.method, request.url])

  const handleMethodChange = (newMethod: string) => {
    setMethod(newMethod)
    onRequestChange?.({ method: newMethod, isModified: true })
  }

  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl)
    onRequestChange?.({ url: newUrl, isModified: true })
  }

  const addHeader = () => {
    const newHeader: Header = {
      id: Date.now().toString(),
      key: "",
      value: "",
      enabled: true,
    }
    setHeaders([...headers, newHeader])
  }

  const updateHeader = (id: string, field: keyof Header, value: string | boolean) => {
    setHeaders(headers.map((header) => (header.id === id ? { ...header, [field]: value } : header)))
  }

  const removeHeader = (id: string) => {
    setHeaders(headers.filter((header) => header.id !== id))
  }

  const executePreRequestScript = () => {
    try {
      // Create a mock pm object for the script
      const pm = {
        environment: {
          set: (key: string, value: any) => {
            console.log(`Environment variable set: ${key} = ${value}`)
          },
          get: (key: string) => {
            console.log(`Environment variable get: ${key}`)
            return null
          },
        },
        request: {
          headers: {
            add: (header: { key: string; value: string }) => {
              console.log(`Header added: ${header.key} = ${header.value}`)
              const newHeader: Header = {
                id: Date.now().toString(),
                key: header.key,
                value: header.value,
                enabled: true,
              }
              setHeaders((prev) => [...prev.filter((h) => h.key !== header.key), newHeader])
            },
          },
        },
      }

      // Execute the script
      const scriptFunction = new Function("pm", "console", preRequestScript)
      scriptFunction(pm, console)
      toast.success("Pre-request script executed successfully")
    } catch (error) {
      console.error("Pre-request script error:", error)
      toast.error("Pre-request script execution failed")
    }
  }

  const handleSend = () => {
    // Execute pre-request script
    executePreRequestScript()

    const enabledHeaders = headers.filter((h) => h.enabled && h.key.trim())
    const headersObject = enabledHeaders.reduce(
      (acc, header) => {
        acc[header.key] = header.value
        return acc
      },
      {} as Record<string, string>,
    )

    const requestData = {
      method,
      url,
      headers: headersObject,
      body: method !== "GET" ? body : undefined,
      preRequestScript,
      testScript,
    }

    onSend(requestData)
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Request URL Bar */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex gap-2">
          <Select value={method} onValueChange={handleMethodChange}>
            <SelectTrigger className="w-24">
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
            placeholder="Enter request URL"
            value={url}
            onChange={(e) => handleUrlChange(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleSend} className="bg-orange-500 hover:bg-orange-600">
            <Send className="h-4 w-4 mr-2" />
            Send
          </Button>
          <Button variant="outline" onClick={onSave}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      {/* Request Configuration Tabs */}
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="headers" className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="headers">Headers</TabsTrigger>
            <TabsTrigger value="body">Body</TabsTrigger>
            <TabsTrigger value="params">Params</TabsTrigger>
            <TabsTrigger value="pre-request">Pre-request Script</TabsTrigger>
            <TabsTrigger value="tests">Tests</TabsTrigger>
          </TabsList>

          <TabsContent value="headers" className="flex-1 p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Headers</h3>
                <Button variant="outline" size="sm" onClick={addHeader}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Header
                </Button>
              </div>
              <ScrollArea className="h-64">
                <div className="space-y-2">
                  {headers.map((header) => (
                    <div key={header.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={header.enabled}
                        onChange={(e) => updateHeader(header.id, "enabled", e.target.checked)}
                        className="rounded"
                      />
                      <Input
                        placeholder="Key"
                        value={header.key}
                        onChange={(e) => updateHeader(header.id, "key", e.target.value)}
                        className="flex-1"
                      />
                      <Input
                        placeholder="Value"
                        value={header.value}
                        onChange={(e) => updateHeader(header.id, "value", e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeHeader(header.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="body" className="flex-1 p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Request Body</h3>
                <Badge variant="outline">JSON</Badge>
              </div>
              <Textarea
                placeholder="Enter request body (JSON)"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="h-64 font-mono text-sm"
              />
            </div>
          </TabsContent>

          <TabsContent value="params" className="flex-1 p-4">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Query Parameters</h3>
              <p className="text-sm text-gray-500">Query parameters will be automatically parsed from the URL</p>
            </div>
          </TabsContent>

          <TabsContent value="pre-request" className="flex-1 p-4">
            <div className="space-y-4 h-full flex flex-col">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Pre-request Script</h3>
                <Button variant="outline" size="sm" onClick={executePreRequestScript}>
                  <Play className="h-4 w-4 mr-2" />
                  Test Script
                </Button>
              </div>
              <Textarea
                placeholder="Write JavaScript code to execute before the request..."
                value={preRequestScript}
                onChange={(e) => setPreRequestScript(e.target.value)}
                className="flex-1 font-mono text-sm"
              />
            </div>
          </TabsContent>

          <TabsContent value="tests" className="flex-1 p-4">
            <div className="space-y-4 h-full flex flex-col">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Test Script</h3>
                <div className="flex items-center gap-2">
                  <Code className="h-4 w-4 text-gray-500" />
                  <span className="text-xs text-gray-500">JavaScript</span>
                </div>
              </div>
              <Textarea
                placeholder="Write JavaScript code to test the response..."
                value={testScript}
                onChange={(e) => setTestScript(e.target.value)}
                className="flex-1 font-mono text-sm"
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
