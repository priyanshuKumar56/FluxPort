"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RbacManager } from "@/components/rbac-manager"
import { EnvVarsManager } from "@/components/env-vars-manager"
import { ApiKeysManager } from "@/components/api-keys-manager"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks"

// Imports for Overview
import { AnalyticsCharts } from "@/components/analytics-charts"
import { RecentLogsTable } from "@/components/recent-logs-table"
import { Activity, Zap, ShieldAlert, BarChart3, FlaskConical, History } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { fetchLogs, fetchStats } from "@/lib/store/slices/logsSlice"
import { fetchRules } from "@/lib/store/slices/rulesSlice"
import { fetchWorkspaceMembers } from "@/lib/store/slices/workspacesSlice"
import { fetchEnvVars, fetchApiKeys, fetchWorkspaceSettings } from "@/lib/store/slices/settingsSlice"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

export default function SettingsPage() {
  const { user } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()

  // Overview state
  const { logs, stats } = useAppSelector((state) => state.logs)
  const { rules } = useAppSelector((state) => state.rules)

  // Must be declared before useEffect uses it
  const activeWorkspace = useAppSelector(state => state.workspaces.workspaces.find(w => w.id === state.workspaces.activeWorkspaceId))

  useEffect(() => {
    if (user && activeWorkspace?.id) {
      const loadData = async () => {
        try {
          await Promise.all([
            dispatch(fetchLogs({ limit: 1000 })),
            dispatch(fetchStats()),
            dispatch(fetchRules(activeWorkspace.id)),
            dispatch(fetchWorkspaceMembers(activeWorkspace.id)),
            dispatch(fetchEnvVars({ workspaceId: activeWorkspace.id })),
            dispatch(fetchApiKeys(activeWorkspace.id)),
            dispatch(fetchWorkspaceSettings(activeWorkspace.id)),
          ]);
        } catch (error) {
          console.error('Failed to load dashboard data:', error);
        }
      };
      loadData();
    }
  }, [dispatch, user, activeWorkspace?.id])

  if (!user) return null

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
    <div className="flex flex-col gap-6 p-8 max-w-5xl mx-auto pb-20 bg-[#161616] min-h-screen">
      <div className="flex items-center justify-between pb-2">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded bg-[#b48600] flex items-center justify-center text-sm text-white font-medium">
            {activeWorkspace?.name.charAt(0).toUpperCase() || 'W'}
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-white flex items-center gap-2">
            Manage {activeWorkspace?.name || 'Workspace'} workspace
          </h1>
        </div>
        <Button variant="outline" className="border-white/10 text-foreground/50 bg-transparent hover:bg-transparent cursor-default rounded-md px-3 h-8 text-xs font-medium" disabled>
          <History className="w-3.5 h-3.5 mr-2 opacity-50" />
          Switch to this workspace
        </Button>
      </div>

      <Tabs defaultValue="team" className="w-full">
        <TabsList className="bg-transparent border-b border-white/5 rounded-none w-full justify-start h-auto p-0 mb-6 gap-6 overflow-x-auto">
          <TabsTrigger
            value="team"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#3b82f6] data-[state=active]:bg-transparent data-[state=active]:text-[#3b82f6] text-foreground/70 px-0 py-3 shadow-none font-medium whitespace-nowrap text-sm transition-colors"
          >
            Members
          </TabsTrigger>
          <TabsTrigger
            value="general"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#3b82f6] data-[state=active]:bg-transparent data-[state=active]:text-[#3b82f6] text-foreground/70 px-0 py-3 shadow-none font-medium whitespace-nowrap text-sm transition-colors"
          >
            Workspace settings
          </TabsTrigger>
          <TabsTrigger
            value="overview"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#3b82f6] data-[state=active]:bg-transparent data-[state=active]:text-[#3b82f6] text-foreground/70 px-0 py-3 shadow-none font-medium whitespace-nowrap text-sm transition-colors"
          >
            System Intelligence
          </TabsTrigger>
          <TabsTrigger
            value="env"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#3b82f6] data-[state=active]:bg-transparent data-[state=active]:text-[#3b82f6] text-foreground/70 px-0 py-3 shadow-none font-medium whitespace-nowrap text-sm transition-colors"
          >
            Environments
          </TabsTrigger>
          <TabsTrigger
            value="api-keys"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#3b82f6] data-[state=active]:bg-transparent data-[state=active]:text-[#3b82f6] text-foreground/70 px-0 py-3 shadow-none font-medium whitespace-nowrap text-sm transition-colors"
          >
            API Keys
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8 animate-in fade-in duration-500">
          {/* Global Metrics Section */}
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-5">
            <Card className="group bg-card/40 backdrop-blur-xl border-border hover:border-primary/50 transition-all duration-500 overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground group-hover:text-primary transition-colors">
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

            <Card className="group bg-card/40 backdrop-blur-xl border-border hover:border-blue-500/50 transition-all duration-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground group-hover:text-blue-500 transition-colors">
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

            <Card className="group bg-card/40 backdrop-blur-xl border-border hover:border-destructive/50 transition-all duration-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground group-hover:text-destructive transition-colors">
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

            <Card className="group bg-card/40 backdrop-blur-xl border-border hover:border-yellow-500/50 transition-all duration-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground group-hover:text-yellow-500 transition-colors">
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

            <Card className="group bg-card/40 backdrop-blur-xl border-border hover:border-green-500/50 transition-all duration-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground group-hover:text-green-500 transition-colors">
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
            <Card className="md:col-span-4 lg:col-span-6 bg-card border-border shadow-sm overflow-hidden">
              <CardHeader className="flex items-center justify-between flex-row border-b border-border pb-6 px-6 bg-muted/30">
                <div className="space-y-1">
                  <CardTitle className="text-lg font-bold tracking-tight flex items-center gap-2">
                    <Activity className="h-4 w-4 text-primary" />
                    Traffic Performance
                  </CardTitle>
                  <CardDescription className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    Latency Waveform (Last 50 Events)
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="h-[380px] p-6 pt-10">
                <AnalyticsCharts data={logs || []} />
              </CardContent>
            </Card>

            <Card className="md:col-span-3 lg:col-span-4 bg-card border-border shadow-sm overflow-hidden">
              <CardHeader className="border-b border-border bg-muted/30 pb-6">
                <div className="space-y-1">
                  <CardTitle className="text-lg font-bold tracking-tight flex items-center gap-2">
                    <History className="h-4 w-4 text-primary" />
                    Testing Sessions
                  </CardTitle>
                  <CardDescription className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    Real-time client request feed
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[380px]">
                  <div className="divide-y divide-border px-6">
                    {clientLogs.slice(0, 8).map((log) => (
                      <div key={log.id} className="flex items-center justify-between py-4 group hover:bg-accent/30 transition-colors rounded-lg -mx-2 px-2">
                        <div className="flex flex-col gap-1.5 overflow-hidden">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-tighter shadow-sm",
                              log.requestMethod === "GET" ? "bg-green-500/15 text-green-500" :
                                log.requestMethod === "POST" ? "bg-amber-500/15 text-amber-500" :
                                  log.requestMethod === "DELETE" ? "bg-red-500/15 text-red-500" :
                                    "bg-blue-500/15 text-blue-500"
                            )}>
                              {log.requestMethod}
                            </div>
                            <span className="text-xs font-medium truncate max-w-[120px] lg:max-w-[180px] text-foreground/80 group-hover:text-primary transition-colors">{log.requestUrl}</span>
                          </div>
                          <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-medium">
                            <span className="flex items-center gap-1"><Activity className="h-2.5 w-2.5" /> {log.latencyMs}ms</span>
                            <span className="opacity-30">•</span>
                            <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                          </div>
                        </div>
                        <Badge
                          variant={log.responseStatus < 400 ? "default" : "destructive"}
                          className={cn(
                            "text-[9px] font-bold h-5 px-1.5 rounded",
                            log.responseStatus < 400 ? "bg-green-500/15 text-green-500" : "bg-red-500/15 text-red-500"
                          )}
                        >
                          {log.responseStatus}
                        </Badge>
                      </div>
                    ))}
                    {clientLogs.length === 0 && (
                      <div className="py-20 text-center flex flex-col items-center justify-center text-muted-foreground/40">
                        <History className="h-12 w-12 mb-4 opacity-50" />
                        <p className="text-xs font-semibold uppercase tracking-widest">No recent testing data</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Global Activity Section */}
          <div className="grid gap-6">
            <Card className="bg-card border-border shadow-sm overflow-hidden mt-2">
              <CardHeader className="bg-muted/30 border-b border-border py-6 px-8">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg font-bold tracking-tight">Global Infrastructure Log</CardTitle>
                    <CardDescription className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                      Live feed of all gateway, proxy, and direct client traffic
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-ping" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-green-500">LIVE SYNC ACTIVE</span>
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
        </TabsContent>

        <TabsContent value="general" className="space-y-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Project Name</CardTitle>
              <CardDescription>The display name for your project in the dashboard.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <input
                  className="flex-1 bg-input/50 border border-border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none focus:border-primary/50"
                  defaultValue="My API Gateway"
                />
                <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-semibold hover:bg-primary/90 transition-colors">
                  Save
                </button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>User ID</CardTitle>
              <CardDescription>Unique identifier for your account.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-md border border-border/50 font-mono text-xs">
                <span>{user.id}</span>
                <button className="text-primary hover:text-primary/80 font-semibold transition-colors">Copy</button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team">
          <RbacManager workspaceId={activeWorkspace?.id || ''} />
        </TabsContent>

        <TabsContent value="env">
          <EnvVarsManager workspaceId={activeWorkspace?.id || ''} />
        </TabsContent>

        <TabsContent value="api-keys">
          <ApiKeysManager workspaceId={activeWorkspace?.id || ''} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
