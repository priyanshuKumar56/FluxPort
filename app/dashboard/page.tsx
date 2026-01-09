"use client"

import { useEffect } from "react"
import { AnalyticsCharts } from "@/components/analytics-charts"
import { RecentLogsTable } from "@/components/recent-logs-table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Activity, Zap, ShieldAlert, BarChart3, FlaskConical, History } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks"
import { fetchLogs, fetchStats } from "@/lib/store/slices/logsSlice"
import { fetchRules } from "@/lib/store/slices/rulesSlice"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

export default function DashboardPage() {
  const dispatch = useAppDispatch()
  const { logs, stats } = useAppSelector((state) => state.logs)
  const { rules } = useAppSelector((state) => state.rules)

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          dispatch(fetchLogs({ limit: 1000 })),
          dispatch(fetchStats()),
          dispatch(fetchRules()),
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
    activeRules: rules?.filter((r) => r.isActive).length || 0,
  }

  return (
    <div className="flex flex-col gap-8 p-8 relative min-h-full">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -mr-40 -mt-20 animate-pulse pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[100px] -ml-20 -mb-20 pointer-events-none" />

      <div className="relative z-10 flex flex-col gap-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-foreground to-foreground/40 bg-clip-text text-transparent">
            System Intelligence
          </h1>
          <p className="text-muted-foreground font-medium max-w-2xl leading-relaxed">
            Real-time observability and performance metrics for your API ecosystem.
          </p>
        </div>

        {/* Global Metrics Section */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-5">
          <Card className="group bg-card/40 backdrop-blur-xl border-border/50 hover:border-primary/50 transition-all duration-500 hover:shadow-[0_0_20px_rgba(var(--primary),0.05)] overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground group-hover:text-primary transition-colors">
                Requests
              </CardTitle>
              <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                <BarChart3 className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black tracking-tighter">{dashboardStats.totalRequests.toLocaleString()}</div>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-[9px] py-0 px-1 border-primary/20 bg-primary/5 text-primary">LIVE</Badge>
                <span className="text-[10px] text-muted-foreground font-medium">Gateway Total</span>
              </div>
            </CardContent>
          </Card>

          <Card className="group bg-card/40 backdrop-blur-xl border-border/50 hover:border-blue-500/50 transition-all duration-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.05)]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground group-hover:text-blue-500 transition-colors">
                Latency
              </CardTitle>
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500 group-hover:scale-110 transition-transform">
                <Zap className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black tracking-tighter text-blue-500">{dashboardStats.avgLatency}ms</div>
              <p className="text-[10px] text-muted-foreground mt-1 font-medium italic opacity-60">Avg response speed</p>
            </CardContent>
          </Card>

          <Card className="group bg-card/40 backdrop-blur-xl border-border/50 hover:border-destructive/50 transition-all duration-500 hover:shadow-[0_0_20px_rgba(var(--destructive),0.05)]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground group-hover:text-destructive transition-colors">
                Stability
              </CardTitle>
              <div className="p-2 rounded-lg bg-destructive/10 text-destructive group-hover:scale-110 transition-transform">
                <ShieldAlert className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black tracking-tighter text-destructive">{dashboardStats.errorRate}%</div>
              <p className="text-[10px] text-muted-foreground mt-1 font-medium text-destructive/60">Failure Rate</p>
            </CardContent>
          </Card>

          <Card className="group bg-card/40 backdrop-blur-xl border-border/50 hover:border-yellow-500/50 transition-all duration-500 hover:shadow-[0_0_20px_rgba(234,179,8,0.05)]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground group-hover:text-yellow-500 transition-colors">
                Interceptors
              </CardTitle>
              <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-500 group-hover:scale-110 transition-transform">
                <Activity className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black tracking-tighter text-yellow-500">{dashboardStats.activeRules}</div>
              <p className="text-[10px] text-muted-foreground mt-1 font-medium">Active Logic Rules</p>
            </CardContent>
          </Card>

          <Card className="group bg-card/40 backdrop-blur-xl border-border/50 hover:border-green-500/50 transition-all duration-500 hover:shadow-[0_0_20px_rgba(34,197,94,0.05)]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground group-hover:text-green-500 transition-colors">
                Client Tests
              </CardTitle>
              <div className="p-2 rounded-lg bg-green-500/10 text-green-500 group-hover:scale-110 transition-transform">
                <FlaskConical className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black tracking-tighter text-green-500">{dashboardStats.clientTests}</div>
              <div className="flex items-center gap-1.5 mt-1 font-bold text-green-500/80">
                <span className="text-[10px] uppercase tracking-tighter">{dashboardStats.clientSuccessRate}% PASS RATE</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Section */}
        <div className="grid gap-6 md:grid-cols-7 lg:grid-cols-10">
          <Card className="md:col-span-4 lg:col-span-6 bg-card/20 backdrop-blur-md border-border/40 shadow-xl overflow-hidden">
            <CardHeader className="flex items-center justify-between flex-row border-b border-border/40 pb-6 px-6 bg-muted/5">
              <div className="space-y-1">
                <CardTitle className="text-xl font-black tracking-tight flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary animate-pulse" />
                  Traffic Performance
                </CardTitle>
                <CardDescription className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/60">
                  Latency Waveform (Last 50 Events)
                </CardDescription>
              </div>
              <div className="flex items-center gap-3 bg-muted/50 p-1 rounded-xl border border-border/50">
                <Button variant="ghost" size="sm" className="h-7 text-[9px] font-black tracking-widest bg-background shadow-sm px-4 rounded-lg">GATEWAY</Button>
                <Button variant="ghost" size="sm" className="h-7 text-[9px] font-black tracking-widest opacity-40 px-4">CLIENT</Button>
              </div>
            </CardHeader>
            <CardContent className="h-[380px] p-6 pt-10">
              <AnalyticsCharts data={logs || []} />
            </CardContent>
          </Card>

          <Card className="md:col-span-3 lg:col-span-4 bg-card/20 backdrop-blur-md border-border/40 shadow-xl overflow-hidden">
            <CardHeader className="border-b border-border/40 bg-muted/5 pb-6">
              <div className="space-y-1">
                <CardTitle className="text-xl font-black tracking-tight flex items-center gap-2">
                  <History className="h-4 w-4 text-primary" />
                  Testing Sessions
                </CardTitle>
                <CardDescription className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/60">
                  Real-time client request feed
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[380px]">
                <div className="divide-y divide-border/20 px-6">
                  {clientLogs.slice(0, 8).map((log) => (
                    <div key={log.id} className="flex items-center justify-between py-4 group hover:bg-primary/[0.02] transition-colors rounded-lg -mx-2 px-2">
                      <div className="flex flex-col gap-1.5 overflow-hidden">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter shadow-sm",
                            log.requestMethod === "GET" ? "bg-green-500/10 text-green-500" :
                              log.requestMethod === "POST" ? "bg-yellow-500/10 text-yellow-500" :
                                log.requestMethod === "DELETE" ? "bg-red-500/10 text-red-500" :
                                  "bg-blue-500/10 text-blue-500"
                          )}>
                            {log.requestMethod}
                          </div>
                          <span className="text-[12px] font-bold truncate max-w-[120px] lg:max-w-[180px] group-hover:text-primary transition-colors">{log.requestUrl}</span>
                        </div>
                        <div className="flex items-center gap-3 text-[10px] text-muted-foreground/60 font-medium">
                          <span className="flex items-center gap-1 tracking-tighter uppercase"><Activity className="h-2.5 w-2.5" /> {log.latencyMs}ms</span>
                          <span className="opacity-30">•</span>
                          <span className="tracking-tighter">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                        </div>
                      </div>
                      <Badge
                        variant={log.responseStatus < 400 ? "default" : "destructive"}
                        className={cn(
                          "text-[9px] font-black h-5 px-1.5 rounded-md",
                          log.responseStatus < 400 ? "bg-green-500/20 text-green-500 hover:bg-green-500/30" : "bg-red-500/20 text-red-500 hover:bg-red-500/30"
                        )}
                      >
                        {log.responseStatus}
                      </Badge>
                    </div>
                  ))}
                  {clientLogs.length === 0 && (
                    <div className="py-20 text-center flex flex-col items-center justify-center opacity-30 grayscale saturate-0 scale-75">
                      <History className="h-16 w-16 mb-4" />
                      <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">No recent testing data</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Global Activity Section */}
        <div className="grid gap-6 md:grid-cols-7 lg:grid-cols-10">
          <Card className="md:col-span-7 lg:col-span-10 bg-card/20 backdrop-blur-md border-border/40 shadow-xl overflow-hidden mt-2">
            <CardHeader className="bg-muted/5 border-b border-border/40 py-6 px-8">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-xl font-black tracking-tight">Global Infrastructure Log</CardTitle>
                  <CardDescription className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/60">
                    Live feed of all gateway, proxy, and direct client traffic
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-ping" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-green-500">LIVE SYNC ACTIVE</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 pb-8 min-h-[400px]">
              <RecentLogsTable logs={logs?.slice(0, 15).map(log => ({
                latency_ms: log.latencyMs,
                response_status: log.responseStatus,
                timestamp: log.timestamp,
                request_url: log.requestUrl,
                request_method: log.requestMethod,
              })) || []} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
