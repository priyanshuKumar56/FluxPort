"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, Clock, AlertTriangle, CheckCircle } from "lucide-react"

export function MonitoringDashboard() {
  const recentRequests = [
    {
      id: "1",
      method: "GET",
      endpoint: "/api/users",
      status: 200,
      responseTime: 45,
      timestamp: "14:30:25",
      ip: "192.168.1.100",
    },
    {
      id: "2",
      method: "POST",
      endpoint: "/api/auth/login",
      status: 401,
      responseTime: 120,
      timestamp: "14:29:15",
      ip: "10.0.0.50",
    },
    {
      id: "3",
      method: "GET",
      endpoint: "/api/posts",
      status: 200,
      responseTime: 67,
      timestamp: "14:28:45",
      ip: "203.0.113.1",
    },
    {
      id: "4",
      method: "DELETE",
      endpoint: "/api/users/123",
      status: 404,
      responseTime: 23,
      timestamp: "14:27:30",
      ip: "192.168.1.100",
    },
  ]

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return "bg-green-100 text-green-800"
    if (status >= 400 && status < 500) return "bg-yellow-100 text-yellow-800"
    if (status >= 500) return "bg-red-100 text-red-800"
    return "bg-gray-100 text-gray-800"
  }

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET":
        return "bg-green-100 text-green-800"
      case "POST":
        return "bg-blue-100 text-blue-800"
      case "PUT":
        return "bg-yellow-100 text-yellow-800"
      case "DELETE":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Monitoring Dashboard</h1>
        <p className="text-muted-foreground">Real-time API monitoring and analytics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Requests/Hour</p>
                <p className="text-2xl font-bold">2,847</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Avg Response</p>
                <p className="text-2xl font-bold">67ms</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold">98.5%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm text-muted-foreground">Errors</p>
                <p className="text-2xl font-bold">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Recent API Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentRequests.map((request) => (
              <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Badge className={getMethodColor(request.method)}>{request.method}</Badge>
                  <span className="font-mono text-sm">{request.endpoint}</span>
                  <Badge className={getStatusColor(request.status)}>{request.status}</Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{request.responseTime}ms</span>
                  <span>{request.timestamp}</span>
                  <span className="font-mono">{request.ip}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Fluxport</span>
              <Badge className="bg-green-100 text-green-800">Healthy</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Database</span>
              <Badge className="bg-green-100 text-green-800">Connected</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Redis Cache</span>
              <Badge className="bg-green-100 text-green-800">Online</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Rate Limiter</span>
              <Badge className="bg-green-100 text-green-800">Active</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Endpoints</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { endpoint: "/api/users", requests: 1247 },
              { endpoint: "/api/auth/login", requests: 892 },
              { endpoint: "/api/posts", requests: 634 },
              { endpoint: "/api/orders", requests: 423 },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="font-mono text-sm">{item.endpoint}</span>
                <span className="text-sm text-muted-foreground">{item.requests} requests</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
