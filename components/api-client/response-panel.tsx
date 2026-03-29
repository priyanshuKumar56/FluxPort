"use client"

import React, { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  CheckCircle2, XCircle, Clock, Download, Copy, Check,
  Info, Send, Zap, Code2, Eye, FileJson, ExternalLink
} from "lucide-react"
import { cn } from "@/lib/utils"

interface ResponsePanelProps {
  response: any
  isCopied: boolean
  copyToClipboard: (text: string) => void
  downloadResponse: () => void
  assertions: any[]
}

export function ResponsePanel({
  response,
  isCopied,
  copyToClipboard,
  downloadResponse,
  assertions
}: ResponsePanelProps) {
  const [viewMode, setViewMode] = useState<"pretty" | "raw" | "preview">("pretty")

  const ruleApplied = response?.headers?.['x-fluxport-rule-applied']
  const isMocked = response?.headers?.['x-fluxport-intercepted'] === 'MOCK'
  const isHtml = response?.headers?.['content-type']?.includes('text/html')

  const formatBody = (body: any) => {
    if (typeof body === 'string') {
      try {
        return JSON.stringify(JSON.parse(body), null, 2)
      } catch (e) {
        return body
      }
    }
    return JSON.stringify(body, null, 2)
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Response status bar */}
      {response && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-border text-xs bg-muted/10">
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground/60 text-[10px] font-medium">Status</span>
              <Badge
                variant={response.status < 400 ? "default" : "destructive"}
                className={cn(
                  "font-bold px-1.5 py-0 text-[10px] rounded",
                  response.status < 400
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                    : "bg-red-500/15 text-red-400 border border-red-500/20"
                )}
              >
                {response.status} {response.statusText}
              </Badge>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-3 w-3 text-muted-foreground/50" />
              <span className="font-mono text-muted-foreground">{response.time}ms</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Download className="h-3 w-3 text-muted-foreground/50" />
              <span className="font-mono text-muted-foreground">{(response.size / 1024).toFixed(2)} KB</span>
            </div>
            {(ruleApplied && ruleApplied !== 'none') && (
              <Badge variant="outline" className="text-[9px] border-amber-500/30 text-amber-400 bg-amber-500/5">
                <Zap className="h-2.5 w-2.5 mr-1" /> INTERCEPTED
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
              onClick={() => copyToClipboard(typeof response.body === 'string' ? response.body : JSON.stringify(response.body, null, 2))}
            >
              {isCopied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
              onClick={downloadResponse}
            >
              <Download className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="body" className="flex-1 flex flex-col overflow-hidden">
        <div className="px-3 border-b border-border bg-muted/10 flex items-center justify-between">
          <TabsList className="bg-transparent h-9 gap-1 p-0">
            <TabsTrigger
              value="body"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary bg-transparent shadow-none px-3 text-xs font-medium"
            >
              Body
            </TabsTrigger>
            <TabsTrigger
              value="headers"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary bg-transparent shadow-none px-3 text-xs font-medium"
            >
              Headers
              {response?.headers && (
                <Badge variant="secondary" className="ml-1.5 text-[9px] h-4 px-1 bg-accent">
                  {Object.keys(response.headers).length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="tests"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary bg-transparent shadow-none px-3 text-xs font-medium"
            >
              Tests
              {assertions.length > 0 && (
                <span className={cn(
                  "ml-1.5 px-1 py-0.5 rounded text-[9px] font-bold",
                  assertions.every(a => a.passed)
                    ? "bg-emerald-500/15 text-emerald-400"
                    : "bg-red-500/15 text-red-400"
                )}>
                  {assertions.filter(a => a.passed).length}/{assertions.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {response && (
            <div className="flex bg-accent/40 p-0.5 rounded border border-border/50 h-6">
              <button
                onClick={() => setViewMode("pretty")}
                className={cn(
                  "px-2 rounded text-[9px] font-medium transition-all flex items-center gap-1",
                  viewMode === "pretty"
                    ? "bg-background shadow-sm text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <FileJson className="h-2.5 w-2.5" /> Pretty
              </button>
              <button
                onClick={() => setViewMode("raw")}
                className={cn(
                  "px-2 rounded text-[9px] font-medium transition-all flex items-center gap-1",
                  viewMode === "raw"
                    ? "bg-background shadow-sm text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Code2 className="h-2.5 w-2.5" /> Raw
              </button>
              {isHtml && (
                <button
                  onClick={() => setViewMode("preview")}
                  className={cn(
                    "px-2 rounded text-[9px] font-medium transition-all flex items-center gap-1",
                    viewMode === "preview"
                      ? "bg-background shadow-sm text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Eye className="h-2.5 w-2.5" /> Preview
                </button>
              )}
            </div>
          )}
        </div>

        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <TabsContent value="body" className="m-0 p-0 focus-visible:ring-0">
              {response ? (
                <div className="p-4 space-y-3">
                  {isMocked && (
                    <div className="p-2.5 bg-blue-500/5 border border-blue-500/20 rounded-lg text-blue-400 text-[10px] flex items-center gap-2 font-semibold">
                      <Zap className="h-3 w-3" />
                      Mocked Response via Interceptor Rule
                    </div>
                  )}

                  {response.error && (
                    <div className="p-3 bg-red-500/5 border border-red-500/20 rounded-lg text-red-400 text-xs flex items-start gap-2">
                      <XCircle className="h-4 w-4 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-sm">Request Failed</span>
                        <p className="mt-1 opacity-80">{response.error}</p>
                      </div>
                    </div>
                  )}

                  <div className="rounded-lg border border-border bg-muted/10 overflow-hidden">
                    {viewMode === "preview" && isHtml ? (
                      <iframe
                        srcDoc={typeof response.body === 'string' ? response.body : JSON.stringify(response.body)}
                        className="w-full h-[500px] bg-white rounded-lg"
                        title="HTML Preview"
                      />
                    ) : (
                      <pre className="p-4 font-mono text-xs overflow-auto leading-relaxed max-h-[600px] text-foreground/90 custom-scrollbar whitespace-pre-wrap">
                        {viewMode === "pretty"
                          ? formatBody(response.body)
                          : typeof response.body === 'string'
                            ? response.body
                            : JSON.stringify(response.body)
                        }
                      </pre>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-20 h-20 rounded-2xl bg-muted/30 flex items-center justify-center mb-4">
                    <Send className="w-10 h-10 text-muted-foreground/15" />
                  </div>
                  <h3 className="text-sm font-semibold text-muted-foreground/60 mb-1">Nothing to see here!</h3>
                  <p className="text-xs text-muted-foreground/40 mb-6">Please run a request to see the response</p>
                  <div className="space-y-2 text-xs text-muted-foreground/40">
                    <div className="flex items-center gap-3">
                      <span>Save request</span>
                      <span><span className="kbd">Ctrl</span> <span className="kbd">S</span></span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span>Send request</span>
                      <span><span className="kbd">Ctrl</span> <span className="kbd">↵</span></span>
                    </div>
                  </div>
                  <a href="#" className="mt-6 text-xs text-primary/60 hover:text-primary flex items-center gap-1 transition-colors">
                    Read documentation <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </TabsContent>

            <TabsContent value="headers" className="m-0 p-4 focus-visible:ring-0">
              {response?.headers ? (
                <div className="rounded-lg border border-border overflow-hidden">
                  <table className="w-full text-xs">
                    <thead className="bg-muted/30 border-b border-border">
                      <tr>
                        <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Key</th>
                        <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {Object.entries(response.headers).map(([key, value]) => (
                        <tr key={key} className="hover:bg-accent/20 transition-colors">
                          <td className="px-3 py-2 font-mono font-semibold text-primary/70">{key}</td>
                          <td className="px-3 py-2 font-mono break-all text-foreground/70">{value as string}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground/40">
                  <p className="text-xs">No headers captured yet</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="tests" className="m-0 p-4 focus-visible:ring-0">
              {assertions.length > 0 ? (
                <div className="space-y-2">
                  {assertions.map((assertion) => (
                    <div
                      key={assertion.id}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-lg border transition-all",
                        assertion.passed
                          ? "bg-emerald-500/5 border-emerald-500/20"
                          : "bg-red-500/5 border-red-500/20"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        {assertion.passed
                          ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                          : <XCircle className="h-3.5 w-3.5 text-red-400" />
                        }
                        <span className="text-xs font-medium">{assertion.type}</span>
                      </div>
                      <Badge
                        className={cn(
                          "text-[9px] font-bold px-2 rounded",
                          assertion.passed
                            ? "bg-emerald-500 text-white"
                            : "bg-red-500 text-white"
                        )}
                      >
                        {assertion.passed ? "Passed" : "Failed"}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground/40">
                  <p className="text-xs">Run a request to see test results</p>
                </div>
              )}
            </TabsContent>
          </ScrollArea>
        </div>
      </Tabs>
    </div>
  )
}
