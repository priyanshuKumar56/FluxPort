"use client"

import type React from "react"

import { useState } from "react"
import { ApiRequestBuilder } from "@/components/api-request-builder"
import { X, Plus } from "lucide-react"
import cn from "classnames"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

interface Tab {
  id: string
  name: string
  method: string
  isDirty?: boolean
}

export function ClientWorkspace() {
  const [tabs, setTabs] = useState<Tab[]>([{ id: "1", name: "New Request", method: "GET" }])
  const [activeTabId, setActiveTabId] = useState("1")

  const addTab = () => {
    const newId = Math.random().toString(36).substr(2, 9)
    setTabs([...tabs, { id: newId, name: "New Request", method: "GET" }])
    setActiveTabId(newId)
  }

  const closeTab = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const newTabs = tabs.filter((t) => t.id !== id)
    if (newTabs.length === 0) {
      const defaultId = "1"
      setTabs([{ id: defaultId, name: "New Request", method: "GET" }])
      setActiveTabId(defaultId)
    } else {
      setTabs(newTabs)
      if (activeTabId === id) {
        setActiveTabId(newTabs[newTabs.length - 1].id)
      }
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
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* VS Code Style Tabs */}
      <div className="flex items-center bg-muted/30 border-b overflow-hidden h-9">
        <ScrollArea className="flex-1 w-full whitespace-nowrap">
          <div className="flex items-center h-full">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                onClick={() => setActiveTabId(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-3 h-9 border-r border-border/50 cursor-pointer text-xs transition-colors group relative",
                  activeTabId === tab.id
                    ? "bg-background text-foreground"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                )}
              >
                {activeTabId === tab.id && <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary" />}
                <span className={cn("font-bold text-[10px]", getMethodColor(tab.method))}>{tab.method}</span>
                <span className="truncate max-w-[120px]">{tab.name}</span>
                <button
                  onClick={(e) => closeTab(tab.id, e)}
                  className="ml-1 p-0.5 rounded-sm hover:bg-muted opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
                {tab.isDirty && activeTabId !== tab.id && <div className="w-2 h-2 rounded-full bg-primary/60" />}
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="h-1" />
        </ScrollArea>
        <button
          onClick={addTab}
          className="px-3 h-9 border-l border-border/50 hover:bg-muted/50 text-muted-foreground transition-colors"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Workspace Content */}
      <div className="flex-1 overflow-hidden">
        {tabs.map((tab) => (
          <div key={tab.id} className={cn("h-full", activeTabId !== tab.id && "hidden")}>
            <ApiRequestBuilder />
          </div>
        ))}
      </div>
    </div>
  )
}
