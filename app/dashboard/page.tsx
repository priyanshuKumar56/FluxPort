"use client"

import { useEffect } from "react"
import { AnalyticsCharts } from "@/components/analytics-charts"
import { RecentLogsTable } from "@/components/recent-logs-table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Activity, Zap, ShieldAlert, BarChart3, FlaskConical, History, ArrowUpRight, ArrowDownRight, Clock, CheckCircle2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks"
import { fetchLogs, fetchStats } from "@/lib/store/slices/logsSlice"
import { fetchRules } from "@/lib/store/slices/rulesSlice" // Corrected import path if needed, usually rulesSlice
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

export default function DashboardPage() {
  const dispatch = useAppDispatch()
  const { logs, stats } = useAppSelector((state) => state.logs)
  // Assuming rules might be in a separate slice, but using what was provided contextually or mocking if needed. 
  // If 'rules' is not in logsSlice, we might need to adjust. For now, referencing previous code's logic.
  const rules = useAppSelector((state) => (state as any).rules?.rules)

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          dispatch(fetchLogs({ limit: 1000 })),
          dispatch(fetchStats()),
          // dispatch(fetchRules()), // Uncomment if rules slice exists
        ]);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      }
    };
    loadData();
  }, [dispatch])

  const clientLogs = logs?.filter((l) => !l.requestUrl.includes("/api/proxy")) || []

  const dashboardStats = {
    totalRequests: logs?.length || 0,
    avgLatency: stats?.avgLatency || 0,
    errorRate: stats?.errorRate || "0.0",
    clientTests: clientLogs.length,
    clientSuccessRate: clientLogs.length
      ? ((clientLogs.filter((l) => l.responseStatus < 400).length / clientLogs.length) * 100).toFixed(1)
      : "0.0",
    activeRules: rules?.filter((r: any) => r.isActive).length || 0,
  }

  // Helper for trend indicators (mock logic for demo visual)
  const Trend = ({ value, label }: { value: string, label: string }) => (
    <div className="flex items-center gap-1 text-[10px] font-medium mt-2">
      <span className="text-emerald-500 flex items-center bg-emerald-50 px-1.5 py-0.5 rounded-full">
        <ArrowUpRight className="h-3 w-3 mr-0.5" /> {value}
      </span>
      <span className="text-gray-400">{label}</span>
    </div>
  )

  return (
    <div className="flex flex-col gap-6 p-6 min-h-full">

      <div className="flex flex-col gap-1 mb-2">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Overview
        </h1>
        <p className="text-sm text-gray-500">
          Monitor your API gateway metrics and recent activity.
        </p>
      </div>

      {/* Hero Stats Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

        <Card className="glass-card shadow-sm border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <BarChart3 className="w-24 h-24 text-primary" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Requests</CardTitle>
            <BarChart3 className="h-4 w-4 text-primary opacity-50" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{dashboardStats.totalRequests.toLocaleString()}</div>
            <Trend value="+12%" label="vs last hour" />
          </CardContent>
        </Card>

        <Card className="glass-card shadow-sm border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Zap className="w-24 h-24 text-amber-500" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Avg Latency</CardTitle>
            <Zap className="h-4 w-4 text-amber-500 opacity-50" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{dashboardStats.avgLatency}ms</div>
            <div className="flex items-center gap-1 text-[10px] font-medium mt-2">
              <span className="text-amber-500 flex items-center bg-amber-50 px-1.5 py-0.5 rounded-full">
                <Clock className="h-3 w-3 mr-0.5" /> Stable
              </span>
              <span className="text-gray-400">response time</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card shadow-sm border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <ShieldAlert className="w-24 h-24 text-rose-500" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Error Rate</CardTitle>
            <ShieldAlert className="h-4 w-4 text-rose-500 opacity-50" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{dashboardStats.errorRate}%</div>
            <div className="flex items-center gap-1 text-[10px] font-medium mt-2">
              <span className="text-rose-500 flex items-center bg-rose-50 px-1.5 py-0.5 rounded-full">
                <ArrowDownRight className="h-3 w-3 mr-0.5" /> +0.2%
              </span>
              <span className="text-gray-400">diagnostics needed</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card shadow-sm border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <CheckCircle2 className="w-24 h-24 text-emerald-500" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Success Rate</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500 opacity-50" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{dashboardStats.clientSuccessRate}%</div>
            <Trend value="Top tier" label="performance" />
          </CardContent>
        </Card>
      </div>

      {/* Feature Sections Grid */}
      <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-7">

        {/* Main Chart Area */}
        <Card className="md:col-span-2 lg:col-span-5 border-none shadow-sm bg-white/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-900">Traffic Analysis</CardTitle>
            <CardDescription className="text-xs">Incoming request volume and latency over time</CardDescription>
          </CardHeader>
          <CardContent className="pl-0">
            <div className="h-[300px] w-full">
              <AnalyticsCharts data={logs || []} />
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity Feed */}
        <Card className="md:col-span-1 lg:col-span-2 border-none shadow-sm bg-white/50 backdrop-blur-sm flex flex-col">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-900">Recent Tests</CardTitle>
            <CardDescription className="text-xs">Latest client API calls</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 min-h-0 pl-2 pr-2">
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-4">
                {clientLogs.slice(0, 6).map((log) => (
                  <div key={log.id} className="flex items-start gap-3 group p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className={cn(
                      "mt-0.5 flex h-6 w-6 items-center justify-center rounded-full border text-[10px] font-bold shadow-sm",
                      log.requestMethod === "GET" ? "bg-blue-50 border-blue-200 text-blue-600" :
                        log.requestMethod === "POST" ? "bg-emerald-50 border-emerald-200 text-emerald-600" :
                          log.requestMethod === "DELETE" ? "bg-red-50 border-red-200 text-red-600" :
                            "bg-gray-50 border-gray-200 text-gray-600"
                    )}>
                      {log.requestMethod.substring(0, 1)}
                    </div>
                    <div className="flex-1 space-y-1 min-w-0">
                      <p className="text-xs font-medium leading-none truncate text-gray-700">{log.requestUrl}</p>
                      <div className="flex items-center gap-2 text-[10px] text-gray-400">
                        <span className="font-mono">{log.responseStatus}</span>
                        <span>•</span>
                        <span>{log.latencyMs}ms</span>
                      </div>
                    </div>
                  </div>
                ))}
                {clientLogs.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full text-center py-10 opacity-40">
                    <History className="h-8 w-8 mb-2" />
                    <span className="text-xs">No recent activity</span>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Logs Table */}
      <Card className="border-none shadow-sm bg-white/80 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold text-gray-900">System Logs</CardTitle>
            <CardDescription className="text-xs">Comprehensive log of all gateway events</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="h-7 text-xs bg-white">
            Export CSV
          </Button>
        </CardHeader>
        <CardContent>
          <RecentLogsTable logs={logs?.slice(0, 10).map(log => ({
            latency_ms: log.latencyMs,
            response_status: log.responseStatus,
            timestamp: log.timestamp,
            request_url: log.requestUrl,
            request_method: log.requestMethod,
          })) || []} />
        </CardContent>
      </Card>

    </div>
  )
}
