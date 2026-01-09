"use client"

import React, { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    CheckCircle2,
    XCircle,
    Clock,
    Download,
    Copy,
    Check,
    Info,
    History,
    Send,
    Zap,
    Code2,
    Eye,
    FileJson
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
        <div className="h-full flex flex-col bg-card/40 backdrop-blur-sm border-t lg:border-t-0 lg:border-l border-border/50">
            <div className="flex items-center justify-between px-4 py-3 border-b text-xs bg-muted/30">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <span className="text-muted-foreground font-medium uppercase tracking-widest text-[10px]">Status</span>
                        <Badge
                            variant={response ? (response.status < 400 ? "default" : "destructive") : "outline"}
                            className={cn(
                                "font-bold px-2 py-0.5 rounded-md flex items-center gap-1.5 transition-all",
                                response?.status === 200 && "bg-green-500/10 text-green-500 border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.1)]",
                                response?.status >= 400 && "bg-red-500/10 text-red-500 border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]",
                            )}
                        >
                            {response ? (
                                <>
                                    {response.status < 400 ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                                    {response.status} {response.statusText}
                                </>
                            ) : "—"}
                        </Badge>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-muted-foreground font-medium uppercase tracking-widest text-[10px]">Time</span>
                        <div className="flex items-center gap-1.5 text-primary font-mono font-bold">
                            <Clock className="h-3 w-3 opacity-70" />
                            {response?.time !== undefined && response?.time !== null ? `${response.time} ms` : "0 ms"}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-muted-foreground font-medium uppercase tracking-widest text-[10px]">Size</span>
                        <div className="flex items-center gap-1.5 text-primary font-mono font-bold">
                            <Download className="h-3 w-3 opacity-70" />
                            {response?.size !== undefined && response?.size !== null ? `${(response.size / 1024).toFixed(2)} KB` : "0.00 KB"}
                        </div>
                    </div>

                    {(ruleApplied && ruleApplied !== 'none') && (
                        <div className="flex items-center gap-2 animate-pulse">
                            <Zap className="h-3 w-3 text-yellow-500 fill-yellow-500/20" />
                            <Badge variant="outline" className="text-[9px] border-yellow-500/30 text-yellow-600 bg-yellow-500/5">
                                INTERCEPTED
                            </Badge>
                        </div>
                    )}
                </div>

                {response && (
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-primary/10 transition-colors border-none"
                            onClick={() => copyToClipboard(typeof response.body === 'string' ? response.body : JSON.stringify(response.body, null, 2))}
                            title="Copy response body"
                        >
                            {isCopied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-primary/10 transition-colors border-none"
                            onClick={downloadResponse}
                            title="Download response"
                        >
                            <Download className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                )}
            </div>

            <Tabs defaultValue="body" className="flex-1 flex flex-col p-0 overflow-hidden">
                <div className="px-4 border-b bg-muted/10 flex items-center justify-between">
                    <TabsList className="bg-transparent h-10 gap-2 p-0">
                        <TabsTrigger
                            value="body"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary bg-transparent shadow-none px-4 text-[10px] font-bold uppercase tracking-widest transition-all"
                        >
                            Body
                        </TabsTrigger>
                        <TabsTrigger
                            value="headers"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary bg-transparent shadow-none px-4 text-[10px] font-bold uppercase tracking-widest transition-all"
                        >
                            Headers
                            {response?.headers && (
                                <Badge variant="secondary" className="ml-2 text-[9px] h-3.5 px-1 bg-primary/5 text-primary border-primary/10">
                                    {Object.keys(response.headers).length}
                                </Badge>
                            )}
                        </TabsTrigger>
                        <TabsTrigger
                            value="tests"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary bg-transparent shadow-none px-4 text-[10px] font-bold uppercase tracking-widest transition-all"
                        >
                            Tests
                            {assertions.length > 0 && (
                                <span
                                    className={cn(
                                        "ml-2 px-1.5 py-0.5 rounded-full text-[9px] font-bold",
                                        assertions.every((a) => a.passed)
                                            ? "bg-green-500/10 text-green-500 border border-green-500/20"
                                            : "bg-red-500/10 text-red-500 border border-red-500/20",
                                    )}
                                >
                                    {assertions.filter((a) => a.passed).length}/{assertions.length}
                                </span>
                            )}
                        </TabsTrigger>
                    </TabsList>

                    {response && (
                        <div className="flex bg-muted/30 p-0.5 rounded-lg border border-border/50 h-7 mr-2">
                            <button
                                onClick={() => setViewMode("pretty")}
                                className={cn("px-2 rounded-md text-[9px] font-bold transition-all flex items-center gap-1", viewMode === "pretty" ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground")}
                            >
                                <FileJson className="h-3 w-3" /> PRETTY
                            </button>
                            <button
                                onClick={() => setViewMode("raw")}
                                className={cn("px-2 rounded-md text-[9px] font-bold transition-all flex items-center gap-1", viewMode === "raw" ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground")}
                            >
                                <Code2 className="h-3 w-3" /> RAW
                            </button>
                            {isHtml && (
                                <button
                                    onClick={() => setViewMode("preview")}
                                    className={cn("px-2 rounded-md text-[9px] font-bold transition-all flex items-center gap-1", viewMode === "preview" ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground")}
                                >
                                    <Eye className="h-3 w-3" /> PREVIEW
                                </button>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex-1 overflow-hidden">
                    <ScrollArea className="h-full">
                        <TabsContent value="body" className="m-0 p-0 focus-visible:ring-0">
                            <div className="p-4 h-full">
                                {response ? (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        {/* Multi-layered Feedback */}
                                        {isMocked && (
                                            <div className="p-3 bg-blue-500/5 border border-blue-500/20 rounded-xl text-blue-500 text-[10px] flex items-center gap-2 font-bold uppercase tracking-tight">
                                                <Zap className="h-3.5 w-3.5 fill-blue-500/20" />
                                                Mocked Response Delivered via Interceptor Rule
                                            </div>
                                        )}

                                        {response.error && (
                                            <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl text-red-500 text-xs flex items-start gap-3 shadow-sm">
                                                <XCircle className="h-5 w-5 shrink-0 mt-0.5" />
                                                <div className="flex flex-col gap-2 flex-1">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="font-bold text-sm uppercase tracking-tight">Request Failed</span>
                                                        <span className="opacity-80 leading-relaxed">{response.error}</span>
                                                    </div>
                                                    {response.body && typeof response.body === 'object' && response.body.suggestion && (
                                                        <div className="pt-3 border-t border-red-500/10 text-red-400/90 flex items-start gap-2">
                                                            <Info className="h-4 w-4 shrink-0 mt-0.5" />
                                                            <span className="italic leading-relaxed">Tip: {response.body.suggestion}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        <div className="rounded-xl border border-border/50 bg-muted/20 shadow-inner relative overflow-hidden group">
                                            {viewMode === "preview" && isHtml ? (
                                                <iframe
                                                    srcDoc={typeof response.body === 'string' ? response.body : JSON.stringify(response.body)}
                                                    className="w-full h-[500px] bg-white rounded-xl"
                                                    title="HTML Preview"
                                                />
                                            ) : (
                                                <pre className="p-5 font-mono text-[13px] overflow-auto leading-6 max-h-[600px] text-foreground/90 custom-scrollbar whitespace-pre-wrap">
                                                    {viewMode === "pretty" ? formatBody(response.body) : (typeof response.body === 'string' ? response.body : JSON.stringify(response.body))}
                                                </pre>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-32 text-center text-muted-foreground/40 animate-pulse">
                                        <div className="p-6 rounded-3xl bg-muted/30 mb-6 group-hover:scale-110 transition-transform duration-500">
                                            <Send className="h-16 w-16 opacity-10" />
                                        </div>
                                        <h3 className="text-lg font-bold text-muted-foreground/60 mb-1 tracking-tight">System Idle</h3>
                                        <p className="text-sm max-w-[200px] leading-relaxed">Send a request to see the live response data here</p>
                                    </div>
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="headers" className="m-0 p-4 focus-visible:ring-0">
                            {response?.headers ? (
                                <div className="rounded-xl border border-border/50 bg-muted/20 overflow-hidden shadow-sm animate-in fade-in duration-300">
                                    <table className="w-full text-xs">
                                        <thead className="bg-muted/50 text-muted-foreground border-b border-border/50">
                                            <tr>
                                                <th className="px-4 py-3 text-left font-bold uppercase tracking-wider text-[10px]">Header Key</th>
                                                <th className="px-4 py-3 text-left font-bold uppercase tracking-wider text-[10px]">Value</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border/30">
                                            {Object.entries(response.headers).map(([key, value]) => (
                                                <tr key={key} className="hover:bg-primary/5 transition-colors group">
                                                    <td className="px-4 py-3 font-mono font-bold text-primary/70 bg-primary/2">{key}</td>
                                                    <td className="px-4 py-3 font-mono break-all text-foreground/80 leading-relaxed font-normal">{value as string}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground/40 border-2 border-dashed rounded-2xl">
                                    <History className="h-10 w-10 mb-3 opacity-10" />
                                    <p className="text-xs italic">No headers captured yet</p>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="tests" className="m-0 p-4 focus-visible:ring-0">
                            <div className="space-y-4 animate-in fade-in duration-300">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="rounded-full h-2 w-2 p-0 bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)] border-none" />
                                        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Verification Summary</h3>
                                    </div>
                                    {assertions.length > 0 && (
                                        <div className="text-[10px] font-mono font-bold bg-muted/50 px-2 py-1 rounded border border-border/50 shadow-sm">
                                            PASS RATE: {Math.round((assertions.filter((a) => a.passed).length / assertions.length) * 100)}%
                                        </div>
                                    )}
                                </div>

                                {assertions.length > 0 ? (
                                    <div className="space-y-3">
                                        {assertions.map((assertion) => (
                                            <div
                                                key={assertion.id}
                                                className={cn(
                                                    "flex items-center justify-between p-3 rounded-xl border transition-all duration-300",
                                                    assertion.passed
                                                        ? "bg-green-500/5 border-green-500/20 text-green-600 shadow-[0_2px_10px_rgba(34,197,94,0.05)]"
                                                        : "bg-red-500/5 border-red-500/20 text-red-600 shadow-[0_2px_10px_rgba(239,68,68,0.05)]",
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    {assertion.passed ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                                                    <span className="text-xs font-bold tracking-tight">{assertion.type}</span>
                                                </div>
                                                <Badge
                                                    variant={assertion.passed ? "default" : "destructive"}
                                                    className={cn(
                                                        "text-[9px] font-black uppercase px-2 py-0.5 rounded-md",
                                                        assertion.passed ? "bg-green-500 text-white" : "bg-red-500 text-white",
                                                    )}
                                                >
                                                    {assertion.passed ? "Passed" : "Failed"}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground/40 border-2 border-dashed rounded-2xl">
                                        <History className="h-10 w-10 mb-3 opacity-10" />
                                        <p className="text-xs italic">Run a request to see test results</p>
                                    </div>
                                )}
                            </div>
                        </TabsContent>
                    </ScrollArea>
                </div>
            </Tabs>
        </div>
    )
}
