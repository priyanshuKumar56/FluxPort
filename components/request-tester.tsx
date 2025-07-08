"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Play, Plus, X, Copy, Download } from "lucide-react"

interface Header {
  key: string
  value: string
}

interface RequestTab {
  id: string
  name: string
  method: string
  url: string
  headers: Header[]
  body: string
}

export function RequestTester() {
  const [tabs, setTabs] = useState<RequestTab[]>([
    {
      id: "1",
      name: "New Request",
      method: "GET",
      url: "https://api.example.com/users",
      headers: [{ key: "Content-Type", value: "application/json" }],
      body: "",
    },
  ])
  const [activeTab, setActiveTab] = useState("1")
  const [response, setResponse] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const currentTab = tabs.find((tab) => tab.id === activeTab)

  const addNewTab = () => {
    const newTab: RequestTab = {
      id: Date.now().toString(),
      name: "New Request",
      method: "GET",
      url: "",
      headers: [{ key: "", value: "" }],
      body: "",
    }
    setTabs([...tabs, newTab])
    setActiveTab(newTab.id)
  }

  const closeTab = (tabId: string) => {
    if (tabs.length === 1) return
    const newTabs = tabs.filter((tab) => tab.id !== tabId)
    setTabs(newTabs)
    if (activeTab === tabId) {
      setActiveTab(newTabs[0].id)
    }
  }

  const updateTab = (tabId: string, updates: Partial<RequestTab>) => {
    setTabs(tabs.map((tab) => (tab.id === tabId ? { ...tab, ...updates } : tab)))
  }

  const addHeader = () => {
    if (!currentTab) return
    const newHeaders = [...currentTab.headers, { key: "", value: "" }]
    updateTab(currentTab.id, { headers: newHeaders })
  }

  const updateHeader = (index: number, field: "key" | "value", value: string) => {
    if (!currentTab) return
    const newHeaders = [...currentTab.headers]
    newHeaders[index][field] = value
    updateTab(currentTab.id, { headers: newHeaders })
  }

  const removeHeader = (index: number) => {
    if (!currentTab) return
    const newHeaders = currentTab.headers.filter((_, i) => i !== index)
    updateTab(currentTab.id, { headers: newHeaders })
  }

  const sendRequest = async () => {
    if (!currentTab) return

    setLoading(true)
    // Simulate API request
    setTimeout(() => {
      setResponse({
        status: 200,
        statusText: "OK",
        headers: {
          "content-type": "application/json",
          "x-response-time": "45ms",
        },
        data: {
          users: [
            { id: 1, name: "John Doe", email: "john@example.com" },
            { id: 2, name: "Jane Smith", email: "jane@example.com" },
          ],
          total: 2,
          page: 1,
        },
      })
      setLoading(false)
    }, 1000)
  }

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return "bg-green-100 text-green-800"
    if (status >= 400 && status < 500) return "bg-yellow-100 text-yellow-800"
    if (status >= 500) return "bg-red-100 text-red-800"
    return "bg-gray-100 text-gray-800"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Request Tester</h2>
          <p className="text-muted-foreground">Test your API endpoints with a Postman-like interface</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Request Panel */}
        <Card className="h-fit">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Request</CardTitle>
              <Button size="sm" onClick={addNewTab}>
                <Plus className="h-4 w-4 mr-1" />
                New Tab
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Tabs */}
            <div className="flex items-center gap-1 border-b">
              {tabs.map((tab) => (
                <div
                  key={tab.id}
                  className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer border-b-2 ${
                    activeTab === tab.id ? "border-primary text-primary" : "border-transparent hover:text-primary"
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span>{tab.name}</span>
                  {tabs.length > 1 && (
                    <X
                      className="h-3 w-3 hover:text-red-500"
                      onClick={(e) => {
                        e.stopPropagation()
                        closeTab(tab.id)
                      }}
                    />
                  )}
                </div>
              ))}
            </div>

            {currentTab && (
              <>
                {/* URL and Method */}
                <div className="flex gap-2">
                  <Select
                    value={currentTab.method}
                    onValueChange={(value) => updateTab(currentTab.id, { method: value })}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GET">GET</SelectItem>
                      <SelectItem value="POST">POST</SelectItem>
                      <SelectItem value="PUT">PUT</SelectItem>
                      <SelectItem value="DELETE">DELETE</SelectItem>
                      <SelectItem value="PATCH">PATCH</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Enter request URL"
                    value={currentTab.url}
                    onChange={(e) => updateTab(currentTab.id, { url: e.target.value })}
                    className="flex-1"
                  />
                  <Button onClick={sendRequest} disabled={loading}>
                    <Play className="h-4 w-4 mr-1" />
                    {loading ? "Sending..." : "Send"}
                  </Button>
                </div>

                {/* Request Details */}
                <Tabs defaultValue="headers" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="headers">Headers</TabsTrigger>
                    <TabsTrigger value="params">Params</TabsTrigger>
                    <TabsTrigger value="body">Body</TabsTrigger>
                  </TabsList>

                  <TabsContent value="headers" className="space-y-2">
                    {currentTab.headers.map((header, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder="Header key"
                          value={header.key}
                          onChange={(e) => updateHeader(index, "key", e.target.value)}
                        />
                        <Input
                          placeholder="Header value"
                          value={header.value}
                          onChange={(e) => updateHeader(index, "value", e.target.value)}
                        />
                        <Button variant="ghost" size="sm" onClick={() => removeHeader(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={addHeader}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add Header
                    </Button>
                  </TabsContent>

                  <TabsContent value="params">
                    <div className="text-sm text-muted-foreground">
                      Query parameters will be extracted from the URL automatically.
                    </div>
                  </TabsContent>

                  <TabsContent value="body">
                    <Textarea
                      placeholder="Request body (JSON, XML, etc.)"
                      value={currentTab.body}
                      onChange={(e) => updateTab(currentTab.id, { body: e.target.value })}
                      rows={8}
                    />
                  </TabsContent>
                </Tabs>
              </>
            )}
          </CardContent>
        </Card>

        {/* Response Panel */}
        <Card className="h-fit">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Response</CardTitle>
              {response && (
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(response.status)}>
                    {response.status} {response.statusText}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {response ? (
              <Tabs defaultValue="body" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="body">Body</TabsTrigger>
                  <TabsTrigger value="headers">Headers</TabsTrigger>
                </TabsList>

                <TabsContent value="body">
                  <ScrollArea className="h-96 w-full rounded-md border p-4">
                    <pre className="text-sm">{JSON.stringify(response.data, null, 2)}</pre>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="headers">
                  <ScrollArea className="h-96 w-full rounded-md border p-4">
                    <div className="space-y-2">
                      {Object.entries(response.headers).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-sm">
                          <span className="font-medium">{key}:</span>
                          <span className="text-muted-foreground">{value as string}</span>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="flex items-center justify-center h-96 text-muted-foreground">
                Send a request to see the response here
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
