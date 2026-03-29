"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Plus, Trash2, Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"

interface EnvVariable {
  id: string
  key: string
  type: "default" | "secret"
  initialValue: string
  currentValue: string
}

export function EnvironmentEditor() {
  const [search, setSearch] = useState("")
  const [variables, setVariables] = useState<EnvVariable[]>([
    { id: "1", key: "", type: "default", initialValue: "", currentValue: "" },
  ])
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({})

  const addVariable = () => {
    setVariables([...variables, { id: Date.now().toString(), key: "", type: "default", initialValue: "", currentValue: "" }])
  }

  const updateVariable = (id: string, field: keyof EnvVariable, value: any) => {
    setVariables((prev) => prev.map((v) => (v.id === id ? { ...v, [field]: value } : v)))
  }

  const removeVariable = (id: string) => {
    setVariables((prev) => prev.filter((v) => v.id !== id))
    if (variables.length === 1) addVariable() // Keep at least one empty row
  }

  const toggleSecret = (id: string) => {
    setShowSecrets((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const filteredVars = variables.filter(v => v.key.toLowerCase().includes(search.toLowerCase()) || !v.key)

  return (
    <div className="flex flex-col h-full bg-background animate-in fade-in duration-300">
      {/* Top search bar area */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            className="pl-8 h-8 text-xs bg-muted/30 border-border/50 focus-visible:ring-1 focus-visible:ring-primary/50"
            placeholder="Search variables..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 text-[11px] font-medium transition-all hover:bg-primary/20 hover:text-primary hover:border-primary/50" onClick={() => setVariables([])}>
            Clear all
          </Button>
          <Button size="sm" className="h-8 text-[11px] font-medium bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm">
            Save changes
          </Button>
        </div>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-[3fr_1fr_3fr_3fr_40px] gap-2 px-4 py-2 border-b border-border bg-muted/10 text-[11px] font-semibold text-muted-foreground tracking-wide">
        <div>Key</div>
        <div>Type</div>
        <div className="flex items-center gap-1.5">
          Initial Value
          <span className="bg-blue-500/10 text-blue-500 text-[9px] px-1.5 py-0.5 rounded font-bold tracking-widest">SYNCED</span>
        </div>
        <div className="flex items-center gap-1.5">
          Current Value
          <span className="bg-muted text-muted-foreground text-[9px] px-1.5 py-0.5 rounded font-bold tracking-widest border border-border/50">LOCAL</span>
        </div>
        <div></div>
      </div>

      {/* Table Body */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
        {filteredVars.map((variable) => (
          <div key={variable.id} className="grid grid-cols-[3fr_1fr_3fr_3fr_40px] gap-2 items-center group/row">
            {/* Key */}
            <Input
              value={variable.key}
              onChange={(e) => updateVariable(variable.id, "key", e.target.value)}
              placeholder="Add new variable"
              className="h-8 text-xs border-transparent hover:border-border/50 focus-visible:border-primary/50 bg-transparent hover:bg-muted/20 focus-visible:bg-muted/10 font-mono transition-colors rounded shadow-none"
            />
            
            {/* Type Selector */}
            <select
              title="Type"
              value={variable.type}
              onChange={(e) => updateVariable(variable.id, "type", e.target.value)}
              className="w-full h-8 text-[11px] bg-transparent border border-transparent hover:border-border/50 rounded px-2 outline-none focus:border-primary/50 appearance-none cursor-pointer transition-colors"
            >
              <option value="default" className="bg-card text-foreground">default</option>
              <option value="secret" className="bg-card text-foreground">secret</option>
            </select>

            {/* Initial Value (Synced) */}
            <div className="relative flex items-center">
              <Input
                type={variable.type === "secret" && !showSecrets[`initial-${variable.id}`] ? "password" : "text"}
                value={variable.initialValue}
                onChange={(e) => updateVariable(variable.id, "initialValue", e.target.value)}
                placeholder="Enter value"
                className="h-8 text-xs border-transparent hover:border-border/50 focus-visible:border-blue-500/50 bg-transparent hover:bg-muted/20 focus-visible:bg-blue-500/5 transition-colors rounded shadow-none font-mono placeholder:font-sans pr-8"
              />
              {variable.type === "secret" && (
                <button
                  type="button"
                  onClick={() => toggleSecret(`initial-${variable.id}`)}
                  className="absolute right-2 p-1 text-muted-foreground hover:text-foreground hover:bg-accent rounded outline-none"
                  title="Toggle visibility"
                >
                  {showSecrets[`initial-${variable.id}`] ? (
                    <EyeOff className="w-3.5 h-3.5" />
                  ) : (
                    <Eye className="w-3.5 h-3.5" />
                  )}
                </button>
              )}
            </div>

            {/* Current Value (Local) */}
            <div className="relative flex items-center">
              <Input
                type={variable.type === "secret" && !showSecrets[`current-${variable.id}`] ? "password" : "text"}
                value={variable.currentValue}
                onChange={(e) => updateVariable(variable.id, "currentValue", e.target.value)}
                placeholder="Enter value"
                className="h-8 text-xs border-transparent hover:border-border/50 focus-visible:border-foreground/30 bg-transparent hover:bg-muted/20 focus-visible:bg-muted/10 transition-colors rounded shadow-none font-mono placeholder:font-sans pr-8"
              />
              {variable.type === "secret" && (
                <button
                  type="button"
                  onClick={() => toggleSecret(`current-${variable.id}`)}
                  className="absolute right-2 p-1 text-muted-foreground hover:text-foreground hover:bg-accent rounded outline-none"
                  title="Toggle visibility"
                >
                  {showSecrets[`current-${variable.id}`] ? (
                    <EyeOff className="w-3.5 h-3.5" />
                  ) : (
                    <Eye className="w-3.5 h-3.5" />
                  )}
                </button>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-center">
              <button
                onClick={() => removeVariable(variable.id)}
                className={cn(
                  "p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors",
                  (!variable.key && !variable.initialValue && !variable.currentValue) ? "opacity-0" : "opacity-0 group-hover/row:opacity-100"
                )}
                title="Remove variable"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
        
        <div className="pt-2 px-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={addVariable}
            className="h-7 text-xs font-medium text-muted-foreground hover:text-foreground gap-1.5 hover:bg-accent"
          >
            <Plus className="w-3.5 h-3.5" />
            Add More
          </Button>
        </div>
      </div>
    </div>
  )
}
