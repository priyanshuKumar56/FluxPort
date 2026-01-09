"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export function RecentLogsTable({ logs }: { logs: any[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="text-[10px] uppercase">Path</TableHead>
          <TableHead className="text-[10px] uppercase">Status</TableHead>
          <TableHead className="text-[10px] uppercase text-right">Time</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {logs.map((log, i) => (
          <TableRow key={i} className="group">
            <TableCell className="max-w-[150px] truncate font-mono text-[11px]">
              {new URL(log.request_url || log.requestUrl).pathname}
            </TableCell>
            <TableCell>
              <Badge
                variant={(log.response_status || log.responseStatus) < 400 ? "outline" : "destructive"}
                className={`text-[9px] px-1.5 py-0 ${(log.response_status || log.responseStatus) < 400 ? "text-green-500 border-green-500/30" : ""}`}
              >
                {log.response_status || log.responseStatus}
              </Badge>
            </TableCell>
            <TableCell className="text-right font-mono text-[11px] text-muted-foreground">{log.latency_ms || log.latencyMs}ms</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
