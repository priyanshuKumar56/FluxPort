"use client"

import { useEffect, useState } from "react"
import { RulesTable } from "@/components/rules-table"
import { CreateRuleDialog } from "@/components/create-rule-dialog"
import { Button } from "@/components/ui/button"
import { Plus, Shield, ShieldCheck, Zap } from "lucide-react"
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks"
import { fetchRules } from "@/lib/store/slices/rulesSlice"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"


export default function RulesPage() {
  const dispatch = useAppDispatch()
  const { rules, loading } = useAppSelector((state) => state.rules)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const loadRules = async () => {
      try {
        await dispatch(fetchRules());
      } catch (error) {
        console.error('Failed to load rules:', error);
      }
    };
    loadRules();
  }, [dispatch])

  if (!isClient) return null

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-10 min-h-full">
      {/* Background Ambience */}
      <div className="fixed top-20 right-20 w-96 h-96 bg-primary/5 rounded-full blur-[128px] pointer-events-none -z-10" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black tracking-tighter text-gray-900">Interception Rules</h1>
            <ShieldCheck className="w-6 h-6 text-primary animate-pulse" />
          </div>
          <p className="text-muted-foreground font-medium max-w-lg text-sm">
            Control traffic flow, mock responses, and modify headers in real-time.
          </p>
        </div>
        <CreateRuleDialog>
          <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 font-semibold">
            <Plus className="mr-2 h-4 w-4" /> Create Rule
          </Button>
        </CreateRuleDialog>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="glass-card bg-white/60 border-gray-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Shield className="w-3 h-3" /> Active Rules
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black tracking-tight text-gray-900">
              {rules?.filter(r => r.isActive).length || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Currently enforcing</p>
          </CardContent>
        </Card>

        <Card className="glass-card bg-white/60 border-gray-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Zap className="w-3 h-3" /> Total Defined
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black tracking-tight text-gray-900">
              {rules?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Ready to deploy</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-xl bg-white/80 backdrop-blur-xl ring-1 ring-black/5 overflow-hidden">
        <CardHeader className="border-b border-gray-100/50 bg-gray-50/50 px-6 py-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-bold text-gray-800">Rule Configuration</CardTitle>
            <div className="flex gap-2">
              <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-mono text-muted-foreground uppercase">Sync Active</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-12 text-center flex flex-col items-center justify-center space-y-3">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-medium text-muted-foreground animate-pulse">Synchronizing rules...</p>
            </div>
          ) : (
            <RulesTable rules={rules || []} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
