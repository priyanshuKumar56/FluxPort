"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Key, Copy, Plus, Trash2, Loader2, Eye, EyeOff } from "lucide-react"
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks"
import { createApiKey, deleteApiKey, clearNewApiKey } from "@/lib/store/slices/settingsSlice"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export function ApiKeysManager({ workspaceId }: { workspaceId: string }) {
  const dispatch = useAppDispatch()
  const { apiKeys, loading } = useAppSelector((state) => state.settings)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [newKey, setNewKey] = useState({ name: '', scopes: ['read'], expires_in_days: 30 })
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [showKeyId, setShowKeyId] = useState<string | null>(null)

  const handleCreate = async () => {
    if (!workspaceId || !newKey.name) return
    setActionLoading('create')
    try {
      await dispatch(createApiKey({
        workspaceId,
        data: newKey
      })).unwrap()
      setNewKey({ name: '', scopes: ['read'], expires_in_days: 30 })
    } catch (error) {
      console.error('Failed to create API key:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async (id: string) => {
    if (!workspaceId) return
    setActionLoading(id)
    try {
      await dispatch(deleteApiKey({ workspaceId, id })).unwrap()
    } catch (error) {
      console.error('Failed to delete API key:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Never'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const formatRelativeTime = (dateString: string) => {
    if (!dateString) return 'Never'
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} min ago`
    if (diffHours < 24) return `${diffHours} hours ago`
    return `${diffDays} days ago`
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button className="gap-2" onClick={() => setIsAddOpen(true)}>
          <Plus className="h-4 w-4" /> Create API Key
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Programmatic Access</CardTitle>
          <CardDescription>
            API keys allow you to manage rules and collections from your CLI or CI/CD pipelines.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Name</TableHead>
                <TableHead>Key</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Used</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apiKeys.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    No API keys yet. Create one to get started.
                  </TableCell>
                </TableRow>
              )}
              {apiKeys.map((k: any) => (
                <TableRow key={k.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Key className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="font-medium text-sm">{k.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <code className="text-xs font-mono bg-muted px-2 py-1 rounded">
                        {k.api_key ? (showKeyId === k.id ? k.api_key : k.api_key.substring(0, 20) + '...') : k.key_prefix + '...'}
                      </code>
                      {k.api_key && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => setShowKeyId(showKeyId === k.id ? null : k.id)}
                        >
                          {showKeyId === k.id ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleCopy(k.api_key || k.key_prefix, k.id)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      {copiedId === k.id && <span className="text-xs text-green-500">Copied!</span>}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{formatDate(k.created_at)}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{formatRelativeTime(k.last_used_at)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => handleDelete(k.id)}
                        disabled={actionLoading === k.id}
                      >
                        {actionLoading === k.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create API Key Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create API Key</DialogTitle>
            <DialogDescription>
              Create a new API key for programmatic access to this workspace.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="key-name" className="text-right">Name</Label>
              <Input
                id="key-name"
                value={newKey.name}
                onChange={(e) => setNewKey({ ...newKey, name: e.target.value })}
                placeholder="e.g. GitHub Actions"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">Scopes</Label>
              <div className="col-span-3 space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="scope-read"
                    checked={newKey.scopes.includes('read')}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setNewKey({ ...newKey, scopes: [...newKey.scopes, 'read'] })
                      } else {
                        setNewKey({ ...newKey, scopes: newKey.scopes.filter(s => s !== 'read') })
                      }
                    }}
                  />
                  <Label htmlFor="scope-read" className="text-sm font-normal">Read access</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="scope-write"
                    checked={newKey.scopes.includes('write')}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setNewKey({ ...newKey, scopes: [...newKey.scopes, 'write'] })
                      } else {
                        setNewKey({ ...newKey, scopes: newKey.scopes.filter(s => s !== 'write') })
                      }
                    }}
                  />
                  <Label htmlFor="scope-write" className="text-sm font-normal">Write access</Label>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="key-expiry" className="text-right">Expires (days)</Label>
              <Input
                id="key-expiry"
                type="number"
                value={newKey.expires_in_days}
                onChange={(e) => setNewKey({ ...newKey, expires_in_days: parseInt(e.target.value) || 0 })}
                placeholder="30"
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={!newKey.name || actionLoading === 'create'}>
              {actionLoading === 'create' ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Create Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
