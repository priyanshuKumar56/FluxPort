"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Copy, Eye, EyeOff, Trash2, Key, Clock, Shield } from "lucide-react"

interface Token {
  id: string
  name: string
  type: "jwt" | "api-key"
  token: string
  expiresAt: string
  status: "active" | "expired" | "revoked"
  lastUsed: string
  permissions: string[]
}

const mockTokens: Token[] = [
  {
    id: "1",
    name: "Production API Key",
    type: "api-key",
    token: "ak_live_1234567890abcdef",
    expiresAt: "2024-12-31",
    status: "active",
    lastUsed: "2024-01-15 14:30",
    permissions: ["read", "write"],
  },
  {
    id: "2",
    name: "Mobile App JWT",
    type: "jwt",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    expiresAt: "2024-02-15",
    status: "active",
    lastUsed: "2024-01-15 12:15",
    permissions: ["read"],
  },
  {
    id: "3",
    name: "Test Environment",
    type: "api-key",
    token: "ak_test_abcdef1234567890",
    expiresAt: "2024-06-30",
    status: "expired",
    lastUsed: "2024-01-10 09:45",
    permissions: ["read", "write", "admin"],
  },
]

export function TokenManagement() {
  const [tokens, setTokens] = useState<Token[]>(mockTokens)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [showTokens, setShowTokens] = useState<Record<string, boolean>>({})

  const toggleTokenVisibility = (tokenId: string) => {
    setShowTokens((prev) => ({
      ...prev,
      [tokenId]: !prev[tokenId],
    }))
  }

  const copyToken = (token: string) => {
    navigator.clipboard.writeText(token)
  }

  const revokeToken = (tokenId: string) => {
    setTokens(tokens.map((token) => (token.id === tokenId ? { ...token, status: "revoked" as const } : token)))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "expired":
        return "bg-yellow-100 text-yellow-800"
      case "revoked":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeIcon = (type: string) => {
    return type === "jwt" ? <Shield className="h-4 w-4" /> : <Key className="h-4 w-4" />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Token Management</h2>
          <p className="text-muted-foreground">Manage JWT tokens and API keys</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Generate Token
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Generate New Token</DialogTitle>
              <DialogDescription>Create a new JWT token or API key for your application.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="token-name" className="text-right">
                  Name
                </Label>
                <Input id="token-name" className="col-span-3" placeholder="Token name" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="token-type" className="text-right">
                  Type
                </Label>
                <Select defaultValue="api-key">
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select token type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="api-key">API Key</SelectItem>
                    <SelectItem value="jwt">JWT Token</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="expires" className="text-right">
                  Expires
                </Label>
                <Select defaultValue="30d">
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select expiration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1d">1 Day</SelectItem>
                    <SelectItem value="7d">7 Days</SelectItem>
                    <SelectItem value="30d">30 Days</SelectItem>
                    <SelectItem value="90d">90 Days</SelectItem>
                    <SelectItem value="1y">1 Year</SelectItem>
                    <SelectItem value="never">Never</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={() => setIsDialogOpen(false)}>
                Generate Token
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="tokens" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tokens">Active Tokens</TabsTrigger>
          <TabsTrigger value="logs">Access Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="tokens">
          <Card>
            <CardHeader>
              <CardTitle>Token List</CardTitle>
              <CardDescription>Manage your API tokens and their permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Token</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead>Last Used</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tokens.map((token) => (
                    <TableRow key={token.id}>
                      <TableCell className="font-medium">{token.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTypeIcon(token.type)}
                          <span className="capitalize">{token.type}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        <div className="flex items-center gap-2">
                          <span>{showTokens[token.id] ? token.token : token.token.substring(0, 20) + "..."}</span>
                          <Button variant="ghost" size="sm" onClick={() => toggleTokenVisibility(token.id)}>
                            {showTokens[token.id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => copyToken(token.token)}>
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(token.status)}>{token.status}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {token.expiresAt}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{token.lastUsed}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => revokeToken(token.id)}
                          disabled={token.status !== "active"}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>Access Logs</CardTitle>
              <CardDescription>View token usage and access patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    time: "2024-01-15 14:30:25",
                    token: "Production API Key",
                    endpoint: "/api/users",
                    status: "200",
                    ip: "192.168.1.100",
                  },
                  {
                    time: "2024-01-15 14:29:15",
                    token: "Mobile App JWT",
                    endpoint: "/api/auth/verify",
                    status: "200",
                    ip: "10.0.0.50",
                  },
                  {
                    time: "2024-01-15 14:28:45",
                    token: "Production API Key",
                    endpoint: "/api/orders",
                    status: "401",
                    ip: "192.168.1.100",
                  },
                ].map((log, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-muted-foreground">{log.time}</div>
                      <div className="font-medium">{log.token}</div>
                      <div className="font-mono text-sm">{log.endpoint}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={log.status === "200" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                      >
                        {log.status}
                      </Badge>
                      <div className="text-sm text-muted-foreground">{log.ip}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
