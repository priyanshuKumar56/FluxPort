"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Key, Copy, Plus, Trash2 } from "lucide-react"

export function ApiKeysManager({ organizationId }: { organizationId: string }) {
  const keys = [
    { id: "1", name: "GitHub Action", lastUsed: "2 hours ago", created: "Oct 12, 2025" },
    { id: "2", name: "Production Proxy", lastUsed: "Just now", created: "Sep 20, 2025" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button className="gap-2">
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
                <TableHead>Created</TableHead>
                <TableHead>Last Used</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {keys.map((k) => (
                <TableRow key={k.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Key className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="font-medium text-sm">{k.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{k.created}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{k.lastUsed}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon-sm">
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon-sm" className="text-destructive">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
