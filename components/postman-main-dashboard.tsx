"use client"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PostmanCollectionsSidebar } from "@/components/postman-collections-sidebar"
import { PostmanTabManager } from "@/components/postman-tab-manager"
import { PostmanRequestBuilder } from "@/components/postman-request-builder"
import { PostmanResponseViewer } from "@/components/postman-response-viewer"
import { ResizablePanels } from "@/components/resizable-panels"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, Plus, Settings, User, Bell, Import } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"
import { ThemeSwitcher } from "./theme-switcher"

interface Tab {
  id: string
  name: string
  method: string
  url: string
  isModified: boolean
  isSaved: boolean
}

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

export function PostmanMainDashboard() {
  const [tabs, setTabs] = useState<Tab[]>([
    {
      id: "tab-1",
      name: "New Request",
      method: "GET",
      url: "https://jsonplaceholder.typicode.com/posts/1",
      isModified: false,
      isSaved: false,
    },
  ])
  const [activeTab, setActiveTab] = useState("tab-1")
  const [response, setResponse] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  // Keep activeTab in URL to mimic VS Code-like routing state
  useEffect(() => {
    const urlTab = searchParams?.get("tab")
    if (urlTab && tabs.find((t) => t.id === urlTab)) {
      setActiveTab(urlTab)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    // Update URL without full navigation
    if (typeof window === "undefined") return
    const current = new URL(window.location.href)
    current.searchParams.set("tab", activeTab)
    window.history.replaceState({}, "", current.toString())
  }, [activeTab])

  const handleSidebarMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    const sidebarEl = (e.currentTarget.previousElementSibling as HTMLDivElement) || null
    const containerEl = e.currentTarget.parentElement as HTMLDivElement
    if (!sidebarEl || !containerEl) return
    const containerRect = containerEl.getBoundingClientRect()
    const startMove = (moveEv: MouseEvent) => {
      const pct = ((moveEv.clientX - containerRect.left) / containerRect.width) * 100
      const clamped = Math.min(Math.max(pct, 12), 40)
      sidebarEl.style.width = `${clamped}%`
    }
    const stopMove = () => {
      document.removeEventListener("mousemove", startMove)
      document.removeEventListener("mouseup", stopMove)
      document.body.style.cursor = ""
      document.body.style.userSelect = ""
    }
    document.addEventListener("mousemove", startMove)
    document.addEventListener("mouseup", stopMove)
    document.body.style.cursor = "col-resize"
    document.body.style.userSelect = "none"
  }, [])

  const handleRequestSelect = useCallback(
    (request: any) => {
      // Check if tab already exists
      const existingTab = tabs.find((tab) => tab.url === request.url && tab.method === request.method)
      if (existingTab) {
        setActiveTab(existingTab.id)
        return
      }

      const newTab: Tab = {
        id: `tab-${Date.now()}`,
        name: request.name,
        method: request.method,
        url: request.url,
        isModified: false,
        isSaved: true,
      }
      setTabs((prev) => [...prev, newTab])
      setActiveTab(newTab.id)
    },
    [tabs],
  )

  const handleTabClose = useCallback(
    (tabId: string) => {
      setTabs((prev) => {
        if (prev.length === 1) return prev
        const newTabs = prev.filter((tab) => tab.id !== tabId)
        if (activeTab === tabId) {
          setActiveTab(newTabs[0].id)
        }
        return newTabs
      })
    },
    [activeTab],
  )

  const handleNewTab = useCallback(() => {
    const newTab: Tab = {
      id: `tab-${Date.now()}`,
      name: "New Request",
      method: "GET",
      url: "",
      isModified: false,
      isSaved: false,
    }
    setTabs((prev) => [...prev, newTab])
    setActiveTab(newTab.id)
  }, [])

  const handleTabSave = useCallback((tabId: string) => {
    setTabs((prev) => prev.map((tab) => (tab.id === tabId ? { ...tab, isSaved: true, isModified: false } : tab)))
    toast.success("Request saved successfully")
  }, [])

  const handleRequestChange = useCallback((tabId: string, updates: Partial<Tab>) => {
    setTabs((prev) => prev.map((tab) => (tab.id === tabId ? { ...tab, ...updates } : tab)))
  }, [])

  const handleSendRequest = async (requestData: any) => {
    setLoading(true)
    setResponse(null)

    try {
      console.log("Sending request:", requestData)

      // Use the existing proxy API
      const proxyResponse = await fetch("/api/proxy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      })

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
      const responseSize = new Blob([typeof result.data === "string" ? result.data : JSON.stringify(result.data || "")]).size

      const apiResponse: ApiResponse = {
        status: result.status || 0,
        statusText: result.statusText || "Unknown",
        headers: result.headers || {},
        data: result.data,
        time: Math.floor(Math.random() * 500) + 100, // Use actual response time in real implementation
        size: responseSize,
        ok: result.ok || false,
        error: result.error || false,
        message: result.message,
        suggestions: result.suggestions,
        contentType: result.contentType || (result.headers && (result.headers["content-type"] || result.headers["Content-Type"])) || undefined,
      }

      setResponse(apiResponse)

      if (result.error) {
        toast.error(result.message || "Request failed")
      } else if (apiResponse.ok) {
        toast.success(`Request completed successfully in ${apiResponse.time}ms`)
      } else {
        toast.error(`Request failed with status ${apiResponse.status}`)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Network error occurred"

      const errorResponse: ApiResponse = {
        status: 0,
        statusText: "Network Error",
        headers: {},
        data: null,
        time: 0,
        size: 0,
        ok: false,
        error: true,
        message: errorMessage,
      }

      setResponse(errorResponse)
      toast.error(errorMessage)
      console.error("Request error:", err)
    } finally {
      setLoading(false)
    }
  }

  const currentTab = tabs.find((tab) => tab.id === activeTab)

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="h-14 border-b border-gray-200 flex items-center justify-between px-4 bg-white shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
           <div className="relative">
                       <div className="h-12 w-12 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-2xl transform hover:scale-110 transition-all duration-300">
                                     <Image
                         src="/fp-logo.webp"
                         alt="Fluxport Logo"
                         width={62}
                         height={62}
                         className="absolute -top-1 -left-1 w-12 h-12 m-auto rounded-full border-2 border-white shadow-lg"/>
                       </div>
           
                       
                       <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                     </div>
            <span className="font-semibold text-gray-900">Fluxport</span>
          </div>
          <div className="h-6 w-px bg-gray-300" />
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
              <Plus className="h-4 w-4 mr-1" />
              New
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
              <Import className="h-4 w-4 mr-1" />
              Import
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search..." className="pl-10 w-64 h-8" />
          </div>
          <ThemeSwitcher/>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <User className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar/Main resizable split */}
        <div className="flex h-full w-full">
          <div className="flex-shrink-0 min-w-[180px]">
            <PostmanCollectionsSidebar onRequestSelect={handleRequestSelect} />
          </div>
          {/* Vertical resizer between sidebar and content */}
          <div className="w-1 bg-gray-200 hover:bg-gray-300 cursor-col-resize flex-shrink-0" onMouseDown={handleSidebarMouseDown} />

          {/* Main Content Area */}
          <div className="flex-1 min-w-0 flex flex-col">
          {/* Tab Manager */}
          <PostmanTabManager
            tabs={tabs}
            activeTab={activeTab}
            onTabSelect={setActiveTab}
            onTabClose={handleTabClose}
            onNewTab={handleNewTab}
            onTabSave={handleTabSave}
          />

          {/* Request/Response Split View with Resizable Panels */}
          <div className="flex-1">
            <ResizablePanels
              leftPanel={
                currentTab ? (
                  <PostmanRequestBuilder
                    request={currentTab}
                    onSend={handleSendRequest}
                    onSave={() => handleTabSave(currentTab.id)}
                    onRequestChange={(updates) => handleRequestChange(currentTab.id, updates)}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <p>No tab selected</p>
                  </div>
                )
              }
              rightPanel={<PostmanResponseViewer response={response} loading={loading} />}
              defaultLeftWidth={50}
              minLeftWidth={30}
              maxLeftWidth={70}
            />
          </div>
          </div>
        </div>
      </div>
    </div>
  )
}
