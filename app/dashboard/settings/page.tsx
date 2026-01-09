"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RbacManager } from "@/components/rbac-manager"
import { EnvVarsManager } from "@/components/env-vars-manager"
import { ApiKeysManager } from "@/components/api-keys-manager"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAppSelector } from "@/lib/store/hooks"

export default function SettingsPage() {
  const { user } = useAppSelector((state) => state.auth)

  if (!user) return null

  return (
    <div className="flex flex-col gap-8 p-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Project Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your team, environment variables, and programmatic access.</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="bg-transparent border-b rounded-none w-full justify-start h-auto p-0 mb-8 gap-8">
          <TabsTrigger
            value="general"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-2 shadow-none font-medium"
          >
            General
          </TabsTrigger>
          <TabsTrigger
            value="team"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-2 shadow-none font-medium"
          >
            Team Members
          </TabsTrigger>
          <TabsTrigger
            value="env"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-2 shadow-none font-medium"
          >
            Environments
          </TabsTrigger>
          <TabsTrigger
            value="api-keys"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-2 shadow-none font-medium"
          >
            API Keys
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Name</CardTitle>
              <CardDescription>The display name for your project in the dashboard.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <input
                  className="flex-1 bg-background border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                  defaultValue="My API Gateway"
                />
                <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity">
                  Save
                </button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>User ID</CardTitle>
              <CardDescription>Unique identifier for your account.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md border font-mono text-xs">
                <span>{user.id}</span>
                <button className="text-primary hover:underline">Copy</button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team">
          <RbacManager organizationId={user.id} />
        </TabsContent>

        <TabsContent value="env">
          <EnvVarsManager organizationId={user.id} />
        </TabsContent>

        <TabsContent value="api-keys">
          <ApiKeysManager organizationId={user.id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
