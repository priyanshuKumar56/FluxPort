"use client"

import React from "react"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Plus, MoreHorizontal, Trash2 } from "lucide-react"

export interface KeyValuePair {
  id: string
  key: string
  value: string
  enabled: boolean
  type?: string
}

interface KeyValueTableProps {
  data: KeyValuePair[]
  setter: (data: KeyValuePair[]) => void
  placeholder?: { key: string; value: string }
  showType?: boolean
}

export function KeyValueTable({ data, setter, placeholder, showType = true }: KeyValueTableProps) {
  const addRow = () => {
    setter([...data, { id: Date.now().toString(), key: "", value: "", enabled: true, type: "String" }])
  }

  const removeRow = (id: string) => {
    const filtered = data.filter((item) => item.id !== id)
    if (filtered.length === 0) {
      setter([{ id: Date.now().toString(), key: "", value: "", enabled: true, type: "String" }])
    } else {
      setter(filtered)
    }
  }

  const updateRow = (id: string, field: keyof KeyValuePair, value: any) => {
    setter(data.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  return (
    <div className="space-y-0">
      {/* Header */}
      <div className={`grid ${showType ? "grid-cols-[32px_1fr_1fr_100px_40px_32px]" : "grid-cols-[32px_1fr_1fr_40px_32px]"} gap-1 px-1 py-1.5 border-b border-border`}>
        <div />
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-1">
          {placeholder?.key || "Key"}
        </span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-1">
          {placeholder?.value || "Value"}
        </span>
        {showType && (
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-1">Type</span>
        )}
        <div className="flex items-center justify-center">
          <button className="text-[9px] font-medium text-muted-foreground hover:text-primary transition-colors">
            •••
          </button>
        </div>
        <div className="flex items-center justify-center">
          <span className="text-[9px] font-medium text-muted-foreground cursor-pointer hover:text-primary transition-colors">
            Bulk edit
          </span>
        </div>
      </div>

      {/* Rows */}
      {data.map((item) => (
        <div
          key={item.id}
          className={`grid ${showType ? "grid-cols-[32px_1fr_1fr_100px_40px_32px]" : "grid-cols-[32px_1fr_1fr_40px_32px]"} gap-1 px-1 py-0.5 group hover:bg-accent/20 transition-colors items-center`}
        >
          <div className="flex items-center justify-center">
            <Checkbox
              checked={item.enabled}
              onCheckedChange={(checked) => updateRow(item.id, "enabled", checked)}
              className="h-3.5 w-3.5 rounded-sm border-border"
            />
          </div>
          <Input
            value={item.key}
            onChange={(e) => updateRow(item.id, "key", e.target.value)}
            placeholder={placeholder?.key || "Key"}
            className="h-7 text-xs bg-transparent border-transparent hover:border-border focus:border-primary/50 font-mono px-1"
          />
          <Input
            value={item.value}
            onChange={(e) => updateRow(item.id, "value", e.target.value)}
            placeholder={placeholder?.value || "Value"}
            className="h-7 text-xs bg-transparent border-transparent hover:border-border focus:border-primary/50 font-mono px-1 text-muted-foreground"
          />
          {showType && (
            <Select
              value={item.type || "String"}
              onValueChange={(val) => updateRow(item.id, "type", val)}
            >
              <SelectTrigger className="h-7 text-[11px] bg-transparent border-transparent hover:border-border px-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="String">String</SelectItem>
                <SelectItem value="Number">Number</SelectItem>
                <SelectItem value="Boolean">Boolean</SelectItem>
                <SelectItem value="File">File</SelectItem>
              </SelectContent>
            </Select>
          )}
          <div className="flex items-center justify-center">
            <button className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground transition-all">
              <MoreHorizontal className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex items-center justify-center">
            <button
              className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
              onClick={() => removeRow(item.id)}
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      ))}

      {/* Add more button */}
      <div className="px-1 py-2">
        <button
          onClick={addRow}
          className="flex items-center gap-1.5 text-xs text-primary/70 hover:text-primary font-medium transition-colors"
        >
          <Plus className="w-3 h-3" />
          Add More
        </button>
      </div>
    </div>
  )
}
