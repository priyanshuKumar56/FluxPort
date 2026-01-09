"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Send, Save, Loader2, Globe } from "lucide-react"

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
        <div className="flex items-center gap-2 p-4 border-b">
            <Select value={method} onValueChange={setMethod}>
                <SelectTrigger className="w-[120px] font-bold text-primary">
                    <SelectValue placeholder="Method" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="GET" className="text-green-500">GET</SelectItem>
                    <SelectItem value="POST" className="text-yellow-500">POST</SelectItem>
                    <SelectItem value="PUT" className="text-blue-500">PUT</SelectItem>
                    <SelectItem value="DELETE" className="text-red-500">DELETE</SelectItem>
                </SelectContent>
            </Select>

            <div className="flex-1 relative flex items-center">
                <Globe className="absolute left-3 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                <Input
                    placeholder="https://api.example.com/v1/resource"
                    className="pl-9 font-mono bg-muted/30 focus-visible:bg-background transition-colors"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                />
            </div>

            <div className="flex items-center gap-2 px-3 border-l border-r h-8 bg-muted/20 rounded-md">
                <span className="text-[9px] font-black text-muted-foreground uppercase tracking-tighter">Smart Relay</span>
                <input
                    type="checkbox"
                    checked={useProxy}
                    onChange={(e) => setUseProxy(e.target.checked)}
                    className="h-3 w-3 accent-primary cursor-pointer"
                />
            </div>

            <Button
                onClick={handleSend}
                disabled={isLoading}
                className="bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20"
            >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                Send
            </Button>

            <Button
                variant="outline"
                size="icon"
                className="hover:bg-primary hover:text-primary-foreground transition-colors bg-transparent border-muted-foreground/20"
                onClick={handleSave}
            >
                <Save className="h-4 w-4" />
            </Button>
        </div>
    )
}
