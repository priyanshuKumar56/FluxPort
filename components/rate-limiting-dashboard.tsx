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
import { Progress } from "@/components/ui/progress"
import { Plus, Activity, AlertTriangle, TrendingUp, Clock } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

interface RateLimit {
  id: string
  name: string
  endpoint: string
  limit: number
  window: string
  current: number
  status: "active" | "exceeded" | "warning"
}

const mockLimits: RateLimit[] = [
  {
    id: "1",
    name: "User API Limit",
    endpoint: "/api/users/*",
    limit: 1000,
    window: "1h",
    current: 750,
    status: "warning",
  },
  {
    id: "2",
    name: "Auth Endpoint",
    endpoint: "/api/auth/login",
    limit: 100,
    window: "15m",
    current: 45,
    status: "active",
  },
  {
    id: "3",
    name: "File Upload",
    endpoint: "/api/upload",
    limit: 50,
    window: "1h",
    current: 52,
    status: "exceeded",
  },
]

const requestsData = [
  { time: "00:00", requests: 120, errors: 2 },
  { time: "01:00", requests: 150, errors: 1 },
  { time: "02:00", requests: 180, errors: 5 },
  { time: "03:00", requests: 220, errors: 8 },
  { time: "04:00", requests: 190, errors: 3 },
  { time: "05:00", requests: 250, errors: 12 },
]

const errorData = [
  { endpoint: "/api/users", count: 45 },
  { endpoint: "/api/auth", count: 23 },
  { endpoint: "/api/orders", count: 18 },
  { endpoint: "/api/upload", count: 12 },
]

export function RateLimitingDashboard() {
  const [limits, setLimits] = useState<RateLimit[]>(mockLimits)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      case "exceeded":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getProgressColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "warning":
        return "bg-yellow-500"
      case "exceeded":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Rate Limiting Dashboard</h2>
          <p className="text-muted-foreground">Monitor and configure API rate limits</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Limit
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Create Rate Limit</DialogTitle>
              <DialogDescription>Set up a new rate limit for an API endpoint.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="limit-name" className="text-right">
                  Name
                </Label>
                <Input id="limit-name" className="col-span-3" placeholder="Rate limit name" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="endpoint" className="text-right">
                  Endpoint
                </Label>
                <Input id="endpoint" className="col-span-3" placeholder="/api/endpoint/*" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="limit" className="text-right">
                  Limit
                </Label>
                <Input id="limit" type="number" className="col-span-3" placeholder="1000" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="window" className="text-right">
                  Window
                </Label>
                <Select defaultValue="1h">
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select time window" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1m">1 Minute</SelectItem>
                    <SelectItem value="5m">5 Minutes</SelectItem>
                    <SelectItem value="15m">15 Minutes</SelectItem>
                    <SelectItem value="1h">1 Hour</SelectItem>
                    <SelectItem value="1d">1 Day</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={() => setIsDialogOpen(false)}>
                Create Limit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,847</div>
            <p className="text-xs text-muted-foreground">+18% from last hour</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rate Limited</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">234</div>
            <p className="text-xs text-muted-foreground">-5% from last hour</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Limits</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{limits.length}</div>
            <p className="text-xs text-muted-foreground">Across all endpoints</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Peak Usage</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89%</div>
            <p className="text-xs text-muted-foreground">Highest limit reached</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="limits" className="space-y-4">
        <TabsList>
          <TabsTrigger value="limits">Rate Limits</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="blocked">Blocked IPs</TabsTrigger>
        </TabsList>

        <TabsContent value="limits">
          <Card>
            <CardHeader>
              <CardTitle>Rate Limits</CardTitle>
              <CardDescription>Current rate limits and their usage</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Endpoint</TableHead>
                    <TableHead>Limit</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {limits.map((limit) => (
                    <TableRow key={limit.id}>
                      <TableCell className="font-medium">{limit.name}</TableCell>
                      <TableCell className="font-mono text-sm">{limit.endpoint}</TableCell>
                      <TableCell>
                        {limit.limit} / {limit.window}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>
                              {limit.current} / {limit.limit}
                            </span>
                            <span>{Math.round((limit.current / limit.limit) * 100)}%</span>
                          </div>
                          <Progress value={(limit.current / limit.limit) * 100} className="h-2" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(limit.status)}>{limit.status}</Badge>
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

        <TabsContent value="analytics">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Requests Over Time</CardTitle>
                <CardDescription>API requests and rate limit errors</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={requestsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="requests" stroke="#8884d8" strokeWidth={2} />
                    <Line type="monotone" dataKey="errors" stroke="#ff7300" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>429 Errors by Endpoint</CardTitle>
                <CardDescription>Rate limit violations per endpoint</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={errorData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="endpoint" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#ff7300" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="blocked">
          <Card>
            <CardHeader>
              <CardTitle>Blocked IP Addresses</CardTitle>
              <CardDescription>IPs that have been temporarily or permanently blocked</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    ip: "192.168.1.100",
                    reason: "Rate limit exceeded",
                    blockedAt: "2024-01-15 14:30",
                    duration: "Temporary (1h)",
                  },
                  {
                    ip: "10.0.0.50",
                    reason: "Suspicious activity",
                    blockedAt: "2024-01-15 12:15",
                    duration: "Permanent",
                  },
                  {
                    ip: "203.0.113.1",
                    reason: "Multiple failed auth",
                    blockedAt: "2024-01-15 10:45",
                    duration: "Temporary (24h)",
                  },
                ].map((blocked, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="font-mono font-medium">{blocked.ip}</div>
                      <div className="text-sm text-muted-foreground">{blocked.reason}</div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="text-sm">{blocked.duration}</div>
                      <div className="text-xs text-muted-foreground">{blocked.blockedAt}</div>
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
