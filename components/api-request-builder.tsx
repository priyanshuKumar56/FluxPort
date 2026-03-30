"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { ShieldCheck } from "lucide-react"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { createLog } from "@/lib/store/slices/logsSlice"
import { apiClient } from "@/lib/api/client"

// Sub-components
import { KeyValueTable, type KeyValuePair } from "./api-client/key-value-table"
import { RequestHeader } from "./api-client/request-header"
import { AuthSection, type AuthType } from "./api-client/auth-section"
import { ResponsePanel } from "./api-client/response-panel"
import { RequestBodyEditor } from "./api-client/request-body-editor"

export function ApiRequestBuilder({
  initialData,
  onUpdate,
  onMethodChange,
  onUrlChange,
}: {
  initialData?: any
  onUpdate?: (data: any) => void
  onMethodChange?: (method: string) => void
  onUrlChange?: (url: string) => void
}) {
  const dispatch = useAppDispatch()
  const { activeWorkspaceId } = useAppSelector((state) => state.workspaces)

  // State
  const [method, setMethod] = useState(initialData?.method || "GET")
  const [url, setUrl] = useState(initialData?.url || "")
  const [useProxy, setUseProxy] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState<any>(null)
  const [assertions, setAssertions] = useState<any[]>([])
  const [isCopied, setIsCopied] = useState(false)

  const [params, setParams] = useState<KeyValuePair[]>(
    initialData?.params || [{ id: "1", key: "", value: "", enabled: true }],
  )
  const [headers, setHeaders] = useState<KeyValuePair[]>(
    initialData?.headers || [{ id: "1", key: "", value: "", enabled: true }],
  )
  const [authType, setAuthType] = useState<AuthType>(initialData?.authType || "none")
  const [authData, setAuthData] = useState<any>(initialData?.authData || {})
  const [body, setBody] = useState(initialData?.body || "")

  // Memoized update callback
  const triggerUpdate = useCallback(() => {
    onUpdate?.({ url, method, params, headers, body, authType, authData })
  }, [url, method, params, headers, body, authType, authData, onUpdate])

  useEffect(() => {
    triggerUpdate()
  }, [triggerUpdate])

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "Enter") {
        e.preventDefault()
        handleSend()
      }
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault()
        handleSave()
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [url, method, params, headers, body, authType, authData])

  const replaceVariables = useCallback((str: string) => {
    if (!str) return str
    const vars: Record<string, string> = {
      baseUrl: "https://api.example.com",
      timestamp: Date.now().toString(),
      random: Math.random().toString(36).substring(7)
    }
    return str.replace(/\{\{(.+?)\}\}/g, (match, p1) => vars[p1] || match)
  }, [])

  const prepareRequest = () => {
    let rawUrl = replaceVariables(url)
    if (!rawUrl.startsWith("http")) rawUrl = `http://${rawUrl}`

    const urlObj = new URL(rawUrl)
    params.filter((p) => p.enabled && p.key).forEach((p) => {
      urlObj.searchParams.append(replaceVariables(p.key), replaceVariables(p.value))
    })

    const activeHeaders = headers
      .filter((h) => h.enabled && h.key)
      .reduce((acc: any, h) => {
        acc[replaceVariables(h.key)] = replaceVariables(h.value)
        return acc
      }, {})

    if (authType === "bearer" && authData.token) {
      activeHeaders["Authorization"] = `Bearer ${replaceVariables(authData.token)}`
    } else if (authType === "basic" && authData.username) {
      const credentials = btoa(`${authData.username}:${authData.password || ""}`)
      activeHeaders["Authorization"] = `Basic ${credentials}`
    }

    return { urlObj, activeHeaders }
  }

  const handleSend = async () => {
    if (!url) return
    setIsLoading(true)
    setResponse(null)

    const { urlObj, activeHeaders } = prepareRequest()

    try {
      const startTime = Date.now()
      let res: Response | null = null

      const isLocalUrl =
        urlObj.hostname === "localhost" ||
        urlObj.hostname === "127.0.0.1" ||
        urlObj.hostname.startsWith("192.168.") ||
        urlObj.hostname.startsWith("10.") ||
        urlObj.hostname.startsWith("172.") ||
        urlObj.hostname.endsWith(".local")

      if (!useProxy || isLocalUrl) {
        const isNoBodyMethod = ["GET", "HEAD"].includes(method.toUpperCase())
        res = await fetch(urlObj.toString(), {
          method,
          headers: activeHeaders,
          mode: "cors",
          cache: "no-cache",
          body: !isNoBodyMethod ? replaceVariables(body) : undefined,
        })
      } else {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
        const proxyHeaders: Record<string, string> = { "Content-Type": "application/json" }
        if (token) proxyHeaders['Authorization'] = `Bearer ${token}`

        const isNoBodyMethod = ["GET", "HEAD"].includes(method.toUpperCase())
        res = await fetch("/api/proxy", {
          method: "POST",
          headers: proxyHeaders,
          body: JSON.stringify({
            url: urlObj.toString(),
            method,
            headers: activeHeaders,
            body: !isNoBodyMethod ? replaceVariables(body) : undefined,
            workspaceId: activeWorkspaceId,
          }),
        })
      }

      if (!res) throw new Error("No response received from the server")

      const duration = Date.now() - startTime
      const responseHeaders: Record<string, string> = {}
      res.headers.forEach((value, key) => { responseHeaders[key] = value })

      const contentType = res.headers.get("content-type") || ""
      let data: any = null
      let bodyText = ""
      let bodySize = 0

      try {
        if (res.status !== 0 && res.body && !res.bodyUsed && typeof res.text === 'function') {
          bodyText = await res.text()
          bodySize = bodyText ? new Blob([bodyText]).size : 0

          if (bodyText && (contentType.includes("application/json") || bodyText.trim().startsWith("{") || bodyText.trim().startsWith("["))) {
            try {
              data = JSON.parse(bodyText)
            } catch (e) {
              data = bodyText
            }
          } else {
            data = bodyText || res.statusText
          }
        } else {
          data = res.statusText || "No response body"
        }
      } catch (bodyError) {
        bodyText = `Failed to read response: ${bodyError instanceof Error ? bodyError.message : String(bodyError)}`
        data = bodyText
      }

      const responseData = {
        status: res.status,
        statusText: res.statusText || (res.ok ? "OK" : "Error"),
        time: duration,
        size: bodySize || (bodyText ? bodyText.length : 0),
        body: data,
        headers: responseHeaders,
        error: res.ok ? null : (typeof data === 'object' && data?.error ? data.error : null)
      }

      setResponse(responseData)
      setAssertions([
        { id: 1, type: "Status Code is 200", passed: res.status === 200 },
        { id: 2, type: "Response time < 500ms", passed: duration < 500 },
        { id: 3, type: "Content-Type is JSON", passed: contentType.includes("json") },
      ])

      if (activeWorkspaceId) {
        dispatch(createLog({
          requestUrl: urlObj.toString(),
          requestMethod: method,
          responseStatus: res.status,
          latencyMs: duration,
          workspaceId: activeWorkspaceId,
        }))
      }

    } catch (err: any) {
      setResponse({
        error: err.message || "Network Error: Failed to fetch.",
        body: err.stack || String(err),
        status: 0,
        statusText: "Network Error",
        time: 0,
        size: 0,
        headers: {}
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!url) {
      alert("Please enter a URL first")
      return
    }
    if (!activeWorkspaceId) {
      alert("Please select a workspace first")
      return
    }
    const { urlObj, activeHeaders } = prepareRequest()
    const collectionName = prompt("Enter collection name (or leave empty for default):")
    const requestName = prompt("Enter request name:", url.split('/').pop() || "New Request")
    if (!requestName) return

    try {
      const collections = await apiClient.getCollections(activeWorkspaceId)
      let collection = collections.find((c: any) => c.name === (collectionName || "Default"))
      if (!collection) collection = await apiClient.createCollection(activeWorkspaceId, collectionName || "Default")

      await apiClient.createSavedRequest(
        collection.id,
        undefined,
        {
          name: requestName,
          method,
          url: urlObj.toString(),
          headers: activeHeaders,
          body: method !== "GET" ? body : null,
        }
      )
      alert("Request saved successfully!")
    } catch (error) {
      console.error('Failed to save request:', error)
      alert("Failed to save request")
    }
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
    a.download = `response-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(downloadUrl)
  }

  return (
    <ResizablePanelGroup direction="horizontal">
      {/* Left: Request builder */}
      <ResizablePanel defaultSize={50} minSize={30}>
        <div className="flex flex-col h-full bg-background">
          <RequestHeader
            method={method}
            setMethod={(m) => { setMethod(m); onMethodChange?.(m); }}
            url={url}
            setUrl={(u) => { setUrl(u); onUrlChange?.(u); }}
            useProxy={useProxy}
            setUseProxy={setUseProxy}
            isLoading={isLoading}
            handleSend={handleSend}
            handleSave={handleSave}
          />

          <Tabs defaultValue="params" className="flex-1 flex flex-col">
            <div className="px-3 border-b border-border bg-muted/10">
              <TabsList className="bg-transparent h-9 gap-1 p-0">
                <TabsTrigger value="params" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary bg-transparent shadow-none px-3 text-xs font-medium">
                  Params
                  <Badge variant="secondary" className="ml-1.5 text-[9px] h-4 px-1 bg-accent">
                    {params.filter(p => p.key).length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="body" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary bg-transparent shadow-none px-3 text-xs font-medium">
                  Body
                </TabsTrigger>
                <TabsTrigger value="headers" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary bg-transparent shadow-none px-3 text-xs font-medium">
                  Headers
                  <Badge variant="secondary" className="ml-1.5 text-[9px] h-4 px-1 bg-accent">
                    {headers.filter(h => h.key).length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="auth" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary bg-transparent shadow-none px-3 text-xs font-medium">
                  Authorization
                  {authType !== "none" && <ShieldCheck className="ml-1.5 h-3 w-3 text-emerald-400" />}
                </TabsTrigger>
                <TabsTrigger value="scripts" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary bg-transparent shadow-none px-3 text-xs font-medium">
                  Scripts
                </TabsTrigger>
              </TabsList>
            </div>
            <ScrollArea className="flex-1 p-3">
              <TabsContent value="params" className="mt-0">
                <KeyValueTable data={params} setter={setParams} placeholder={{ key: "Key", value: "Value" }} />
              </TabsContent>
              <TabsContent value="body" className="mt-0">
                <RequestBodyEditor body={body} setBody={setBody} />
              </TabsContent>
              <TabsContent value="headers" className="mt-0">
                <KeyValueTable data={headers} setter={setHeaders} placeholder={{ key: "Header", value: "Value" }} showType={false} />
              </TabsContent>
              <TabsContent value="auth" className="mt-0">
                <AuthSection authType={authType} setAuthType={setAuthType} authData={authData} setAuthData={setAuthData} />
              </TabsContent>
              <TabsContent value="scripts" className="mt-0">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold">Test Scripts</h3>
                    <Badge variant="secondary" className="text-[9px]">Coming soon</Badge>
                  </div>
                  <textarea
                    className="w-full h-[150px] p-3 bg-muted/30 font-mono text-xs rounded-lg border border-border focus:outline-none focus:border-primary/50"
                    placeholder="pm.test('Status code is 200', function () { pm.response.to.have.status(200); });"
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
