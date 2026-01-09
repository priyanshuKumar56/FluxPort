"use client"

import { Area, AreaChart, Tooltip, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

export function AnalyticsCharts({ data }: { data: any[] }) {
  // Process data for the chart (grouping by time)
  const chartData = data
    .slice(0, 50)
    .reverse()
    .map((log) => ({
      time: new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      latency: log.latencyMs || log.latency_ms || 0,
      throughput: 1, // Mock value for throughput
    }))

  return (
    <div className="h-full w-full bg-card/20 backdrop-blur-sm rounded-xl p-4 border border-border/50 shadow-inner">
      <ChartContainer
        config={{
          latency: {
            label: "Latency (ms)",
            color: "hsl(var(--primary))",
          },
        }}
        className="h-full w-full"
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground) / 0.1)" />
            <XAxis
              dataKey="time"
              stroke="hsl(var(--muted-foreground))"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              minTickGap={40}
              dy={10}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}ms`}
              dx={-5}
            />
            <Tooltip
              content={<ChartTooltipContent className="bg-background/90 backdrop-blur-sm border-primary/20" />}
              cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '4 4' }}
            />
            <Area
              type="monotone"
              dataKey="latency"
              stroke="hsl(var(--primary))"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorLatency)"
              animationDuration={1500}
              activeDot={{ r: 5, strokeWidth: 0, className: "shadow-2xl fill-primary" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  )
}
