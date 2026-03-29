"use client"

import { useState, useEffect, useCallback } from "react"
import { ApiRequestBuilder } from "@/components/api-request-builder"
import { GraphqlRequestBuilder } from "@/components/api-client/graphql-request-builder"
import { RuntimeVariablesPage } from "@/components/api-client/runtime-variables"
import { EnvironmentEditor } from "@/components/api-client/environment-editor"
import { RequestHistorySidebar } from "@/components/request-history-sidebar"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Button } from "@/components/ui/button"
import { X, Plus, FileCode, Edit2, Check, ChevronDown, Import, Globe, Code2, ChevronRight, Folder, ArrowRightLeft, Hexagon, AlignJustify } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

// Tab types
type TabType = "http" | "graphql" | "variables" | "environment"

interface RequestTab {
  id: string
  name: string
  type: TabType
  method: string
  url: string
  isDirty: boolean
  isEditingName: boolean
  requestData?: {
    headers?: any
    body?: any
    query?: string
  }
}

export default function ApiClientPage() {
  const [tabs, setTabs] = useState<RequestTab[]>([
    { id: "1", name: "Untitled request", type: "http", method: "GET", url: "", isDirty: false, isEditingName: false },
  ])
  const [activeTabId, setActiveTabId] = useState("1")
  const [editingTabName, setEditingTabName] = useState("")

  const addNewTab = (type: TabType = "http") => {
    const newTab: RequestTab = {
      id: Date.now().toString(),
      name: type === "graphql" ? "grphql" : type === "variables" ? "Runtime Variables" : "Untitled request",
      type,
      method: type === "graphql" ? "POST" : "GET",
      url: "",
      isDirty: false,
      isEditingName: false,
    }
    setTabs([...tabs, newTab])
    setActiveTabId(newTab.id)
  }

  const closeTab = (tabId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const filteredTabs = tabs.filter((tab) => tab.id !== tabId)
    if (filteredTabs.length === 0) {
      addNewTab()
      return
    }
    setTabs(filteredTabs)
    if (activeTabId === tabId) {
      setActiveTabId(filteredTabs[filteredTabs.length - 1].id)
    }
  }

  const updateTabMeta = (tabId: string, updates: Partial<RequestTab>) => {
    setTabs((prev) => prev.map((tab) => (tab.id === tabId ? { ...tab, ...updates } : tab)))
  }

  const startEditingTabName = (tabId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const tab = tabs.find((t) => t.id === tabId)
    if (tab) {
      setEditingTabName(tab.name)
      updateTabMeta(tabId, { isEditingName: true })
    }
  }

  const saveTabName = (tabId: string) => {
    if (editingTabName.trim()) {
      updateTabMeta(tabId, { name: editingTabName.trim(), isEditingName: false })
    } else {
      updateTabMeta(tabId, { isEditingName: false })
    }
  }

  const getMethodColor = (method: string) => {
    const colors: Record<string, string> = {
      GET: "text-emerald-400",
      POST: "text-amber-400",
      PUT: "text-blue-400",
      DELETE: "text-red-400",
      PATCH: "text-violet-400",
      HEAD: "text-cyan-400",
      OPTIONS: "text-purple-400",
    }
    return colors[method] || "text-muted-foreground"
  }

  const getTabIcon = (tab: RequestTab) => {
    if (tab.type === "graphql") return "⬡"
    if (tab.type === "variables") return "≡"
    if (tab.type === "environment") return "●"
    return null
  }

  const activeTab = tabs.find((t) => t.id === activeTabId)

  // Keyboard shortcut handler
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "t") {
        e.preventDefault()
        addNewTab()
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [tabs])

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Top Action Bar: New, Import, Environment, Tabs */}
      <div className="flex items-center border-b border-border bg-[oklch(0.14_0.012_270)] h-9 shrink-0">
        {/* Action buttons */}
        <div className="flex items-center gap-0.5 px-2 border-r border-border h-full">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded transition-colors outline-none">
                <Plus className="w-3 h-3" />
                New
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[200px] border-border bg-card p-1 shadow-xl">
              <DropdownMenuItem onClick={() => addNewTab("http")} className="text-[11px] cursor-pointer py-2 px-3 flex items-center gap-3 hover:bg-accent rounded focus:bg-accent font-medium">
                <ArrowRightLeft className="w-4 h-4 opacity-70" />
                HTTP request
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => addNewTab("graphql")} className="text-[11px] cursor-pointer py-2 px-3 flex items-center gap-3 hover:bg-accent rounded focus:bg-accent font-medium">
                <Hexagon className="w-4 h-4 opacity-70" />
                GraphQL request
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => alert("Creating Collections is managed via the Left Sidebar > '+' icon.")} className="text-[11px] cursor-pointer py-2 px-3 flex items-center gap-3 hover:bg-accent rounded focus:bg-accent font-medium">
                <Folder className="w-4 h-4 opacity-70" />
                Collection
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => addNewTab("environment")} className="text-[11px] cursor-pointer py-2 px-3 flex items-center gap-3 hover:bg-accent rounded focus:bg-accent font-medium">
                <AlignJustify className="w-4 h-4 opacity-70" />
                Environment
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded transition-colors outline-none">
                <Import className="w-3 h-3" />
                Import
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[280px] border-border bg-card p-1 shadow-xl">
              <DropdownMenuItem className="text-[11px] cursor-pointer py-2 px-3 flex items-center gap-3 hover:bg-accent rounded focus:bg-accent font-medium">
                <Code2 className="w-4 h-4 opacity-70" />
                cURL
              </DropdownMenuItem>
              <DropdownMenuItem className="text-[11px] cursor-pointer py-2 px-3 flex items-center gap-3 hover:bg-accent rounded focus:bg-accent font-medium">
                <div className="w-4 h-4 flex items-center justify-center opacity-70 border border-current rounded-full">
                  <span className="text-[8px] font-bold">OAS</span>
                </div>
                OpenAPI Specifications
              </DropdownMenuItem>
              <DropdownMenuItem className="text-[11px] cursor-pointer py-2 px-3 flex items-center gap-3 hover:bg-accent rounded focus:bg-accent font-medium">
                <Folder className="w-4 h-4 opacity-70" />
                Requestly Collection and Environments
              </DropdownMenuItem>
              <DropdownMenuItem className="text-[11px] cursor-pointer py-2 px-3 flex items-center gap-3 hover:bg-accent rounded focus:bg-accent font-medium">
                <div className="w-4 h-4 flex items-center justify-center opacity-90 bg-[#ff6c37] rounded-full text-white shadow-sm shrink-0">
                  <span className="text-[8px] font-bold">P</span>
                </div>
                Postman Collections and Environments
              </DropdownMenuItem>
              <DropdownMenuItem className="text-[11px] cursor-pointer py-2 px-3 flex items-center gap-3 hover:bg-accent rounded focus:bg-accent font-medium">
                <Globe className="w-4 h-4 opacity-70" />
                Bruno Collections and Variables
              </DropdownMenuItem>
              <DropdownMenuItem className="text-[11px] cursor-pointer py-2 px-3 flex items-center gap-3 hover:bg-accent rounded focus:bg-accent font-medium">
                <span className="text-[10px] font-mono opacity-70 font-bold w-4 flex justify-center">&lt;/&gt;</span>
                WSDL
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Environment selector */}
        <div className="flex items-center px-2 border-r border-border h-full">
          <button className="flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded transition-colors">
            <Globe className="w-3 h-3" />
            No environment
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>

        {/* Tab bar */}
        <ScrollArea className="flex-1 h-full">
          <div className="flex items-center h-full">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTabId(tab.id)}
                className={cn(
                  "flex items-center gap-2 p-2 px-3 h-full border-r border-border transition-colors relative group min-w-[140px] max-w-[200px] shrink-0 text-[11px] outline-none",
                  activeTabId === tab.id
                    ? "bg-background text-foreground"
                    : "bg-transparent text-muted-foreground hover:bg-muted/10"
                )}
              >
                {activeTabId === tab.id && (
                  <div className="absolute -bottom-px left-0 right-0 h-[2px] bg-[#3B82F6] z-10" />
                )}

                {/* Tab type indicator */}
                {tab.type === "graphql" ? (
                  <span className="text-[10px] font-bold text-pink-400">⬡</span>
                ) : tab.type === "variables" ? (
                  <span className="text-[10px] font-bold text-primary">≡</span>
                ) : tab.type === "environment" ? (
                  <span className="text-[10px] font-bold text-emerald-400">●</span>
                ) : tab.type === "http" ? (
                  <>
                    <FileCode className="h-3 w-3 shrink-0 text-muted-foreground/60" />
                    <span className={cn("text-[10px] font-bold mr-1",
                      tab.method === "GET" ? "text-emerald-500" :
                        tab.method === "POST" ? "text-sky-500" :
                          tab.method === "PUT" ? "text-amber-500" :
                            tab.method === "DELETE" ? "text-rose-500" : "text-muted-foreground"
                    )}>
                      {tab.method}
                    </span>
                  </>
                ) : (
                  <FileCode className="h-3 w-3 shrink-0 text-muted-foreground/60" />
                )}

                {/* Tab name editing */}
                {tab.isEditingName ? (
                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <Input
                      value={editingTabName}
                      onChange={(e) => setEditingTabName(e.target.value)}
                      onBlur={() => saveTabName(tab.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveTabName(tab.id)
                        if (e.key === "Escape") updateTabMeta(tab.id, { isEditingName: false })
                      }}
                      className="h-5 w-28 text-[11px] px-1 py-0 border-primary/50 bg-background"
                      autoFocus
                    />
                  </div>
                ) : (
                  <span
                    className="text-[11px] max-w-[120px] truncate cursor-default"
                    onDoubleClick={(e) => startEditingTabName(tab.id, e)}
                  >
                    {tab.name}
                    {tab.isDirty && <span className="ml-1 text-primary">●</span>}
                  </span>
                )}

                {/* Close button */}
                {tab.type === "graphql" && (
                  <span className="text-emerald-400 text-sm ml-0.5">✓</span>
                )}
                <div
                  onClick={(e) => closeTab(tab.id, e)}
                  className="opacity-0 group-hover:opacity-100 hover:bg-destructive/20 rounded p-0.5 transition-all ml-1 cursor-pointer"
                >
                  <X className="h-3 w-3" />
                </div>
              </button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        {/* Add tab button */}
        <div className="flex items-center gap-0.5 px-1 border-l border-border h-full">
          <button
            className="w-7 h-7 flex items-center justify-center rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => addNewTab("http")}
            title="New HTTP request"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Breadcrumb bar */}
      {activeTab && (
        <div className="flex items-center justify-between px-4 py-1.5 border-b border-border bg-background text-xs shrink-0">
          <div className="flex items-center gap-1 text-muted-foreground">
            <span className="text-[10px] bg-accent/50 px-1.5 py-0.5 rounded font-medium">Draft</span>
            <ChevronRight className="w-3 h-3" />
            <span className="font-medium">API Client</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground font-semibold">{activeTab.name}</span>
            {activeTab.isDirty && <span className="text-primary ml-1">●</span>}
          </div>
          <button className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground hover:text-primary transition-colors">
            <Code2 className="w-3 h-3" />
            Get client code
          </button>
        </div>
      )}

      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          {/* Left sidebar - Collections & History */}
          <ResizablePanel defaultSize={18} minSize={12} maxSize={28} className="border-r border-border">
            <RequestHistorySidebar
              onRequestSelect={(req) => {
                const existingTab = tabs.find(tab => tab.url === req.url && tab.method === req.method)
                if (existingTab) {
                  setActiveTabId(existingTab.id)
                  return
                }
                const newTab: RequestTab = {
                  id: Date.now().toString(),
                  name: req.name || "Untitled request",
                  type: "http",
                  method: req.method || "GET",
                  url: req.url || "",
                  isDirty: false,
                  isEditingName: false,
                  requestData: {
                    headers: req.headers,
                    body: req.body,
                  }
                }
                setTabs([...tabs, newTab])
                setActiveTabId(newTab.id)
              }}
              onNewGraphql={() => addNewTab("graphql")}
              onNewHttp={() => addNewTab("http")}
              onOpenVariables={() => {
                const existingVar = tabs.find(t => t.type === "variables")
                if (existingVar) {
                  setActiveTabId(existingVar.id)
                } else {
                  addNewTab("variables")
                }
              }}
              onOpenEnvironment={() => {
                const existingEnv = tabs.find(t => t.type === "environment")
                if (existingEnv) {
                  setActiveTabId(existingEnv.id)
                } else {
                  const envTab: RequestTab = {
                    id: Date.now().toString(),
                    name: "New Environment",
                    type: "environment",
                    method: "",
                    url: "",
                    isDirty: false,
                    isEditingName: false,
                  }
                  setTabs([...tabs, envTab])
                  setActiveTabId(envTab.id)
                }
              }}
            />
          </ResizablePanel>
          <ResizableHandle className="w-[1px] bg-border hover:bg-primary/50 transition-colors" />

          {/* Main request/response area */}
          <ResizablePanel defaultSize={82}>
            {tabs.map((tab) => (
              <div key={tab.id} className={activeTabId === tab.id ? "block h-full" : "hidden"}>
                {tab.type === "graphql" ? (
                  <GraphqlRequestBuilder
                    initialData={{
                      url: tab.url,
                      query: tab.requestData?.query,
                      headers: tab.requestData?.headers,
                    }}
                    onUrlChange={(newUrl) => updateTabMeta(tab.id, { url: newUrl, isDirty: true })}
                  />
                ) : tab.type === "variables" ? (
                  <RuntimeVariablesPage />
                ) : tab.type === "environment" ? (
                  <EnvironmentEditor />
                ) : (
                  <ApiRequestBuilder
                    initialData={{
                      method: tab.method,
                      url: tab.url,
                      headers: tab.requestData?.headers,
                      body: tab.requestData?.body,
                    }}
                    onMethodChange={(newMethod) => updateTabMeta(tab.id, { method: newMethod, isDirty: true })}
                    onUrlChange={(newUrl) => updateTabMeta(tab.id, { url: newUrl, isDirty: true })}
                  />
                )}
              </div>
            ))}
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  )
}
