"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Trash2, Play, Clock } from "lucide-react"

interface HistoryItem {
  method: string
  url: string
  headers: Array<{ key: string; value: string }>
  queryParams?: Array<{ key: string; value: string }>
  body: string
  timestamp: string
  response?: {
    status: number
    statusText: string
    time: number
  }
}

export function RequestHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const saved = localStorage.getItem("api-request-history")
    if (saved) {
      setHistory(JSON.parse(saved))
    }
  }, [])

  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem("api-request-history")
  }

  const deleteItem = (index: number) => {
    const newHistory = history.filter((_, i) => i !== index)
    setHistory(newHistory)
    localStorage.setItem("api-request-history", JSON.stringify(newHistory))
  }

  const replayRequest = (item: HistoryItem) => {
    // Dispatch event to load this request in the API tester
    window.dispatchEvent(new CustomEvent("load-request", { detail: item }))
    // Navigate to API tester
    window.dispatchEvent(new CustomEvent("sidebar-navigate", { detail: "tester" }))
  }

  const filteredHistory = history.filter(
    (item) =>
      item.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.method.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status?: number) => {
    if (!status) return "bg-gray-100 text-gray-800"
    if (status >= 200 && status < 300) return "bg-green-100 text-green-800"
    if (status >= 400 && status < 500) return "bg-yellow-100 text-yellow-800"
    if (status >= 500) return "bg-red-100 text-red-800"
    return "bg-gray-100 text-gray-800"
  }

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET":
        return "bg-green-100 text-green-800"
      case "POST":
        return "bg-blue-100 text-blue-800"
      case "PUT":
        return "bg-yellow-100 text-yellow-800"
      case "DELETE":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Request History</h1>
          <p className="text-muted-foreground">View and replay your previous API requests</p>
        </div>
        <Button variant="outline" onClick={clearHistory} disabled={history.length === 0}>
          <Trash2 className="h-4 w-4 mr-2" />
          Clear History
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Request History ({history.length})</CardTitle>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredHistory.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {history.length === 0 ? "No requests in history yet" : "No requests match your search"}
            </div>
          ) : (
            <ScrollArea className="h-[600px]">
              <div className="space-y-3">
                {filteredHistory.map((item, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge className={getMethodColor(item.method)}>{item.method}</Badge>
                        {item.response && (
                          <Badge className={getStatusColor(item.response.status)}>{item.response.status}</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {new Date(item.timestamp).toLocaleString()}
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => replayRequest(item)}>
                          <Play className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => deleteItem(index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="font-mono text-sm mb-2 break-all">{item.url}</div>

                    {item.response && (
                      <div className="text-sm text-muted-foreground">Response time: {item.response.time}ms</div>
                    )}

                    {item.body && (
                      <div className="mt-2 p-2 bg-muted rounded text-sm">
                        <div className="font-medium mb-1">Request Body:</div>
                        <pre className="text-xs font-mono truncate">{item.body}</pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
