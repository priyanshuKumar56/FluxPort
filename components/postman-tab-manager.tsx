"use client"

import { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { X, Plus, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface Tab {
  id: string
  name: string
  method: string
  url: string
  isModified: boolean
  isSaved: boolean
}

interface PostmanTabManagerProps {
  tabs: Tab[]
  activeTab: string
  onTabSelect: (tabId: string) => void
  onTabClose: (tabId: string) => void
  onNewTab: () => void
  onTabSave: (tabId: string) => void
}

export function PostmanTabManager({
  tabs,
  activeTab,
  onTabSelect,
  onTabClose,
  onNewTab,
  onTabSave,
}: PostmanTabManagerProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET":
        return "text-green-600"
      case "POST":
        return "text-blue-600"
      case "PUT":
        return "text-yellow-600"
      case "DELETE":
        return "text-red-600"
      case "PATCH":
        return "text-purple-600"
      default:
        return "text-gray-600"
    }
  }

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
    }
  }

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: "smooth" })
    }
  }

  useEffect(() => {
    checkScrollButtons()
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("scroll", checkScrollButtons)
      return () => container.removeEventListener("scroll", checkScrollButtons)
    }
  }, [tabs])

  return (
    <div className="border-b border-gray-200 bg-white flex items-center">
      {/* Scroll Left Button */}
      {canScrollLeft && (
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 flex-shrink-0" onClick={scrollLeft}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}

      {/* Tabs Container */}
      <div
        ref={scrollContainerRef}
        className="flex-1 flex overflow-x-auto scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <div className="flex">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={cn(
                "flex items-center gap-2 px-3 py-2 border-r border-gray-200 cursor-pointer hover:bg-gray-50 min-w-0 max-w-48 group",
                activeTab === tab.id ? "bg-white border-b-2 border-b-orange-500" : "bg-gray-50",
              )}
              onClick={() => onTabSelect(tab.id)}
            >
              <span className={cn("text-xs font-medium", getMethodColor(tab.method))}>{tab.method}</span>
              <span className="text-sm truncate flex-1" title={tab.name}>
                {tab.name}
              </span>
              {tab.isModified && <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0" />}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100 flex-shrink-0"
                onClick={(e) => {
                  e.stopPropagation()
                  onTabClose(tab.id)
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Right Button */}
      {canScrollRight && (
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 flex-shrink-0" onClick={scrollRight}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}

      {/* New Tab Button */}
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 flex-shrink-0 border-l border-gray-200"
        onClick={onNewTab}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  )
}
