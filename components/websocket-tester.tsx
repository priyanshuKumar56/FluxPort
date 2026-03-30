"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Send, Play, Square, Trash2, Clock, Wifi, WifiOff, MessageSquare } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface WebSocketMessage {
    id: string
    type: "sent" | "received" | "system"
    content: string
    timestamp: Date
    isBinary?: boolean
}

interface WebSocketTesterProps {
    initialUrl?: string
}

export function WebSocketTester({ initialUrl }: WebSocketTesterProps) {
    const [url, setUrl] = useState(initialUrl || "")
    const [connectionStatus, setConnectionStatus] = useState<"disconnected" | "connecting" | "connected" | "error">("disconnected")
    const [messages, setMessages] = useState<WebSocketMessage[]>([])
    const [inputMessage, setInputMessage] = useState("")
    const [protocols, setProtocols] = useState("")
    const [headers, setHeaders] = useState("")
    const wsRef = useRef<WebSocket | null>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    const connect = useCallback(() => {
        if (!url) {
            toast.error("Please enter a WebSocket URL")
            return
        }

        // Close existing connection
        if (wsRef.current) {
            wsRef.current.close()
        }

        setConnectionStatus("connecting")
        setMessages(prev => [...prev, {
            id: Date.now().toString(),
            type: "system",
            content: `Connecting to ${url}...`,
            timestamp: new Date()
        }])

        try {
            const protocolList = protocols.split(",").map(p => p.trim()).filter(Boolean)
            const ws = protocolList.length > 0
                ? new WebSocket(url, protocolList)
                : new WebSocket(url)

            ws.onopen = () => {
                setConnectionStatus("connected")
                setMessages(prev => [...prev, {
                    id: Date.now().toString(),
                    type: "system",
                    content: "Connected successfully",
                    timestamp: new Date()
                }])
                toast.success("WebSocket connected")
            }

            ws.onmessage = (event) => {
                const isBinary = event.data instanceof Blob || event.data instanceof ArrayBuffer
                setMessages(prev => [...prev, {
                    id: Date.now().toString(),
                    type: "received",
                    content: isBinary ? "[Binary data]" : event.data,
                    timestamp: new Date(),
                    isBinary
                }])
            }

            ws.onerror = (error) => {
                setConnectionStatus("error")
                setMessages(prev => [...prev, {
                    id: Date.now().toString(),
                    type: "system",
                    content: "Connection error occurred",
                    timestamp: new Date()
                }])
                toast.error("WebSocket error")
            }

            ws.onclose = (event) => {
                setConnectionStatus("disconnected")
                setMessages(prev => [...prev, {
                    id: Date.now().toString(),
                    type: "system",
                    content: `Connection closed (code: ${event.code}, reason: ${event.reason || "No reason"})`,
                    timestamp: new Date()
                }])
            }

            wsRef.current = ws
        } catch (error) {
            setConnectionStatus("error")
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                type: "system",
                content: `Failed to connect: ${error instanceof Error ? error.message : "Unknown error"}`,
                timestamp: new Date()
            }])
            toast.error("Failed to create WebSocket connection")
        }
    }, [url, protocols])

    const disconnect = useCallback(() => {
        if (wsRef.current) {
            wsRef.current.close()
            wsRef.current = null
        }
    }, [])

    const sendMessage = useCallback(() => {
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
            toast.error("WebSocket is not connected")
            return
        }

        if (!inputMessage.trim()) {
            toast.error("Please enter a message")
            return
        }

        try {
            wsRef.current.send(inputMessage)
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                type: "sent",
                content: inputMessage,
                timestamp: new Date()
            }])
            setInputMessage("")
        } catch (error) {
            toast.error("Failed to send message")
        }
    }, [inputMessage])

    const clearMessages = () => {
        setMessages([])
    }

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString("en-US", {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        })
    }

    const getStatusColor = () => {
        switch (connectionStatus) {
            case "connected": return "bg-green-500"
            case "connecting": return "bg-yellow-500"
            case "error": return "bg-red-500"
            default: return "bg-gray-400"
        }
    }

    const getStatusIcon = () => {
        switch (connectionStatus) {
            case "connected": return <Wifi className="h-4 w-4 text-green-500" />
            case "connecting": return <Wifi className="h-4 w-4 text-yellow-500 animate-pulse" />
            case "error": return <WifiOff className="h-4 w-4 text-red-500" />
            default: return <WifiOff className="h-4 w-4 text-gray-400" />
        }
    }

    return (
        <div className="flex flex-col h-full bg-background">
            {/* Connection Bar */}
            <div className="flex items-center gap-2 p-3 border-b border-border bg-muted/10">
                <div className="flex items-center gap-2 flex-1">
                    <div className={cn("w-2 h-2 rounded-full", getStatusColor())} />
                    {getStatusIcon()}
                    <Input
                        placeholder="ws://localhost:8080 or wss://echo.websocket.org"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="flex-1 font-mono text-sm"
                        disabled={connectionStatus === "connected" || connectionStatus === "connecting"}
                    />
                </div>

                {connectionStatus === "connected" ? (
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={disconnect}
                        className="gap-1"
                    >
                        <Square className="h-4 w-4" />
                        Disconnect
                    </Button>
                ) : (
                    <Button
                        variant="default"
                        size="sm"
                        onClick={connect}
                        disabled={connectionStatus === "connecting"}
                        className="gap-1"
                    >
                        <Play className="h-4 w-4" />
                        {connectionStatus === "connecting" ? "Connecting..." : "Connect"}
                    </Button>
                )}

                <Button
                    variant="outline"
                    size="sm"
                    onClick={clearMessages}
                    className="gap-1"
                >
                    <Trash2 className="h-4 w-4" />
                    Clear
                </Button>
            </div>

            {/* Configuration Tabs */}
            <Tabs defaultValue="messages" className="flex-1 flex flex-col">
                <div className="px-3 border-b border-border">
                    <TabsList className="bg-transparent h-9">
                        <TabsTrigger value="messages" className="text-xs">
                            <MessageSquare className="h-3 w-3 mr-1" />
                            Messages ({messages.length})
                        </TabsTrigger>
                        <TabsTrigger value="settings" className="text-xs">
                            Settings
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="messages" className="flex-1 flex flex-col m-0 p-0">
                    {/* Messages Area */}
                    <ScrollArea className="flex-1 p-4">
                        <div className="space-y-2">
                            {messages.length === 0 ? (
                                <div className="text-center text-muted-foreground py-8">
                                    <Wifi className="h-12 w-12 mx-auto mb-2 opacity-20" />
                                    <p className="text-sm">No messages yet</p>
                                    <p className="text-xs">Connect to a WebSocket server to start messaging</p>
                                </div>
                            ) : (
                                messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={cn(
                                            "p-3 rounded-lg text-sm",
                                            msg.type === "sent" && "bg-primary/10 ml-8",
                                            msg.type === "received" && "bg-muted mr-8",
                                            msg.type === "system" && "bg-yellow-50 text-yellow-800 text-center text-xs"
                                        )}
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <Badge
                                                variant={msg.type === "sent" ? "default" : msg.type === "received" ? "secondary" : "outline"}
                                                className="text-[9px] h-4"
                                            >
                                                {msg.type.toUpperCase()}
                                            </Badge>
                                            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {formatTime(msg.timestamp)}
                                            </span>
                                            {msg.isBinary && (
                                                <Badge variant="outline" className="text-[9px] h-4">Binary</Badge>
                                            )}
                                        </div>
                                        <pre className="whitespace-pre-wrap break-all font-mono text-xs">
                                            {msg.content}
                                        </pre>
                                    </div>
                                ))
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    </ScrollArea>

                    {/* Input Area */}
                    <div className="p-3 border-t border-border bg-muted/10">
                        <div className="flex gap-2">
                            <Input
                                placeholder="Type a message..."
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault()
                                        sendMessage()
                                    }
                                }}
                                disabled={connectionStatus !== "connected"}
                                className="flex-1"
                            />
                            <Button
                                onClick={sendMessage}
                                disabled={connectionStatus !== "connected" || !inputMessage.trim()}
                                className="gap-1"
                            >
                                <Send className="h-4 w-4" />
                                Send
                            </Button>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="settings" className="flex-1 p-4 m-0">
                    <div className="space-y-4 max-w-md">
                        <div>
                            <label className="text-sm font-medium mb-1 block">Subprotocols</label>
                            <Input
                                placeholder="protocol1, protocol2 (comma separated)"
                                value={protocols}
                                onChange={(e) => setProtocols(e.target.value)}
                                disabled={connectionStatus === "connected"}
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                Optional subprotocols to negotiate with the server
                            </p>
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-1 block">Custom Headers</label>
                            <textarea
                                placeholder={`{"Authorization": "Bearer token"}`}
                                value={headers}
                                onChange={(e) => setHeaders(e.target.value)}
                                disabled={connectionStatus === "connected"}
                                className="w-full h-24 p-2 text-sm font-mono bg-muted rounded-md border border-border focus:outline-none focus:border-primary"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                Note: Custom headers are not supported in browser WebSocket API
                            </p>
                        </div>

                        <div className="pt-4 border-t border-border">
                            <h4 className="text-sm font-medium mb-2">Connection Info</h4>
                            <div className="space-y-1 text-xs text-muted-foreground">
                                <p>Status: <span className="text-foreground capitalize">{connectionStatus}</span></p>
                                <p>Ready State: <span className="text-foreground">
                                    {wsRef.current ? ["Connecting", "Open", "Closing", "Closed"][wsRef.current.readyState] : "N/A"}
                                </span></p>
                                <p>Protocol: <span className="text-foreground">{wsRef.current?.protocol || "N/A"}</span></p>
                                <p>Extensions: <span className="text-foreground">{wsRef.current?.extensions || "N/A"}</span></p>
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
