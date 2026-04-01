import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
   FolderTree,
   Plus,
   Workflow,
   Users,
   ArrowRight,
   Database,
   LayoutDashboard,
   Box,
   Target,
   FileCheck,
   Globe
} from "lucide-react"

export default function CollectionsPage() {
   return (
      <div className="space-y-12 animate-in fade-in duration-700">
         <section className="space-y-4">
            <Badge className="bg-indigo-600 text-white">Documentation / Features</Badge>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Collections & Hierarchy</h1>
            <p className="text-xl text-muted-foreground max-w-[800px]">
               Organize your API development workflow with nested collections, rule-based folders, and isolated environment management.
            </p>
         </section>

         {/* Structured Organization Card */}
         <section className="grid lg:grid-cols-2 gap-10 border-b pb-12">
            <div className="space-y-6">
               <h2 className="text-3xl font-bold tracking-tight">Structured Hierarchy</h2>
               <p className="text-muted-foreground">
                  FluxPort introduces a three-tier organization system designed for high-velocity teams. Requests are never just floating; they belong to a logical structure.
               </p>
               <div className="space-y-4">
                  <div className="flex gap-4 items-start p-4 rounded-xl hover:bg-muted/30 transition-colors border-l-4 border-indigo-500">
                     <Box className="h-6 w-6 text-indigo-500 shrink-0" />
                     <div>
                        <h4 className="font-bold">Collections</h4>
                        <p className="text-sm text-muted-foreground">The root unit. Shared across a workspace and containing all folders and endpoints for a specific project.</p>
                     </div>
                  </div>
                  <div className="flex gap-4 items-start p-4 rounded-xl hover:bg-muted/30 transition-colors border-l-4 border-blue-400">
                     <FolderTree className="h-6 w-6 text-blue-400 shrink-0" />
                     <div>
                        <h4 className="font-bold">Nested Folders</h4>
                        <p className="text-sm text-muted-foreground">Deeply nest endpoints for better modular grouping (e.g., Auth, Payments, Users).</p>
                     </div>
                  </div>
                  <div className="flex gap-4 items-start p-4 rounded-xl hover:bg-muted/30 transition-colors border-l-4 border-emerald-400">
                     <Database className="h-6 w-6 text-emerald-400 shrink-0" />
                     <div>
                        <h4 className="font-bold">Saved Requests</h4>
                        <p className="text-sm text-muted-foreground">The final unit containing the full request configuration, history, and test expectations.</p>
                     </div>
                  </div>
               </div>
            </div>

            <aside className="relative flex items-center justify-center p-8 bg-muted/20 border-2 border-dashed border-muted-foreground/10 rounded-2xl">
               <div className="w-full space-y-2 bg-background border rounded-lg shadow-xl p-4 font-mono text-[11px] leading-relaxed scale-105 transform">
                  <div className="flex items-center gap-2 text-indigo-400 mb-2 underline decoration-indigo-400/30">📦 FluxPort Dashboard Project</div>
                  <div className="pl-4 flex items-center gap-2"><FolderTree className="h-3 w-3 text-blue-400" /> 📁 Authentication</div>
                  <div className="pl-10 text-emerald-400/80">↳ <Badge variant="outline" className="text-[9px] border-emerald-400/30 py-0 px-1 opacity-60">POST</Badge> login-user</div>
                  <div className="pl-10 text-emerald-400/80">↳ <Badge variant="outline" className="text-[9px] border-emerald-400/30 py-0 px-1 opacity-60">POST</Badge> register-admin</div>
                  <div className="pl-4 flex items-center gap-2"><FolderTree className="h-3 w-3 text-blue-400" /> 📁 Billing Engine</div>
                  <div className="pl-10 text-emerald-400/80">↳ <Badge variant="outline" className="text-[9px] border-emerald-400/30 py-0 px-1 opacity-60">GET</Badge> checkout-session</div>
               </div>
            </aside>
         </section>

         {/* Advanced Features */}
         <section className="space-y-8">
            <h2 className="text-3xl font-bold tracking-tight">Advanced Organization Tools</h2>
            <div className="grid md:grid-cols-3 gap-6">
               <Card className="hover:border-violet-600 transition-colors cursor-pointer group">
                  <CardHeader>
                     <Workflow className="h-8 w-8 text-violet-600 mb-2 group-hover:scale-110 transition-transform" />
                     <CardTitle className="text-lg">Environment Resolution</CardTitle>
                     <CardDescription className="text-xs">Inherit variables from the workspace level down to specific requests seamlessly.</CardDescription>
                  </CardHeader>
               </Card>
               <Card className="hover:border-blue-600 transition-colors cursor-pointer group">
                  <CardHeader>
                     <Globe className="h-8 w-8 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
                     <CardTitle className="text-lg">Global Auth Header</CardTitle>
                     <CardDescription className="text-xs">Define a Bearer token or API key at the collection level to apply it automatically to all child endpoints.</CardDescription>
                  </CardHeader>
               </Card>
               <Card className="hover:border-emerald-600 transition-colors cursor-pointer group">
                  <CardHeader>
                     <FileCheck className="h-8 w-8 text-emerald-600 mb-2 group-hover:scale-110 transition-transform" />
                     <CardTitle className="text-lg">Validation Scripts</CardTitle>
                     <CardDescription className="text-xs">Pre-request and post-response validation logic that runs for every request within the collection.</CardDescription>
                  </CardHeader>
               </Card>
            </div>
         </section>

         {/* Feature Guide Callout */}
         <div className="p-8 rounded-2xl bg-slate-900 text-white shadow-2xl relative overflow-hidden group">
            <Users className="absolute right-[-10px] bottom-[-10px] h-32 w-32 opacity-10 group-hover:rotate-12 transition-transform duration-500" />
            <div className="relative z-10 space-y-4">
               <h3 className="text-2xl font-bold">Collaborative Workspaces</h3>
               <p className="text-slate-400 opacity-80 leading-relaxed max-w-xl">
                  Learn how to isolate these collections within dedicated workspaces for team-based API design and deployment.
               </p>
               <Button className="bg-indigo-600 text-white hover:bg-indigo-700 font-bold group">
                  Explore Workspace Isolation <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
               </Button>
            </div>
         </div>
      </div>
   )
}
