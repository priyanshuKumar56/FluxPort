"use client"

import { useEffect } from "react"
import { LogsTable } from "@/components/logs-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, TrendingUp, Zap, AlertCircle } from "lucide-react"
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks"
import { fetchLogs, fetchStats } from "@/lib/store/slices/logsSlice"

export default function LogsPage() {
  const dispatch = useAppDispatch()
  const { logs, stats } = useAppSelector((state) => state.logs)
  const { activeWorkspaceId } = useAppSelector((state) => state.workspaces)

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          dispatch(fetchLogs({ limit: 1000, workspaceId: activeWorkspaceId || undefined })),
          dispatch(fetchStats(activeWorkspaceId || undefined)),
        ]);
      } catch (error) {
        console.error('Failed to load logs:', error);
      }
    };
    if (activeWorkspaceId) {
      loadData();
    }
  }, [dispatch, activeWorkspaceId])

  const totalRequests = logs.length
  const avgLatency = stats?.avgLatency || 0
  const errorCount = logs.filter(l => l.responseStatus >= 400).length
  const successRate = logs.length > 0 
    ? ((logs.filter(l => l.responseStatus < 400).length / logs.length) * 100).toFixed(1)
    : "100.0"

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Request Logs</h1>
          <p className="text-muted-foreground mt-1">Monitor and inspect all API requests in real-time</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRequests.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Latency</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgLatency}ms</div>
            <p className="text-xs text-muted-foreground mt-1">Average response time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{successRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">Successful requests</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Errors</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{errorCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Failed requests</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Real-time API request monitoring and inspection</CardDescription>
        </CardHeader>
        <CardContent>
          <LogsTable />
        </CardContent>
      </Card>
    </div>
  )
}
