"use client"

import React from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { ShieldCheck } from "lucide-react"

export type AuthType = "none" | "bearer" | "basic" | "api-key"

interface AuthSectionProps {
    authType: AuthType
    setAuthType: (type: AuthType) => void
    authData: any
    setAuthData: (data: any) => void
}

export function AuthSection({ authType, setAuthType, authData, setAuthData }: AuthSectionProps) {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 border-b pb-4">
                <div className="text-xs font-semibold text-muted-foreground uppercase">Auth Type</div>
                <Select value={authType} onValueChange={(v: AuthType) => setAuthType(v)}>
                    <SelectTrigger className="w-[200px] h-8 text-xs">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="none">No Auth</SelectItem>
                        <SelectItem value="bearer">Bearer Token</SelectItem>
                        <SelectItem value="basic">Basic Auth</SelectItem>
                        <SelectItem value="api-key">API Key</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {authType === "bearer" && (
                <div className="space-y-4 max-w-md">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase text-muted-foreground">Token</label>
                        <Input
                            value={authData.token || ""}
                            onChange={(e) => setAuthData({ ...authData, token: e.target.value })}
                            placeholder="Paste your bearer token here"
                            className="font-mono text-xs"
                        />
                    </div>
                </div>
            )}

            {authType === "basic" && (
                <div className="space-y-4 max-w-md">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase text-muted-foreground">Username</label>
                            <Input
                                value={authData.username || ""}
                                onChange={(e) => setAuthData({ ...authData, username: e.target.value })}
                                className="text-xs"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase text-muted-foreground">Password</label>
                            <Input
                                type="password"
                                value={authData.password || ""}
                                onChange={(e) => setAuthData({ ...authData, password: e.target.value })}
                                className="text-xs"
                            />
                        </div>
                    </div>
                </div>
            )}

            {authType === "api-key" && (
                <div className="space-y-4 max-w-md">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase text-muted-foreground">Key</label>
                            <Input
                                value={authData.key || ""}
                                onChange={(e) => setAuthData({ ...authData, key: e.target.value })}
                                className="font-mono text-xs"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase text-muted-foreground">Header Name</label>
                            <Input
                                value={authData.headerName || "X-API-Key"}
                                onChange={(e) => setAuthData({ ...authData, headerName: e.target.value })}
                                placeholder="X-API-Key"
                                className="font-mono text-xs"
                            />
                        </div>
                    </div>
                </div>
            )}

            {authType === "none" && (
                <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground italic">
                    <ShieldCheck className="h-12 w-12 mb-2 opacity-20" />
                    <p className="text-sm">This request does not use any authorization.</p>
                </div>
            )}
        </div>
    )
}
