"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { MockServerList } from "@/components/mock-server-list"
import { CreateMockServerDialog } from "@/components/create-mock-server-dialog"
import { useAppSelector } from "@/lib/store/hooks"

export default function MocksPage() {
  const { user } = useAppSelector((state) => state.auth)

  if (!user) {
    return null
  }

  return (
    <div className="flex flex-col gap-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mock Servers</h1>
          <p className="text-muted-foreground">Create and manage mock API endpoints for testing without a backend.</p>
        </div>
        <CreateMockServerDialog>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" /> New Mock Server
          </Button>
        </CreateMockServerDialog>
      </div>

      <div className="rounded-lg border bg-card shadow-sm">
        <MockServerList mockServers={[]} />
      </div>
    </div>
  )
}
