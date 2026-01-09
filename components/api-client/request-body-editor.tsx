"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface RequestBodyEditorProps {
    body: string
    setBody: (body: string) => void
}

export function RequestBodyEditor({ body, setBody }: RequestBodyEditorProps) {
    const formatJson = () => {
        try {
            setBody(JSON.stringify(JSON.parse(body), null, 2))
        } catch (e) {
            console.warn("Invalid JSON, cannot format")
        }
    }

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-[10px] font-bold">
                    JSON
                </Badge>
                <div className="flex-1" />
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-[10px] font-bold hover:bg-primary/10"
                    onClick={formatJson}
                >
                    Format
                </Button>
            </div>
            <textarea
                className="w-full h-[300px] p-4 bg-muted/30 font-mono text-sm rounded-xl border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none shadow-inner"
                placeholder='{ "key": "value" }'
                value={body}
                onChange={(e) => setBody(e.target.value)}
            />
        </div>
    )
}
