"use client"

import { useEffect } from "react"
import { RulesTable } from "@/components/rules-table"
import { CreateRuleDialog } from "@/components/create-rule-dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks"
import { fetchRules } from "@/lib/store/slices/rulesSlice"

export default function RulesPage() {
  const dispatch = useAppDispatch()
  const { rules, loading } = useAppSelector((state) => state.rules)
  const { activeWorkspaceId } = useAppSelector((state) => state.workspaces)

  useEffect(() => {
    const loadRules = async () => {
      if (!activeWorkspaceId) return
      try {
        await dispatch(fetchRules(activeWorkspaceId));
      } catch (error) {
        console.error('Failed to load rules:', error);
      }
    };
    loadRules();
  }, [dispatch, activeWorkspaceId])

  return (
    <div className="flex flex-col gap-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Interception Rules</h1>
          <p className="text-muted-foreground">Manage how your API requests are modified in real-time.</p>
        </div>
        <CreateRuleDialog>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" /> New Rule
          </Button>
        </CreateRuleDialog>
      </div>

      <div className="rounded-lg border bg-card shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">Loading rules...</div>
        ) : (
          <RulesTable rules={rules || []} />
        )}
      </div>
    </div>
  )
}
