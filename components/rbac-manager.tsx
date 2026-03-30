"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { UserPlus, MoreHorizontal, Shield, User, Loader2 } from "lucide-react"
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks"
import { InviteMemberModal } from "@/components/invite-member-modal"
import { inviteMember, removeMember, updateMemberRole } from "@/lib/store/slices/workspacesSlice"

export function RbacManager({ workspaceId }: { workspaceId: string }) {
  const { user } = useAppSelector((state) => state.auth)
  const { members, loading } = useAppSelector((state) => state.workspaces)
  const dispatch = useAppDispatch()
  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [inviteLink, setInviteLink] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const handleCreateLink = async () => {
    if (!workspaceId) return
    // This would generate a real invite link from the backend
    const link = `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/invite/${workspaceId}`
    setInviteLink(link)
  }

  const handleCopyLink = () => {
    if (inviteLink) {
      navigator.clipboard.writeText(inviteLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleInvite = async (email: string, role: string) => {
    if (!workspaceId) return
    setActionLoading('invite')
    try {
      await dispatch(inviteMember({ workspaceId, email, role })).unwrap()
      setIsInviteOpen(false)
    } catch (error) {
      console.error('Failed to invite member:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    if (!workspaceId) return
    setActionLoading(memberId)
    try {
      await dispatch(removeMember({ workspaceId, memberId })).unwrap()
    } catch (error) {
      console.error('Failed to remove member:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const displayMembers = members

  return (
    <div className="space-y-8 mt-2 max-w-5xl text-foreground">
      <InviteMemberModal
        open={isInviteOpen}
        onOpenChange={setIsInviteOpen}
        onInvite={handleInvite}
        loading={actionLoading === 'invite'}
      />

      {/* Public Invite link */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-semibold text-white tracking-tight">Public Invite link</h2>
          {!inviteLink ? (
            <Button onClick={handleCreateLink} className="bg-[#1a56db] hover:bg-[#1a56db]/90 text-white rounded font-medium h-8 px-4 text-xs">
              Create Link
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <div className="px-3 py-1.5 bg-[#222] border border-white/10 rounded text-xs font-mono text-emerald-400 select-all">
                {inviteLink}
              </div>
              <Button onClick={handleCopyLink} variant="outline" className="border-white/10 text-white rounded font-medium h-8 px-4 text-xs bg-transparent hover:bg-white/10 transition-colors">
                {copied ? "Copied!" : "Copy Link"}
              </Button>
            </div>
          )}
        </div>
        <p className="text-sm text-foreground/50">
          Share this secret link to invite people to this workspace. Only users who can invite members can see this.
        </p>
      </div>

      <div className="h-px w-full bg-white/10" />

      {/* Workspace Members */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white tracking-tight">Workspace Members</h2>
          <Button onClick={() => setIsInviteOpen(true)} className="bg-[#1a56db] hover:bg-[#1a56db]/90 text-white rounded font-medium h-8 px-4 text-xs gap-1">
            <UserPlus className="h-3.5 w-3.5" /> Invite People
          </Button>
        </div>

        <div className="border border-white/5 rounded-lg bg-[#222222]/80 overflow-hidden shadow-sm">
          <Table>
            <TableHeader className="border-b border-white/10">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="text-xs font-semibold text-foreground/50 h-10 w-2/3">User</TableHead>
                <TableHead className="text-xs font-semibold text-foreground/50 h-10 w-1/3">Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayMembers.map((member) => {
                const m = member as any;
                const displayName = m.full_name || m.name || m.email.split("@")[0];
                const displayRole = m.role ? m.role.charAt(0).toUpperCase() + m.role.slice(1) : "Admin";
                return (
                  <TableRow key={m.id} className="border-b border-white/5 hover:bg-white/5 transition-colors border-none group">
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded bg-white/20 flex flex-col items-center justify-end overflow-hidden pb-0 border border-white/10">
                          {/* Fake user silhouette */}
                          <div className="w-4 h-4 rounded-full bg-white/70 mb-0.5" />
                          <div className="w-8 h-4 rounded-t-full bg-white/70 translate-y-1" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-sm text-white">{displayName} {m.user_id === user?.id && <span className="text-foreground/60 font-normal">(You)</span>}</span>
                          <span className="text-xs text-foreground/50">{m.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="text-sm font-medium text-white">
                        {displayRole}
                      </span>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>

        {displayMembers.length === 1 && (
          <p className="text-center text-sm font-medium text-foreground/70 mt-6 pt-2">
            You are the only member in this workspace, add more members to collaborate.
          </p>
        )}
      </div>
    </div>
  )
}
