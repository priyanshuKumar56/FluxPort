"use client"

import { useState } from "react"
import { ApiRequestBuilder } from "@/components/api-request-builder"
import { RequestHistorySidebar } from "@/components/request-history-sidebar"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Button } from "@/components/ui/button"
import { X, Plus, FileCode, Edit2, Check } from "lucide-react"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"

// <CHANGE> Enhanced tab interface with editable names and state sync
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
    { id: "1", name: "New Request", method: "GET", url: "", isDirty: false, isEditingName: false },
  ])
  const [activeTabId, setActiveTabId] = useState("1")
  const [editingTabName, setEditingTabName] = useState("")

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

  // <CHANGE> Update tab metadata (method, URL) when request changes
  const updateTabMeta = (tabId: string, updates: Partial<RequestTab>) => {
    setTabs((prev) => prev.map((tab) => (tab.id === tabId ? { ...tab, ...updates } : tab)))
  }

  // <CHANGE> Enable inline tab name editing
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
      case "GET":
        return "text-green-500"
      case "POST":
        return "text-yellow-500"
      case "PUT":
        return "text-blue-500"
      case "DELETE":
        return "text-red-500"
      case "PATCH":
        return "text-purple-500"
      default:
        return "text-gray-500"
    }
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* <CHANGE> Enhanced VS Code-style Tab Bar with inline editing */}
      <div className="flex items-center border-b bg-card/50 backdrop-blur-sm">
        <ScrollArea className="flex-1">
          <div className="flex items-center">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTabId(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-2.5 border-r transition-colors relative group
                  ${activeTabId === tab.id
                    ? "bg-background text-foreground border-b-2 border-b-primary"
                    : "bg-transparent text-muted-foreground hover:bg-accent/50"
                  }
                `}
              >
                <FileCode className="h-3.5 w-3.5 shrink-0" />
                <span className={`text-[10px] font-bold ${getMethodColor(tab.method)} min-w-[35px]`}>
                  {tab.method}
                </span>
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
                      className="h-6 w-32 text-xs px-2"
                      autoFocus
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-5 w-5"
                      onClick={() => saveTabName(tab.id)}
                    >
                      <Check className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <span className="text-xs max-w-[150px] truncate">
                      {tab.url || tab.name}
                      {tab.isDirty && <span className="ml-1 text-primary">•</span>}
                    </span>
                    <div
                      onClick={(e) => startEditingTabName(tab.id, e)}
                      className="opacity-0 group-hover:opacity-100 hover:bg-primary/10 rounded p-0.5 transition-all cursor-pointer"
                    >
                      <Edit2 className="h-3 w-3" />
                    </div>
                  </>
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
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 shrink-0 border-l rounded-none hover:bg-primary/10"
          onClick={addNewTab}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* <CHANGE> Main content area with state synchronization */}
      <div className="flex-1 flex overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30} className="border-r">
            <RequestHistorySidebar onRequestSelect={(req) => {
              // Check if tab with same URL already exists
              const existingTab = tabs.find(tab => tab.url === req.url && tab.method === req.method)
              if (existingTab) {
                setActiveTabId(existingTab.id)
                return
              }

              // Open request in new tab with full data
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
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={80}>
            {tabs.map((tab) => (
              <div key={tab.id} className={activeTabId === tab.id ? "block h-full" : "hidden"}>
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
