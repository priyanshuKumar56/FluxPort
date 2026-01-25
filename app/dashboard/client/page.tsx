"use client"

import { useState, useEffect } from "react"
import { ApiRequestBuilder } from "@/components/api-request-builder"
import { RequestHistorySidebar } from "@/components/request-history-sidebar"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Button } from "@/components/ui/button"
import { X, Plus, FileCode, Edit2, Check, Layout, Play, Save } from "lucide-react"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface RequestTab {
  id: string
  name: string
  method: string
  url: string
  isDirty: boolean
  isEditingName: boolean
  requestData?: {
    headers?: any
    body?: any
  }
}

export default function ApiClientPage() {
  const [tabs, setTabs] = useState<RequestTab[]>([
    { id: "1", name: "Untitled Request", method: "GET", url: "", isDirty: false, isEditingName: false },
  ])
  const [activeTabId, setActiveTabId] = useState("1")
  const [editingTabName, setEditingTabName] = useState("")
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const addNewTab = () => {
    const newTab: RequestTab = {
      id: Date.now().toString(),
      name: "New Request",
      method: "GET",
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
    switch (method) {
      case "GET": return "text-emerald-600 bg-emerald-50 border-emerald-200"
      case "POST": return "text-amber-600 bg-amber-50 border-amber-200"
      case "PUT": return "text-blue-600 bg-blue-50 border-blue-200"
      case "DELETE": return "text-rose-600 bg-rose-50 border-rose-200"
      case "PATCH": return "text-violet-600 bg-violet-50 border-violet-200"
      default: return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  if (!isClient) return null

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white/50 backdrop-blur-3xl">
      {/* Header / Toolbar Area */}
      <div className="h-12 border-b border-gray-200/60 bg-white/80 backdrop-blur-md flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <Layout className="w-4 h-4 text-gray-400" />
          <span>Workspace / API Client</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5 font-medium border-gray-200 hover:bg-gray-50 hover:text-primary">
            <Save className="w-3.5 h-3.5" /> Save Collection
          </Button>
          <Button size="sm" className="h-7 text-xs gap-1.5 font-medium bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary/90">
            <Play className="w-3.5 h-3.5 fill-current" /> Run Runner
          </Button>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="flex items-end border-b border-gray-200/60 bg-gray-50/50 backdrop-blur-sm pt-2 px-2 shrink-0">
        <ScrollArea className="flex-1 w-full">
          <div className="flex items-center gap-1">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                onClick={() => setActiveTabId(tab.id)}
                className={`
                  group relative flex items-center gap-2 px-3 py-2 min-w-[160px] max-w-[240px] border-t border-l border-r rounded-t-lg cursor-pointer transition-all duration-200 select-none
                  ${activeTabId === tab.id
                    ? "bg-white border-gray-200/60 shadow-sm z-10 -mb-px pb-2.5"
                    : "bg-gray-100/50 border-transparent hover:bg-gray-100 text-gray-500 hover:text-gray-900"
                  }
                `}
              >
                {/* Method Pill */}
                <span className={`text-[9px] font-black px-1.5 py-0.5 rounded border ${getMethodColor(tab.method)} opacity-90`}>
                  {tab.method}
                </span>

                {/* Tab Name Inputs */}
                {tab.isEditingName ? (
                  <div className="flex-1 flex items-center gap-1 min-w-0" onClick={(e) => e.stopPropagation()}>
                    <Input
                      value={editingTabName}
                      onChange={(e) => setEditingTabName(e.target.value)}
                      onBlur={() => saveTabName(tab.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveTabName(tab.id)
                        if (e.key === "Escape") updateTabMeta(tab.id, { isEditingName: false })
                      }}
                      className="h-5 text-xs px-1 py-0 border-gray-300 focus-visible:ring-1 focus-visible:ring-primary min-w-0"
                      autoFocus
                    />
                  </div>
                ) : (
                  <div className="flex-1 flex items-center gap-2 min-w-0 group/label">
                    <span className="text-xs font-medium truncate block flex-1">
                      {tab.name || "Untitled"}
                    </span>
                    {tab.isDirty && (
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                    )}
                    <button
                      onClick={(e) => startEditingTabName(tab.id, e)}
                      className="opacity-0 group-hover/label:opacity-100 p-0.5 hover:bg-gray-200 rounded text-gray-500 transition-opacity"
                    >
                      <Edit2 className="w-2.5 h-2.5" />
                    </button>
                  </div>
                )}

                {/* Close Button */}
                <button
                  onClick={(e) => closeTab(tab.id, e)}
                  className={`
                    p-1 rounded-md opacity-0 group-hover:opacity-100 transition-all ml-auto shrink-0
                    ${activeTabId === tab.id ? "hover:bg-gray-100 text-gray-400 hover:text-gray-700" : "hover:bg-gray-200 text-gray-400"}
                  `}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={addNewTab}
                    className="ml-1 p-1.5 rounded-md hover:bg-gray-200 text-gray-400 hover:text-gray-700 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>New Request (Ctrl+T)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <ScrollBar orientation="horizontal" className="h-2" />
        </ScrollArea>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden bg-white">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30} className="border-r border-gray-200/60 bg-gray-50/30">
            <RequestHistorySidebar onRequestSelect={(req) => {
              const existingTab = tabs.find(tab => tab.url === req.url && tab.method === req.method)
              if (existingTab) {
                setActiveTabId(existingTab.id)
                return
              }

              const newTab: RequestTab = {
                id: Date.now().toString(),
                name: req.name || "New Request",
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
            }} />
          </ResizablePanel>

          <ResizableHandle withHandle className="bg-transparent hover:bg-primary/20 w-px transition-colors" />

          <ResizablePanel defaultSize={80} className="bg-white">
            {tabs.map((tab) => (
              <div key={tab.id} className={`h-full ${activeTabId === tab.id ? "block" : "hidden"}`}>
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
              </div>
            ))}
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  )
}
