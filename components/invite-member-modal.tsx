"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { inviteMember } from "@/lib/store/slices/workspacesSlice"
import { toast } from "sonner"

export function InviteMemberModal({
  open,
  onOpenChange,
  onInvite,
  loading: externalLoading
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onInvite?: (email: string, role: string) => Promise<void>
  loading?: boolean
}) {
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<'admin' | 'editor' | 'viewer'>("viewer")
  const [internalLoading, setInternalLoading] = useState(false)

  const dispatch = useAppDispatch()
  const { activeWorkspaceId } = useAppSelector(state => state.workspaces)

  // Use external loading prop if provided, otherwise use internal state
  const loading = externalLoading ?? internalLoading

  const handleInvite = async () => {
    if (!email.trim()) return

    // If external handler provided, use it
    if (onInvite) {
      await onInvite(email, role)
      setEmail("")
      return
    }

    // Otherwise use internal logic
    if (!activeWorkspaceId) return
    setInternalLoading(true)

    try {
      await dispatch(inviteMember({
        workspaceId: activeWorkspaceId,
        email,
        role
      })).unwrap()
      setEmail("")
      toast.success(`Invitation sent to ${email}`)
    } catch (error: any) {
      console.error("Failed to invite member:", error)
      toast.error(error?.error || error?.message || "Failed to send invitation")
    } finally {
      setInternalLoading(false)
    }
  }

  const invitationLink = activeWorkspaceId ? 
    `${typeof window !== 'undefined' ? window.location.origin : ''}/invite?token=INVITE_TOKEN_HERE` : 
    "Select a workspace first"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invite Team Member</DialogTitle>
          <DialogDescription>
            Invite teammates to collaborate in current workspace. They will receive an email invitation.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="colleague@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="col-span-3"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleInvite()
              }}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">
              Role
            </Label>
            <div className="col-span-3">
              <Select value={role} onValueChange={(val: any) => setRole(val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {invitationLink && (
            <div className="col-span-4 space-y-2">
              <Label className="text-right">
                Test Invitation Link
              </Label>
              <div className="col-span-3">
                <Input
                  value={invitationLink}
                  readOnly
                  className="text-xs text-muted-foreground"
                  onClick={() => {
                    navigator.clipboard.writeText(invitationLink)
                    toast.success('Invitation link copied to clipboard')
                  }}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Use this link to test invitation acceptance (replace INVITE_TOKEN_HERE with actual token)
                </p>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleInvite} className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[100px]" disabled={!email.trim() || !email.includes('@') || loading}>
            {loading ? "Sending..." : "Send invite"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
