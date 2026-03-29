"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Trash2, Plus, Save, Info, Search } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import {
  initializeVariables,
  addRuntimeVariable,
  updateRuntimeVariable,
  deleteRuntimeVariable,
  deleteAllRuntimeVariables,
  saveRuntimeVariables,
} from "@/lib/store/slices/runtimeVariablesSlice"

export function RuntimeVariablesPage() {
  const dispatch = useAppDispatch()
  const { variables } = useAppSelector((state) => state.runtimeVariables)

  useEffect(() => {
    dispatch(initializeVariables())
  }, [dispatch])

  const handleSave = () => {
    dispatch(saveRuntimeVariables())
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault()
        handleSave()
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [])

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold">Runtime Variables</h2>
          <button className="text-muted-foreground hover:text-foreground transition-colors" title="Variables available across all requests">
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              placeholder="Search variables"
              className="pl-8 h-8 w-48 text-xs bg-input/50 border-border"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs font-medium border-border text-muted-foreground hover:text-destructive"
            onClick={() => dispatch(deleteAllRuntimeVariables())}
          >
            <Trash2 className="w-3 h-3 mr-1" />
            Delete all
          </Button>
          <Button
            size="sm"
            className="h-8 text-xs font-semibold bg-primary hover:bg-primary/90"
            onClick={handleSave}
          >
            <Save className="w-3 h-3 mr-1" />
            Save
            <span className="ml-1.5 text-[9px] opacity-70">Ctrl S</span>
          </Button>
        </div>
      </div>

      {/* Table */}
      <ScrollArea className="flex-1">
        <div className="px-6 py-2">
          {/* Table header */}
          <div className="grid grid-cols-[1fr_120px_1fr_100px] gap-3 px-3 py-2 border-b border-border">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Key</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Type</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Current Value</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              Persistent
              <Info className="w-3 h-3" />
            </span>
          </div>

          {/* Table rows */}
          <div className="divide-y divide-border/50">
            {variables.map((variable) => (
              <div
                key={variable.id}
                className="grid grid-cols-[1fr_120px_1fr_100px] gap-3 px-3 py-2 items-center group hover:bg-accent/20 transition-colors"
              >
                <Input
                  value={variable.key}
                  onChange={(e) =>
                    dispatch(updateRuntimeVariable({ id: variable.id, updates: { key: e.target.value } }))
                  }
                  placeholder="Add new variable"
                  className="h-8 text-xs bg-transparent border-transparent hover:border-border focus:border-primary/50 font-mono"
                />
                <Select
                  value={variable.type}
                  onValueChange={(val) =>
                    dispatch(updateRuntimeVariable({ id: variable.id, updates: { type: val as any } }))
                  }
                >
                  <SelectTrigger className="h-8 text-xs bg-transparent border-transparent hover:border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="string">string</SelectItem>
                    <SelectItem value="number">number</SelectItem>
                    <SelectItem value="boolean">boolean</SelectItem>
                    <SelectItem value="json">json</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  value={variable.value}
                  onChange={(e) =>
                    dispatch(updateRuntimeVariable({ id: variable.id, updates: { value: e.target.value } }))
                  }
                  placeholder="Enter value"
                  className="h-8 text-xs bg-transparent border-transparent hover:border-border focus:border-primary/50 font-mono"
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={variable.persistent}
                      onCheckedChange={(checked) =>
                        dispatch(updateRuntimeVariable({ id: variable.id, updates: { persistent: checked } }))
                      }
                      className="scale-75"
                    />
                    <span className="text-xs text-muted-foreground">{variable.persistent ? "Yes" : "No"}</span>
                  </div>
                  <button
                    onClick={() => dispatch(deleteRuntimeVariable(variable.id))}
                    className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}

            {/* Add new row */}
            <div className="px-3 py-2">
              <button
                onClick={() => dispatch(addRuntimeVariable())}
                className="flex items-center gap-1.5 text-xs text-primary/70 hover:text-primary font-medium transition-colors"
              >
                <Plus className="w-3 h-3" />
                Add More
              </button>
            </div>
          </div>
        </div>

        {/* Keyboard shortcuts */}
        <div className="px-6 py-8 text-center space-y-3">
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground/60">
            <span>
              Save request <span className="kbd">Ctrl</span> <span className="kbd">S</span>
            </span>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
