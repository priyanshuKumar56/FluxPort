"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"

export function CreateMockServerDialog() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" /> New Mock Server
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Mock Server</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Server Name</label>
            <Input placeholder="e.g. Payments Mock" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Base Path</label>
            <Input placeholder="/api/v1" />
          </div>
          <Button className="w-full" onClick={() => setIsOpen(false)}>
            Create Server
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
