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
import { Switch } from "@/components/ui/switch"
import { Plus, Shield, AlertTriangle, Ban, Eye, Search } from "lucide-react"

interface SecurityRule {
  id: string
  name: string
  type: "ip_block" | "rate_limit" | "geo_block" | "user_agent"
  condition: string
  action: "block" | "allow" | "log"
  enabled: boolean
}

interface SecurityEvent {
  id: string
  timestamp: string
  type: "blocked_ip" | "rate_limit" | "auth_failure" | "suspicious_activity"
  severity: "low" | "medium" | "high" | "critical"
  source: string
  description: string
  action: string
}

const mockRules: SecurityRule[] = [
  {
    id: "1",
    name: "Block Suspicious IPs",
    type: "ip_block",
    condition: "192.168.1.0/24",
    action: "block",
    enabled: true,
  },
  {
    id: "2",
    name: "Rate Limit Auth Endpoints",
    type: "rate_limit",
    condition: "/api/auth/* > 10/min",
    action: "block",
    enabled: true,
  },
  {
    id: "3",
    name: "Block Tor Exit Nodes",
    type: "geo_block",
    condition: "tor_exit_nodes",
    action: "block",
    enabled: false,
  },
]

const mockEvents: SecurityEvent[] = [
  {
    id: "1",
    timestamp: "2024-01-15 14:30:25",
    type: "blocked_ip",
    severity: "high",
    source: "192.168.1.100",
    description: "IP blocked due to suspicious activity",
    action: "Blocked request",
  },
  {
    id: "2",
    timestamp: "2024-01-15 14:29:15",
    type: "rate_limit",
    severity: "medium",
    source: "10.0.0.50",
    description: "Rate limit exceeded for /api/auth/login",
    action: "Request throttled",
  },
  {
    id: "3",
    timestamp: "2024-01-15 14:28:45",
    type: "auth_failure",
    severity: "low",
    source: "203.0.113.1",
    description: "Multiple failed authentication attempts",
    action: "Logged event",
  },
]

export function SecurityLogs() {
  const [rules, setRules] = useState<SecurityRule[]>(mockRules)
  const [events, setEvents] = useState<SecurityEvent[]>(mockEvents)
  const [isRuleDialogOpen, setIsRuleDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const toggleRule = (ruleId: string) => {
    setRules(rules.map((rule) => (rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule)))
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "bg-blue-100 text-blue-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "critical":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "blocked_ip":
        return <Ban className="h-4 w-4" />
      case "rate_limit":
        return <AlertTriangle className="h-4 w-4" />
      case "auth_failure":
        return <Shield className="h-4 w-4" />
      default:
        return <Eye className="h-4 w-4" />
    }
  }

  const filteredEvents = events.filter(
    (event) => event.description.toLowerCase().includes(searchTerm.toLowerCase()) || event.source.includes(searchTerm),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Security & Logs</h2>
          <p className="text-muted-foreground">Monitor security events and manage protection rules</p>
        </div>
        <Dialog open={isRuleDialogOpen} onOpenChange={setIsRuleDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Rule
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Create Security Rule</DialogTitle>
              <DialogDescription>Add a new security rule to protect your API.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="rule-name" className="text-right">
                  Name
                </Label>
                <Input id="rule-name" className="col-span-3" placeholder="Rule name" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="rule-type" className="text-right">
                  Type
                </Label>
                <Select defaultValue="ip_block">
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select rule type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ip_block">IP Block</SelectItem>
                    <SelectItem value="rate_limit">Rate Limit</SelectItem>
                    <SelectItem value="geo_block">Geo Block</SelectItem>
                    <SelectItem value="user_agent">User Agent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="condition" className="text-right">
                  Condition
                </Label>
                <Input id="condition" className="col-span-3" placeholder="192.168.1.0/24" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="action" className="text-right">
                  Action
                </Label>
                <Select defaultValue="block">
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="block">Block</SelectItem>
                    <SelectItem value="allow">Allow</SelectItem>
                    <SelectItem value="log">Log Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={() => setIsRuleDialogOpen(false)}>
                Create Rule
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="events" className="space-y-4">
        <TabsList>
          <TabsTrigger value="events">Security Events</TabsTrigger>
          <TabsTrigger value="rules">Security Rules</TabsTrigger>
          <TabsTrigger value="audit">Audit Trail</TabsTrigger>
        </TabsList>

        <TabsContent value="events">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Security Events</CardTitle>
                  <CardDescription>Recent security events and threats detected</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search events..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 w-64"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="text-sm text-muted-foreground">{event.timestamp}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTypeIcon(event.type)}
                          <span className="capitalize">{event.type.replace("_", " ")}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getSeverityColor(event.severity)}>{event.severity}</Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{event.source}</TableCell>
                      <TableCell>{event.description}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{event.action}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules">
          <Card>
            <CardHeader>
              <CardTitle>Security Rules</CardTitle>
              <CardDescription>Configure security rules and policies</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell className="font-medium">{rule.name}</TableCell>
                      <TableCell className="capitalize">{rule.type.replace("_", " ")}</TableCell>
                      <TableCell className="font-mono text-sm">{rule.condition}</TableCell>
                      <TableCell>
                        <Badge variant={rule.action === "block" ? "destructive" : "default"}>{rule.action}</Badge>
                      </TableCell>
                      <TableCell>
                        <Switch checked={rule.enabled} onCheckedChange={() => toggleRule(rule.id)} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit">
          <Card>
            <CardHeader>
              <CardTitle>Audit Trail</CardTitle>
              <CardDescription>Complete audit log of system changes and access</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    time: "2024-01-15 14:30:25",
                    user: "admin@gateway.com",
                    action: "Created security rule",
                    resource: "Block Suspicious IPs",
                  },
                  {
                    time: "2024-01-15 14:29:15",
                    user: "admin@gateway.com",
                    action: "Updated rate limit",
                    resource: "/api/auth/login",
                  },
                  {
                    time: "2024-01-15 14:28:45",
                    user: "system",
                    action: "Blocked IP address",
                    resource: "192.168.1.100",
                  },
                  {
                    time: "2024-01-15 14:27:30",
                    user: "admin@gateway.com",
                    action: "Generated API token",
                    resource: "Production API Key",
                  },
                ].map((audit, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-muted-foreground">{audit.time}</div>
                      <div className="font-medium">{audit.user}</div>
                      <div className="text-sm">{audit.action}</div>
                      <div className="text-sm text-muted-foreground">{audit.resource}</div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
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
