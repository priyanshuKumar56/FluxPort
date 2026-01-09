"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Server, MoreVertical, Eye, Trash2, Power, PowerOff } from "lucide-react"
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type MockServer = {
  id: string
  name: string
  base_path: string
  is_active: boolean
  created_at: string
  mock_responses: any[]
}

export function MockServerList({ mockServers }: { mockServers: MockServer[] }) {
  const [loading, setLoading] = useState<string | null>(null)

  const toggleActive = async (id: string, currentStatus: boolean) => {
    setLoading(id)
    try {
      // TODO: Implement mock server API endpoints in backend
      console.log('Toggle mock server:', id, !currentStatus)
    } finally {
      setLoading(null)
    }
  }

  const deleteMockServer = async (id: string) => {
    if (!confirm("Are you sure you want to delete this mock server?")) return
    setLoading(id)
    try {
      // TODO: Implement mock server API endpoints in backend
      console.log('Delete mock server:', id)
    } finally {
      setLoading(null)
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Base Path</TableHead>
          <TableHead>Endpoints</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
          <TableHead className="w-[100px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {mockServers.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
              <Server className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm">No mock servers yet. Create one to get started.</p>
            </TableCell>
          </TableRow>
        ) : (
          mockServers.map((server) => (
            <TableRow key={server.id}>
              <TableCell className="font-medium">{server.name}</TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground">{server.base_path}</TableCell>
              <TableCell>
                <Badge variant="outline" className="font-mono text-xs">
                  {server.mock_responses?.length || 0}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={server.is_active ? "default" : "secondary"} className="gap-1">
                  {server.is_active ? (
                    <>
                      <Power className="h-3 w-3" /> Active
                    </>
                  ) : (
                    <>
                      <PowerOff className="h-3 w-3" /> Inactive
                    </>
                  )}
                </Badge>
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {new Date(server.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-sm" disabled={loading === server.id}>
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => router.push(`/dashboard/mocks/${server.id}`)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toggleActive(server.id, server.is_active)}>
                      {server.is_active ? (
                        <>
                          <PowerOff className="h-4 w-4 mr-2" />
                          Deactivate
                        </>
                      ) : (
                        <>
                          <Power className="h-4 w-4 mr-2" />
                          Activate
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => deleteMockServer(server.id)} className="text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
