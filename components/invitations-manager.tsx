"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks"
import { fetchWorkspaceInvitations } from "@/lib/store/slices/workspacesSlice"
import { Trash2, Mail, Clock, CheckCircle, XCircle, RefreshCw } from "lucide-react"
import { toast } from "sonner"

interface Invitation {
  id: string
  email: string
  role: string
  token: string
  invited_at: string
  expires_at: string
  accepted_at?: string
  status: 'pending' | 'accepted' | 'expired'
}

export function InvitationsManager({ workspaceId }: { workspaceId: string }) {
  const dispatch = useAppDispatch()
  const { invitations, loading } = useAppSelector((state) => state.workspaces)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    if (workspaceId) {
      dispatch(fetchWorkspaceInvitations(workspaceId))
    }
  }, [dispatch, workspaceId])

  const handleRefresh = () => {
    setRefreshing(true)
    dispatch(fetchWorkspaceInvitations(workspaceId)).finally(() => {
      setRefreshing(false)
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case 'accepted':
        return <Badge variant="default" className="bg-green-100 text-green-800">Accepted</Badge>
      case 'expired':
        return <Badge variant="destructive" className="bg-red-100 text-red-800">Expired</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const formatRole = (role: string) => {
    return role.charAt(0).toUpperCase() + role.slice(1)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  if (!workspaceId) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-sm text-muted-foreground">
            Select a workspace to view invitations
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Workspace Invitations</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              {refreshing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Refreshing...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </>
              )}
            </Button>
          </div>
        </div>
        <CardDescription>
          Manage pending and accepted workspace invitations
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : invitations.length === 0 ? (
          <div className="text-center py-8">
            <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground">
              No invitations found
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Invite team members to collaborate in your workspace
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Invited</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invitations.map((invitation: Invitation) => (
                <TableRow key={invitation.id}>
                  <TableCell className="font-medium">{invitation.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {formatRole(invitation.role)}
                    </Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(invitation.status)}</TableCell>
                  <TableCell>{formatDate(invitation.invited_at)}</TableCell>
                  <TableCell>{formatDate(invitation.expires_at)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {invitation.status === 'pending' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(
                              `${typeof window !== 'undefined' ? window.location.origin : ''}/invite?token=${invitation.token}`
                            )
                            toast.success('Invitation link copied to clipboard')
                          }}
                        >
                          Copy Link
                        </Button>
                      )}
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          // TODO: Implement revoke invitation
                          toast.info('Revoke invitation feature coming soon')
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
