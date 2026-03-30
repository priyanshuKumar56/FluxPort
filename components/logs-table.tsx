"use client"

import { useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks"
import { fetchLogs } from "@/lib/store/slices/logsSlice"
import { formatDistanceToNow } from "date-fns"

export function LogsTable() {
  const dispatch = useAppDispatch()
  const { logs, loading } = useAppSelector((state) => state.logs)
  const { activeWorkspaceId } = useAppSelector((state) => state.workspaces)

  useEffect(() => {
    dispatch(fetchLogs({ limit: 50, workspaceId: activeWorkspaceId || undefined }))
    
    // Poll for updates every 5 seconds
    const interval = setInterval(() => {
      dispatch(fetchLogs({ limit: 50, workspaceId: activeWorkspaceId || undefined }))
    }, 5000)

    return () => clearInterval(interval)
  }, [dispatch, activeWorkspaceId])

  if (loading && logs.length === 0) {
    return <div className="text-sm text-muted-foreground animate-pulse">Loading real-time logs...</div>
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Method</TableHead>
            <TableHead>URL</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Latency</TableHead>
            <TableHead>Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                No logs recorded yet. Start testing in the API Client!
              </TableCell>
            </TableRow>
          ) : (
            logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>
                  <Badge variant="outline" className="font-mono text-[10px] uppercase">
                    {log.requestMethod}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono text-xs max-w-[300px] truncate">{log.requestUrl}</TableCell>
                <TableCell>
                  <Badge
                    className={
                      log.responseStatus < 400
                        ? "bg-green-500/10 text-green-500 border-green-500/20"
                        : "bg-red-500/10 text-red-500 border-red-500/20"
                    }
                  >
                    {log.responseStatus}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono text-xs">{log.latencyMs}ms</TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
