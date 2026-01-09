"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Lock, Eye, EyeOff, Plus, Trash2, Globe } from "lucide-react"

export function EnvVarsManager({ organizationId }: { organizationId: string }) {
  const [vars, setVars] = useState([
    { id: "1", key: "DATABASE_URL", value: "postgresql://user:pass@host:5432/db", hidden: true, env: "Production" },
    { id: "2", key: "STRIPE_SECRET", value: "sk_test_51Mz...", hidden: true, env: "Staging" },
  ])

  const toggleVisibility = (id: string) => {
    setVars(vars.map((v) => (v.id === id ? { ...v, hidden: !v.hidden } : v)))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Environment Variables</CardTitle>
            <CardDescription>Encrypted key-value pairs for your proxy rules and automated tests.</CardDescription>
          </div>
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" /> Add Variable
          </Button>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          {vars.map((v) => (
            <div
              key={v.id}
              className="group flex flex-col gap-2 p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="bg-background font-mono text-[10px]">
                    {v.env}
                  </Badge>
                  <code className="text-sm font-bold">{v.key}</code>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon-sm" onClick={() => toggleVisibility(v.id)}>
                    {v.hidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="icon-sm" className="text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="relative">
                <Input
                  type={v.hidden ? "password" : "text"}
                  value={v.value}
                  readOnly
                  className="bg-background font-mono text-xs pr-10 border-dashed"
                />
                <Lock className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground opacity-50" />
              </div>
            </div>
          ))}

          <div className="flex items-center gap-2 p-4 rounded-lg border border-dashed text-muted-foreground justify-center text-sm cursor-pointer hover:bg-muted/30 transition-colors">
            <Plus className="h-4 w-4" />
            Define a new environment variable
          </div>
        </CardContent>
      </Card>

      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4 flex items-center gap-4 text-sm">
          <Globe className="h-5 w-5 text-primary" />
          <p className="flex-1">
            Environment variables are securely encrypted at rest. You can reference them in your rules using
            <code className="bg-primary/10 px-1 rounded mx-1">{"{{ VARIABLE_NAME }}"}</code> syntax.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
