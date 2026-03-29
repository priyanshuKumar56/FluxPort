"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { createWorkspace } from "@/lib/store/slices/workspacesSlice"

export function CreateWorkspaceModal({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)

  const handleCreate = async () => {
    if (!name.trim()) return
    setLoading(true)
    
    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 600))
    
    dispatch(createWorkspace({ 
      name, 
      isTeam: true,
      ownerId: user?.id || "unknown" 
    }))
    
    setLoading(false)
    setName("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Team Workspace</DialogTitle>
          <DialogDescription>
            Create a new workspace to collaborate with your team. Workspaces keep your APIs, environments, and collections isolated.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              placeholder="e.g. Acme Backend Team"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreate()
              }}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleCreate} disabled={!name.trim() || loading} className="min-w-[100px]">
            {loading ? "Creating..." : "Create workspace"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
