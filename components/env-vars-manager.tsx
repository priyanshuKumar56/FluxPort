"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Lock, Eye, EyeOff, Plus, Trash2, Globe, Loader2 } from "lucide-react"
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks"
import { createEnvVar, deleteEnvVar } from "@/lib/store/slices/settingsSlice"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

export function EnvVarsManager({ workspaceId }: { workspaceId: string }) {
  const dispatch = useAppDispatch()
  const { envVars, loading } = useAppSelector((state) => state.settings)
  const [visibleIds, setVisibleIds] = useState<Set<string>>(new Set())
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [newVar, setNewVar] = useState({ name: '', key: '', value: '', is_encrypted: true })
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const toggleVisibility = (id: string) => {
    setVisibleIds(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const handleAdd = async () => {
    if (!workspaceId || !newVar.key || !newVar.value) return
    setActionLoading('add')
    try {
      await dispatch(createEnvVar({
        workspaceId,
        data: newVar
      })).unwrap()
      setIsAddOpen(false)
      setNewVar({ name: '', key: '', value: '', is_encrypted: true })
    } catch (error) {
      console.error('Failed to create env var:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async (id: string) => {
    if (!workspaceId) return
    setActionLoading(id)
    try {
      await dispatch(deleteEnvVar({ workspaceId, id })).unwrap()
    } catch (error) {
      console.error('Failed to delete env var:', error)
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Environment Variables</CardTitle>
            <CardDescription>Encrypted key-value pairs for your proxy rules and automated tests.</CardDescription>
          </div>
          <Button size="sm" className="gap-2" onClick={() => setIsAddOpen(true)}>
            <Plus className="h-4 w-4" /> Add Variable
          </Button>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          {envVars.map((v: any) => {
            const isVisible = visibleIds.has(v.id)
            return (
              <div
                key={v.id}
                className="group flex flex-col gap-2 p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="bg-background font-mono text-[10px]">
                      {v.key}
                    </Badge>
                    <code className="text-sm font-bold">{v.key}</code>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleVisibility(v.id)}
                      disabled={actionLoading === v.id}
                    >
                      {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => handleDelete(v.id)}
                      disabled={actionLoading === v.id}
                    >
                      {actionLoading === v.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="relative">
                  <Input
                    type={isVisible ? "text" : "password"}
                    value={isVisible ? v.value : '••••••••'}
                    readOnly
                    className="bg-background font-mono text-xs pr-10 border-dashed"
                  />
                  <Lock className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground opacity-50" />
                </div>
              </div>
            )
          })}

          {envVars.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No environment variables yet. Click "Add Variable" to create one.
            </div>
          )}

          <div
            className="flex items-center gap-2 p-4 rounded-lg border border-dashed text-muted-foreground justify-center text-sm cursor-pointer hover:bg-muted/30 transition-colors"
            onClick={() => setIsAddOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Define a new environment variable
          </div>
        </CardContent>
      </Card>

      {/* Add Variable Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Environment Variable</DialogTitle>
            <DialogDescription>
              Create a new environment variable for this workspace.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="var-name" className="text-right">Name</Label>
              <Input
                id="var-name"
                placeholder="e.g., Database URL"
                value={newVar.name}
                onChange={(e) => setNewVar({ ...newVar, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="var-key" className="text-right">Key</Label>
              <Input
                id="var-key"
                placeholder="e.g., DB_HOST"
                value={newVar.key}
                onChange={(e) => setNewVar({ ...newVar, key: e.target.value })}
                className="col-span-3 font-mono"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="var-value" className="text-right">Value</Label>
              <Input
                id="var-value"
                type="password"
                placeholder="e.g., localhost:5432"
                value={newVar.value}
                onChange={(e) => setNewVar({ ...newVar, value: e.target.value })}
                className="col-span-3 font-mono"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="var-encrypted" className="text-right">Encrypted</Label>
              <div className="flex items-center space-x-2 h-5">
                <input
                  id="var-encrypted"
                  type="checkbox"
                  checked={newVar.is_encrypted}
                  onChange={(e) => setNewVar({ ...newVar, is_encrypted: e.target.checked })}
                  className="h-4 w-4"
                />
                <span className="text-sm text-muted-foreground">Encrypt at rest</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button onClick={handleAdd} disabled={!newVar.key || !newVar.value || actionLoading === 'add'}>
              {actionLoading === 'add' ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Add Variable
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4 flex items-center gap-4 text-sm">
          <Globe className="h-5 w-5 text-primary" />
          <p className="flex-1">
            Environment variables are securely encrypted at rest. You can reference them in your rules using
            <code className="bg-primary/10 px-1 rounded mx-1">{"{{ VARIABLE_NAME }}"}</code> syntax.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
