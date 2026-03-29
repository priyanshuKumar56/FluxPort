"use client"

import { useState, useCallback } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Save, Loader2, RefreshCw, X, ExternalLink } from "lucide-react"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { KeyValueTable, type KeyValuePair } from "./key-value-table"
import { AuthSection, type AuthType } from "./auth-section"
import { ResponsePanel } from "./response-panel"
import { useAppDispatch } from "@/lib/store/hooks"
import { createLog } from "@/lib/store/slices/logsSlice"
import { cn } from "@/lib/utils"

interface GraphqlRequestBuilderProps {
  initialData?: {
    url?: string
    query?: string
    headers?: any
  }
  onUrlChange?: (url: string) => void
}

export function GraphqlRequestBuilder({ initialData, onUrlChange }: GraphqlRequestBuilderProps) {
  const dispatch = useAppDispatch()
  const [url, setUrl] = useState(initialData?.url || "")
  const [query, setQuery] = useState(initialData?.query || "")
  const [variables, setVariables] = useState("")
  const [headers, setHeaders] = useState<KeyValuePair[]>(
    initialData?.headers || [{ id: "1", key: "", value: "", enabled: true }]
  )
  const [authType, setAuthType] = useState<AuthType>("none")
  const [authData, setAuthData] = useState<any>({})
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState<any>(null)
  const [isCopied, setIsCopied] = useState(false)
  const [schemaVisible, setSchemaVisible] = useState(true)
  const [assertions, setAssertions] = useState<any[]>([])
  const [operationCount, setOperationCount] = useState(1)

  const handleSend = async () => {
    if (!url) return
    setIsLoading(true)
    setResponse(null)

    try {
      const startTime = Date.now()
      let parsedVars = {}
      if (variables.trim()) {
        try {
          parsedVars = JSON.parse(variables)
        } catch (e) {
          // Invalid JSON variables
        }
      }

      const activeHeaders = headers
        .filter((h) => h.enabled && h.key)
        .reduce((acc: any, h) => {
          acc[h.key] = h.value
          return acc
        }, {})

      if (authType === "bearer" && authData.token) {
        activeHeaders["Authorization"] = `Bearer ${authData.token}`
      } else if (authType === "basic" && authData.username) {
        const credentials = btoa(`${authData.username}:${authData.password || ""}`)
        activeHeaders["Authorization"] = `Basic ${credentials}`
      }

      activeHeaders["Content-Type"] = "application/json"

      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
      const proxyHeaders: Record<string, string> = { "Content-Type": "application/json" }
      if (token) proxyHeaders["Authorization"] = `Bearer ${token}`

      const res = await fetch("/api/proxy", {
        method: "POST",
        headers: proxyHeaders,
        body: JSON.stringify({
          url,
          method: "POST",
          headers: activeHeaders,
          body: JSON.stringify({ query, variables: parsedVars }),
        }),
      })

      const duration = Date.now() - startTime
      const responseHeaders: Record<string, string> = {}
      res.headers.forEach((value, key) => {
        responseHeaders[key] = value
      })

      let data: any = null
      let bodyText = ""
      let bodySize = 0

      try {
        bodyText = await res.text()
        bodySize = bodyText ? new Blob([bodyText]).size : 0
        if (bodyText) {
          try {
            data = JSON.parse(bodyText)
          } catch (e) {
            data = bodyText
          }
        }
      } catch (e) {
        data = "Failed to read response"
      }

      setResponse({
        status: res.status,
        statusText: res.statusText || (res.ok ? "OK" : "Error"),
        time: duration,
        size: bodySize,
        body: data,
        headers: responseHeaders,
        error: res.ok ? null : typeof data === "object" && data?.error ? data.error : null,
      })

      setAssertions([
        { id: 1, type: "Status Code is 200", passed: res.status === 200 },
        { id: 2, type: "Response time < 500ms", passed: duration < 500 },
        { id: 3, type: "No GraphQL errors", passed: !data?.errors },
      ])

      dispatch(
        createLog({
          requestUrl: url,
          requestMethod: "POST",
          responseStatus: res.status,
          latencyMs: duration,
        })
      )
    } catch (err: any) {
      setResponse({
        error: err.message || "Network Error",
        body: err.stack || String(err),
        status: 0,
        statusText: "Network Error",
        time: 0,
        size: 0,
        headers: {},
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = () => {
    alert("GraphQL request saved!")
  }

  const useExampleUrl = () => {
    const exampleUrl = "https://countries.trevorblades.com/graphql"
    setUrl(exampleUrl)
    onUrlChange?.(exampleUrl)
    setQuery(`query {
  countries {
    code
    name
    emoji
  }
}`)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  const downloadResponse = () => {
    if (!response?.body) return
    const blob = new Blob([JSON.stringify(response.body, null, 2)], { type: "application/json" })
    const downloadUrl = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = downloadUrl
    a.download = `graphql-response-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(downloadUrl)
  }

  return (
    <ResizablePanelGroup direction="horizontal">
      {/* Left: Request panel */}
      <ResizablePanel defaultSize={50} minSize={30}>
        <div className="flex flex-col h-full bg-background">
          {/* URL bar */}
          <div className="flex items-center gap-2 p-3 border-b border-border">
            <div className="flex-1 relative">
              <Input
                placeholder="Enter or paste GraphQL endpoint URL"
                className="font-mono text-xs bg-input/50 border-border focus:border-primary/50 pr-28"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value)
                  onUrlChange?.(e.target.value)
                }}
              />
            </div>
            <button
              onClick={useExampleUrl}
              className="flex items-center gap-1 px-2 py-1.5 text-[10px] font-medium text-muted-foreground hover:text-primary border border-border rounded-md hover:border-primary/30 transition-colors whitespace-nowrap"
            >
              ⚙ Use example URL
            </button>
            <Button
              onClick={handleSend}
              disabled={isLoading}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-4 shadow-lg shadow-emerald-600/20"
            >
              {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Send"}
              <span className="ml-1 text-[9px] opacity-70 kbd">Ctrl↵</span>
            </Button>
            <Button variant="outline" size="sm" className="text-xs font-medium border-border" onClick={handleSave}>
              Save
            </Button>
          </div>

          {/* Tabs: Query, Headers, Authorization, Scripts */}
          <Tabs defaultValue="query" className="flex-1 flex flex-col">
            <div className="px-3 border-b border-border bg-muted/10">
              <TabsList className="bg-transparent h-9 gap-1 p-0">
                <TabsTrigger
                  value="query"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary bg-transparent shadow-none px-3 text-xs font-medium"
                >
                  Query
                </TabsTrigger>
                <TabsTrigger
                  value="headers"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary bg-transparent shadow-none px-3 text-xs font-medium"
                >
                  Headers
                </TabsTrigger>
                <TabsTrigger
                  value="auth"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary bg-transparent shadow-none px-3 text-xs font-medium"
                >
                  Authorization
                </TabsTrigger>
                <TabsTrigger
                  value="scripts"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary bg-transparent shadow-none px-3 text-xs font-medium"
                >
                  Scripts
                </TabsTrigger>
              </TabsList>
            </div>

            <ScrollArea className="flex-1">
              <TabsContent value="query" className="mt-0 h-full">
                <ResizablePanelGroup direction="horizontal">
                  {/* Operations + Query editor */}
                  <ResizablePanel defaultSize={schemaVisible ? 60 : 100} minSize={40}>
                    <div className="flex flex-col h-full">
                      {/* Operations header */}
                      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/10">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Operations</span>
                        <Badge variant="secondary" className="text-[9px] h-4 px-1.5">{operationCount}</Badge>
                      </div>
                      {/* Query editor */}
                      <div className="flex-1 relative graphql-editor">
                        <div className="absolute left-0 top-0 bottom-0 w-8 bg-muted/20 border-r border-border flex flex-col pt-3">
                          {Array.from({ length: 20 }, (_, i) => (
                            <div key={i} className="text-[10px] text-muted-foreground/40 text-right pr-2 leading-[1.6] font-mono">
                              {i + 1}
                            </div>
                          ))}
                        </div>
                        <textarea
                          value={query}
                          onChange={(e) => {
                            setQuery(e.target.value)
                            // Count operations
                            const ops = (e.target.value.match(/(query|mutation|subscription)\s/gi) || []).length
                            setOperationCount(Math.max(1, ops))
                          }}
                          className="w-full h-full p-3 pl-10 font-mono text-xs bg-transparent resize-none focus:outline-none leading-[1.6] text-foreground placeholder:text-muted-foreground/40"
                          placeholder={`query {
  # Write your GraphQL query here
}`}
                          spellCheck={false}
                        />
                      </div>
                      {/* Variables section */}
                      <div className="border-t border-border">
                        <div className="flex items-center justify-between px-3 py-2 bg-muted/10">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Variables</span>
                          <Badge variant="secondary" className="text-[9px] h-4 px-1.5">
                            {variables.trim() ? "1" : "0"}
                          </Badge>
                        </div>
                        <textarea
                          value={variables}
                          onChange={(e) => setVariables(e.target.value)}
                          className="w-full h-24 p-3 font-mono text-xs bg-transparent resize-none focus:outline-none leading-relaxed text-foreground placeholder:text-muted-foreground/40"
                          placeholder='{ "key": "value" }'
                          spellCheck={false}
                        />
                      </div>
                    </div>
                  </ResizablePanel>

                  {/* Schema panel */}
                  {schemaVisible && (
                    <>
                      <ResizableHandle className="w-[1px] bg-border" />
                      <ResizablePanel defaultSize={40} minSize={20}>
                        <div className="flex flex-col h-full">
                          <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/10">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Schema</span>
                            <div className="flex items-center gap-1">
                              <button className="w-5 h-5 flex items-center justify-center rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
                                <RefreshCw className="w-3 h-3" />
                              </button>
                              <button
                                className="w-5 h-5 flex items-center justify-center rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                                onClick={() => setSchemaVisible(false)}
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                          <div className="flex-1 flex items-center justify-center p-6 text-center">
                            <div className="space-y-3">
                              <div className="w-16 h-16 mx-auto rounded-2xl bg-muted/30 flex items-center justify-center">
                                <ExternalLink className="w-8 h-8 text-muted-foreground/20" />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-muted-foreground/60">Nothing to see here!</p>
                                <p className="text-xs text-muted-foreground/40 mt-1">
                                  Please enter a valid URL to load the schema.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </ResizablePanel>
                    </>
                  )}
                </ResizablePanelGroup>
              </TabsContent>

              <TabsContent value="headers" className="mt-0 p-3">
                <KeyValueTable data={headers} setter={setHeaders} placeholder={{ key: "Header", value: "Value" }} />
              </TabsContent>

              <TabsContent value="auth" className="mt-0 p-3">
                <AuthSection authType={authType} setAuthType={setAuthType} authData={authData} setAuthData={setAuthData} />
              </TabsContent>

              <TabsContent value="scripts" className="mt-0 p-3">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold">Pre-request Script</h3>
                    <Badge variant="secondary" className="text-[9px]">Coming soon</Badge>
                  </div>
                  <textarea
                    className="w-full h-32 p-3 bg-muted/30 font-mono text-xs rounded-lg border border-border focus:outline-none focus:border-primary/50"
                    placeholder="// Write pre-request scripts here"
                    spellCheck={false}
                  />
                </div>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>
      </ResizablePanel>

      <ResizableHandle className="w-[1px] bg-border hover:bg-primary/50 transition-colors" />

      {/* Right: Response panel */}
      <ResizablePanel defaultSize={50} minSize={20}>
        <ResponsePanel
          response={response}
          isCopied={isCopied}
          copyToClipboard={copyToClipboard}
          downloadResponse={downloadResponse}
          assertions={assertions}
        />
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
