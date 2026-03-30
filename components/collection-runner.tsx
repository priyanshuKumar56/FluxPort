"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { Play, Square, RotateCcw, CheckCircle, XCircle, Clock, FileText, Download } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useAppSelector } from "@/lib/store/hooks"

interface CollectionRunnerProps {
    collectionId?: string
    onClose?: () => void
}

interface TestResult {
    id: string
    requestId: string
    requestName: string
    method: string
    url: string
    status: "pending" | "running" | "passed" | "failed" | "skipped"
    duration: number
    responseStatus?: number
    assertions: AssertionResult[]
    error?: string
    variables?: Record<string, any>
}

interface AssertionResult {
    id: string
    name: string
    passed: boolean
    expected: string
    actual: string
    message?: string
}

export function CollectionRunner({ collectionId, onClose }: CollectionRunnerProps) {
    const { currentCollection } = useAppSelector((state) => state.collections)
    const [isRunning, setIsRunning] = useState(false)
    const [results, setResults] = useState<TestResult[]>([])
    const [selectedRequests, setSelectedRequests] = useState<Set<string>>(new Set())
    const [currentIndex, setCurrentIndex] = useState(0)
    const [delay, setDelay] = useState(0)
    const [stopOnFailure, setStopOnFailure] = useState(false)

    // Get all requests from collection
    const getAllRequests = useCallback(() => {
        if (!currentCollection) return []
        const requests = [...(currentCollection.requests || [])]
        currentCollection.folders?.forEach(folder => {
            if (folder.requests) {
                requests.push(...folder.requests)
            }
        })
        return requests
    }, [currentCollection])

    // Initialize selected requests
    const initializeSelection = useCallback(() => {
        const requests = getAllRequests()
        setSelectedRequests(new Set(requests.map(r => r.id)))
    }, [getAllRequests])

    // Toggle request selection
    const toggleRequest = (requestId: string) => {
        setSelectedRequests(prev => {
            const next = new Set(prev)
            if (next.has(requestId)) {
                next.delete(requestId)
            } else {
                next.add(requestId)
            }
            return next
        })
    }

    // Select/deselect all
    const toggleAll = () => {
        const requests = getAllRequests()
        if (selectedRequests.size === requests.length) {
            setSelectedRequests(new Set())
        } else {
            setSelectedRequests(new Set(requests.map(r => r.id)))
        }
    }

    // Run assertions on response
    const runAssertions = (response: any, request: any): AssertionResult[] => {
        const assertions: AssertionResult[] = []

        // Status code assertion
        assertions.push({
            id: "status",
            name: "Status code is 2xx",
            passed: response.status >= 200 && response.status < 300,
            expected: "2xx",
            actual: response.status.toString()
        })

        // Response time assertion
        assertions.push({
            id: "time",
            name: "Response time < 2000ms",
            passed: response.time < 2000,
            expected: "< 2000ms",
            actual: `${response.time}ms`
        })

        // JSON valid assertion
        if (response.headers?.["content-type"]?.includes("application/json")) {
            try {
                const body = typeof response.body === "string" ? JSON.parse(response.body) : response.body
                assertions.push({
                    id: "json",
                    name: "Valid JSON response",
                    passed: true,
                    expected: "valid JSON",
                    actual: "valid JSON"
                })
            } catch {
                assertions.push({
                    id: "json",
                    name: "Valid JSON response",
                    passed: false,
                    expected: "valid JSON",
                    actual: "invalid JSON"
                })
            }
        }

        return assertions
    }

    // Execute a single request
    const executeRequest = async (request: any): Promise<TestResult> => {
        const startTime = Date.now()

        try {
            const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
            const proxyHeaders: Record<string, string> = { "Content-Type": "application/json" }
            if (token) proxyHeaders["Authorization"] = `Bearer ${token}`

            const res = await fetch("/api/proxy", {
                method: "POST",
                headers: proxyHeaders,
                body: JSON.stringify({
                    url: request.url,
                    method: request.method,
                    headers: request.headers || {},
                    body: request.body
                }),
            })

            const duration = Date.now() - startTime

            let responseBody: any = null
            const contentType = res.headers.get("content-type")
            if (contentType?.includes("application/json")) {
                try {
                    responseBody = await res.json()
                } catch {
                    responseBody = await res.text()
                }
            } else {
                responseBody = await res.text()
            }

            const response = {
                status: res.status,
                time: duration,
                headers: Object.fromEntries(res.headers.entries()),
                body: responseBody
            }

            const assertions = runAssertions(response, request)
            const allPassed = assertions.every(a => a.passed)

            return {
                id: Date.now().toString(),
                requestId: request.id,
                requestName: request.name,
                method: request.method,
                url: request.url,
                status: allPassed ? "passed" : "failed",
                duration,
                responseStatus: res.status,
                assertions,
                variables: {}
            }
        } catch (error) {
            return {
                id: Date.now().toString(),
                requestId: request.id,
                requestName: request.name,
                method: request.method,
                url: request.url,
                status: "failed",
                duration: Date.now() - startTime,
                assertions: [],
                error: error instanceof Error ? error.message : "Unknown error"
            }
        }
    }

    // Run collection
    const runCollection = async () => {
        const requests = getAllRequests().filter(r => selectedRequests.has(r.id))

        if (requests.length === 0) {
            toast.error("No requests selected")
            return
        }

        setIsRunning(true)
        setResults([])
        setCurrentIndex(0)

        const newResults: TestResult[] = []

        for (let i = 0; i < requests.length; i++) {
            if (!isRunning) break // Check if stopped

            setCurrentIndex(i)
            const request = requests[i]

            // Add pending result
            const pendingResult: TestResult = {
                id: Date.now().toString() + i,
                requestId: request.id,
                requestName: request.name,
                method: request.method,
                url: request.url,
                status: "running",
                duration: 0,
                assertions: []
            }
            setResults(prev => [...prev, pendingResult])

            // Execute request
            const result = await executeRequest(request)
            newResults.push(result)

            // Update results
            setResults(prev => [...prev.slice(0, -1), result])

            // Check if we should stop on failure
            if (stopOnFailure && result.status === "failed") {
                toast.error(`Stopped due to failure in "${request.name}"`)
                break
            }

            // Delay between requests
            if (delay > 0 && i < requests.length - 1) {
                await new Promise(resolve => setTimeout(resolve, delay))
            }
        }

        setIsRunning(false)

        // Show summary
        const passed = newResults.filter(r => r.status === "passed").length
        const failed = newResults.filter(r => r.status === "failed").length
        toast.success(`Collection run complete: ${passed} passed, ${failed} failed`)
    }

    // Stop collection run
    const stopCollection = () => {
        setIsRunning(false)
        toast.info("Collection run stopped")
    }

    // Reset results
    const reset = () => {
        setResults([])
        setCurrentIndex(0)
        initializeSelection()
    }

    // Export results
    const exportResults = () => {
        const report = {
            timestamp: new Date().toISOString(),
            collection: currentCollection?.name,
            summary: {
                total: results.length,
                passed: results.filter(r => r.status === "passed").length,
                failed: results.filter(r => r.status === "failed").length,
                skipped: results.filter(r => r.status === "skipped").length
            },
            results
        }

        const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `collection-run-${Date.now()}.json`
        a.click()
        URL.revokeObjectURL(url)
        toast.success("Results exported")
    }

    const requests = getAllRequests()
    const passedCount = results.filter(r => r.status === "passed").length
    const failedCount = results.filter(r => r.status === "failed").length

    return (
        <div className="flex flex-col h-full bg-background">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
                <div>
                    <h2 className="text-lg font-semibold">Collection Runner</h2>
                    <p className="text-sm text-muted-foreground">
                        {currentCollection?.name || "No collection selected"}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {results.length > 0 && (
                        <>
                            <Badge variant="outline" className="gap-1">
                                <CheckCircle className="h-3 w-3 text-green-500" />
                                {passedCount}
                            </Badge>
                            <Badge variant="outline" className="gap-1">
                                <XCircle className="h-3 w-3 text-red-500" />
                                {failedCount}
                            </Badge>
                        </>
                    )}
                    {isRunning ? (
                        <Button variant="destructive" size="sm" onClick={stopCollection} className="gap-1">
                            <Square className="h-4 w-4" />
                            Stop
                        </Button>
                    ) : (
                        <Button
                            variant="default"
                            size="sm"
                            onClick={runCollection}
                            disabled={selectedRequests.size === 0}
                            className="gap-1"
                        >
                            <Play className="h-4 w-4" />
                            Run Collection
                        </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={reset} className="gap-1">
                        <RotateCcw className="h-4 w-4" />
                        Reset
                    </Button>
                    {results.length > 0 && (
                        <Button variant="outline" size="sm" onClick={exportResults} className="gap-1">
                            <Download className="h-4 w-4" />
                            Export
                        </Button>
                    )}
                </div>
            </div>

            {/* Configuration */}
            <div className="flex items-center gap-4 px-4 py-2 border-b border-border bg-muted/10">
                <div className="flex items-center gap-2">
                    <Checkbox
                        id="stopOnFailure"
                        checked={stopOnFailure}
                        onCheckedChange={(checked) => setStopOnFailure(checked as boolean)}
                    />
                    <label htmlFor="stopOnFailure" className="text-sm cursor-pointer">
                        Stop on failure
                    </label>
                </div>
                <div className="flex items-center gap-2">
                    <label className="text-sm">Delay:</label>
                    <input
                        type="number"
                        value={delay}
                        onChange={(e) => setDelay(parseInt(e.target.value) || 0)}
                        className="w-16 h-7 px-2 text-sm border rounded"
                        min={0}
                        max={10000}
                        step={100}
                    />
                    <span className="text-sm text-muted-foreground">ms</span>
                </div>
                <div className="flex items-center gap-2 ml-auto">
                    <Checkbox
                        id="selectAll"
                        checked={selectedRequests.size === requests.length && requests.length > 0}
                        onCheckedChange={toggleAll}
                    />
                    <label htmlFor="selectAll" className="text-sm cursor-pointer">
                        Select all ({selectedRequests.size}/{requests.length})
                    </label>
                </div>
            </div>

            {/* Request List */}
            <ScrollArea className="flex-1">
                <div className="p-4 space-y-2">
                    {requests.length === 0 ? (
                        <div className="text-center text-muted-foreground py-8">
                            <FileText className="h-12 w-12 mx-auto mb-2 opacity-20" />
                            <p>No requests in this collection</p>
                        </div>
                    ) : (
                        requests.map((request, index) => {
                            const result = results.find(r => r.requestId === request.id)
                            const isSelected = selectedRequests.has(request.id)

                            return (
                                <div
                                    key={request.id}
                                    className={cn(
                                        "flex items-center gap-3 p-3 rounded-lg border transition-colors",
                                        !isSelected && "opacity-50",
                                        result?.status === "passed" && "bg-green-50 border-green-200",
                                        result?.status === "failed" && "bg-red-50 border-red-200",
                                        result?.status === "running" && "bg-blue-50 border-blue-200",
                                        !result && "bg-card border-border"
                                    )}
                                >
                                    <Checkbox
                                        checked={isSelected}
                                        onCheckedChange={() => toggleRequest(request.id)}
                                        disabled={isRunning}
                                    />

                                    <span className="text-sm text-muted-foreground w-6">
                                        {index + 1}
                                    </span>

                                    <Badge
                                        variant={request.method === "GET" ? "default" : "secondary"}
                                        className="text-[10px] min-w-[50px] justify-center"
                                    >
                                        {request.method}
                                    </Badge>

                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{request.name}</p>
                                        <p className="text-xs text-muted-foreground truncate">{request.url}</p>
                                    </div>

                                    {result && (
                                        <div className="flex items-center gap-2">
                                            {result.status === "passed" && (
                                                <CheckCircle className="h-5 w-5 text-green-500" />
                                            )}
                                            {result.status === "failed" && (
                                                <XCircle className="h-5 w-5 text-red-500" />
                                            )}
                                            {result.status === "running" && (
                                                <div className="h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                            )}
                                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {result.duration}ms
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )
                        })
                    )}
                </div>
            </ScrollArea>

            {/* Results Summary */}
            {results.length > 0 && (
                <div className="p-4 border-t border-border bg-muted/10">
                    <div className="flex items-center justify-between text-sm">
                        <span>
                            Progress: {currentIndex + 1} / {selectedRequests.size}
                        </span>
                        <div className="flex items-center gap-4">
                            <span className="text-green-600">{passedCount} passed</span>
                            <span className="text-red-600">{failedCount} failed</span>
                            <span className="text-muted-foreground">
                                {results.reduce((acc, r) => acc + r.duration, 0)}ms total
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
