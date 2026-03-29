"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Send, Save, Loader2, Globe } from "lucide-react"
import { cn } from "@/lib/utils"

interface RequestHeaderProps {
  method: string
  setMethod: (method: string) => void
  url: string
  setUrl: (url: string) => void
  useProxy: boolean
  setUseProxy: (useProxy: boolean) => void
  isLoading: boolean
  handleSend: () => void
  handleSave: () => void
}

const methodColors: Record<string, string> = {
  GET: "text-emerald-400",
  POST: "text-amber-400",
  PUT: "text-blue-400",
  DELETE: "text-red-400",
  PATCH: "text-violet-400",
  HEAD: "text-cyan-400",
  OPTIONS: "text-purple-400",
}

export function RequestHeader({
  method,
  setMethod,
  url,
  setUrl,
  useProxy,
  setUseProxy,
  isLoading,
  handleSend,
  handleSave,
}: RequestHeaderProps) {
  return (
    <div className="flex items-center gap-2 p-3 border-b border-border">
      {/* Method selector */}
      <Select value={method} onValueChange={setMethod}>
        <SelectTrigger className={cn("w-[100px] font-bold text-xs border-border bg-input/50", methodColors[method])}>
          <SelectValue placeholder="Method" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="GET" className="text-emerald-400 font-semibold">GET</SelectItem>
          <SelectItem value="POST" className="text-amber-400 font-semibold">POST</SelectItem>
          <SelectItem value="PUT" className="text-blue-400 font-semibold">PUT</SelectItem>
          <SelectItem value="DELETE" className="text-red-400 font-semibold">DELETE</SelectItem>
          <SelectItem value="PATCH" className="text-violet-400 font-semibold">PATCH</SelectItem>
          <SelectItem value="HEAD" className="text-cyan-400 font-semibold">HEAD</SelectItem>
          <SelectItem value="OPTIONS" className="text-purple-400 font-semibold">OPTIONS</SelectItem>
        </SelectContent>
      </Select>

      {/* URL input */}
      <div className="flex-1 relative">
        <Input
          placeholder="https://app.requestly.io/echo"
          className="font-mono text-xs bg-input/50 border-border focus:border-primary/50"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </div>

      {/* Send button - green like Requestly */}
      <Button
        onClick={handleSend}
        disabled={isLoading}
        className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-5 shadow-lg shadow-emerald-600/20"
      >
        {isLoading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <>
            Send
            <span className="ml-1.5 text-[9px] opacity-70">Ctrl↵</span>
          </>
        )}
      </Button>

      {/* Save button */}
      <Button
        variant="outline"
        size="sm"
        className="text-xs font-medium border-border hover:bg-accent"
        onClick={handleSave}
      >
        Save
      </Button>
    </div>
  )
}
