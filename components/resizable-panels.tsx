"use client"

import React from "react"

import { useState, useRef, useCallback } from "react"
import { cn } from "@/lib/utils"

interface ResizablePanelsProps {
  leftPanel: React.ReactNode
  rightPanel: React.ReactNode
  defaultLeftWidth?: number
  minLeftWidth?: number
  maxLeftWidth?: number
  className?: string
}

export function ResizablePanels({
  leftPanel,
  rightPanel,
  defaultLeftWidth = 50,
  minLeftWidth = 20,
  maxLeftWidth = 80,
  className,
}: ResizablePanelsProps) {
  const [leftWidth, setLeftWidth] = useState(defaultLeftWidth)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return

      const containerRect = containerRef.current.getBoundingClientRect()
      const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100

      const clampedWidth = Math.min(Math.max(newLeftWidth, minLeftWidth), maxLeftWidth)
      setLeftWidth(clampedWidth)
    },
    [isDragging, minLeftWidth, maxLeftWidth],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Add global mouse event listeners
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      document.body.style.cursor = "col-resize"
      document.body.style.userSelect = "none"

      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
        document.body.style.cursor = ""
        document.body.style.userSelect = ""
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  return (
    <div ref={containerRef} className={cn("flex h-full", className)}>
      {/* Left Panel */}
      <div style={{ width: `${leftWidth}%` }} className="overflow-hidden">
        {leftPanel}
      </div>

      {/* Resize Handle */}
      <div
        className={cn(
          "w-1 bg-gray-200 hover:bg-gray-300 cursor-col-resize flex-shrink-0 relative group",
          isDragging && "bg-blue-400",
        )}
        onMouseDown={handleMouseDown}
      >
        <div className="absolute inset-y-0 -left-1 -right-1 group-hover:bg-gray-300/50" />
      </div>

      {/* Right Panel */}
      <div style={{ width: `${100 - leftWidth}%` }} className="overflow-hidden">
        {rightPanel}
      </div>
    </div>
  )
}
