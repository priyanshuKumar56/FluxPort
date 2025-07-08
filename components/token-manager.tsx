"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Plus, Copy, Eye, EyeOff, Trash2, Key } from "lucide-react"

interface Token {
  id: string
  name: string
  token: string
  type: "api-key" | "jwt"
  expiresAt: string
  status: "active" | "expired" | "revoked"
  lastUsed: string
}

const initialTokens: Token[] = [
  {
    id: "1",
    name: "Production API",
    token: "ak_live_1234567890abcdef",
    type: "api-key",
    expiresAt: "2024-12-31",
    status: "active",
    lastUsed: "2024-01-15 14:30",
  },
  {
    id: "2",
    name: "Mobile App",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    type: "jwt",
    expiresAt: "2024-02-15",
    status: "active",
    lastUsed: "2024-01-15 12:15",
  },
]

export function TokenManager() {
  const [tokens, setTokens] = useState<Token[]>(initialTokens)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [showTokens, setShowTokens] = useState<Record<string, boolean>>({})
  const [formData, setFormData] = useState({
    name: "",
    type: "api-key",
    expiresIn: "30d",
  })

  const generateToken = () => {
    const newToken: Token = {
      id: Date.now().toString(),
      name: formData.name,
      token:
        formData.type === "api-key"
          ? `ak_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
          : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify({ sub: "user", exp: Date.now() + 86400000 }))}.signature`,
      type: formData.type as "api-key" | "jwt",
      expiresAt: new Date(
        Date.now() + (formData.expiresIn === "30d" ? 30 * 24 * 60 * 60 * 1000 : 365 * 24 * 60 * 60 * 1000),
      )
        .toISOString()
        .split("T")[0],
      status: "active",
      lastUsed: "Never",
    }

    setTokens([...tokens, newToken])
    setIsDialogOpen(false)
    setFormData({ name: "", type: "api-key", expiresIn: "30d" })
  }

  const toggleTokenVisibility = (tokenId: string) => {
    setShowTokens((prev) => ({ ...prev, [tokenId]: !prev[tokenId] }))
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Token Manager</h1>
          <p className="text-muted-foreground">Manage API keys and JWT tokens</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Generate Token
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Generate New Token</DialogTitle>
              <DialogDescription>Create a new API key or JWT token for your application.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="token-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="token-name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  className="col-span-3"
                  placeholder="Token name"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="token-type" className="text-right">
                  Type
                </Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
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
                <Select
                  value={formData.expiresIn}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, expiresIn: value }))}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">7 Days</SelectItem>
                    <SelectItem value="30d">30 Days</SelectItem>
                    <SelectItem value="90d">90 Days</SelectItem>
                    <SelectItem value="1y">1 Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={generateToken} disabled={!formData.name}>
                Generate Token
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Key className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Tokens</p>
                <p className="text-2xl font-bold">{tokens.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-full bg-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{tokens.filter((t) => t.status === "active").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-full bg-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">Revoked</p>
                <p className="text-2xl font-bold">{tokens.filter((t) => t.status === "revoked").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tokens Table */}
      <Card>
        <CardHeader>
          <CardTitle>API Tokens</CardTitle>
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
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tokens.map((token) => (
                <TableRow key={token.id}>
                  <TableCell className="font-medium">{token.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {token.type}
                    </Badge>
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
                  <TableCell className="text-muted-foreground">{token.expiresAt}</TableCell>
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
    </div>
  )
}
