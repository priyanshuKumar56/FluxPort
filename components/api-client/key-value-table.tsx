"use client"

import React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

export interface KeyValuePair {
    id: string
    key: string
    value: string
    enabled: boolean
}

interface KeyValueTableProps {
    data: KeyValuePair[]
    setter: React.Dispatch<React.SetStateAction<KeyValuePair[]>>
    placeholder: { key: string; value: string }
}

export function KeyValueTable({ data, setter, placeholder }: KeyValueTableProps) {
    const handleKVChange = (
        id: string,
        field: "key" | "value" | "enabled",
        value: any
    ) => {
        setter((prev) => {
            const updated = prev.map((kv) => (kv.id === id ? { ...kv, [field]: value } : kv))
            // Add a new row if the last row is being edited
            if (updated[updated.length - 1].key || updated[updated.length - 1].value) {
                return [...updated, { id: Math.random().toString(), key: "", value: "", enabled: true }]
            }
            return updated
        })
    }

    const removeKV = (id: string) => {
        setter((prev) => (prev.length > 1 ? prev.filter((kv) => kv.id !== id) : prev))
    }

    return (
        <div className="space-y-2">
            <div className="grid grid-cols-[30px_1fr_1fr_40px] gap-2 px-2 text-[10px] font-bold text-muted-foreground uppercase">
                <div />
                <div>Key</div>
                <div>Value</div>
                <div />
            </div>
            {data.map((kv) => (
                <div key={kv.id} className="grid grid-cols-[30px_1fr_1fr_40px] gap-2 items-center group">
                    <input
                        type="checkbox"
                        checked={kv.enabled}
                        onChange={(e) => handleKVChange(kv.id, "enabled", e.target.checked)}
                        className="h-3 w-3 accent-primary"
                    />
                    <Input
                        value={kv.key}
                        onChange={(e) => handleKVChange(kv.id, "key", e.target.value)}
                        placeholder={placeholder.key}
                        className="h-8 text-xs font-mono"
                    />
                    <Input
                        value={kv.value}
                        onChange={(e) => handleKVChange(kv.id, "value", e.target.value)}
                        placeholder={placeholder.value}
                        className="h-8 text-xs font-mono"
                    />
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100"
                        onClick={() => removeKV(kv.id)}
                    >
                        <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                    </Button>
                </div>
            ))}
        </div>
    )
}
