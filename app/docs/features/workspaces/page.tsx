import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
   Users,
   LayoutDashboard,
   ShieldCheck,
   ArrowRight,
   UserCheck,
   Settings,
   Target,
   Plus,
   Box,
   Globe,
   Bell
} from "lucide-react"

export default function WorkspacesPage() {
   return (
      <div className="space-y-12 animate-in fade-in duration-700">
         <section className="space-y-4">
            <Badge className="bg-emerald-600 text-white">Documentation / Features</Badge>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Workspaces & Teams</h1>
            <p className="text-xl text-muted-foreground max-w-[800px]">
               Secure multi-tenancy for your APIs. Isolate projects, invite team members, and manage shared secrets in a high-trust environment.
            </p>
         </section>

         {/* Multi-Tenancy Illustration */}
         <section className="grid lg:grid-cols-2 gap-10 border-b pb-12">
            <div className="space-y-6">
               <h2 className="text-3xl font-bold tracking-tight">Logical Isolation</h2>
               <p className="text-muted-foreground leading-relaxed">
                  FluxPort Workspaces provide a high-security container for all your API resources. Every request, collection, and environment key is logically partitioned at the database level to ensure zero cross-contamination between teams.
               </p>
               <ul className="space-y-4">
                  <li className="flex gap-4 p-4 border rounded-xl bg-card transition-all hover:translate-x-2">
                     <ShieldCheck className="h-6 w-6 text-emerald-500 shrink-0" />
                     <div><strong className="text-sm">Row-Level Security</strong> <p className="text-xs text-muted-foreground">Every DB query verified against your workspace membership.</p></div>
                  </li>
                  <li className="flex gap-4 p-4 border rounded-xl bg-card transition-all hover:translate-x-2">
                     <UserCheck className="h-6 w-6 text-blue-500 shrink-0" />
                     <div><strong className="text-sm">Team Collaboration</strong> <p className="text-xs text-muted-foreground">Instant workspace invites with granular member permissions.</p></div>
                  </li>
               </ul>
            </div>

            <div className="relative group perspective-1000 hidden lg:block">
               <div className="absolute inset-0 bg-blue-500/10 blur-3xl opacity-20 -z-10 group-hover:opacity-40 transition-opacity" />
               <div className="p-8 space-y-6 bg-slate-900 shadow-2xl rounded-3xl border border-white/5 transform rotate-y-[-10deg] rotate-x-[5deg] transition-transform duration-700 group-hover:rotate-0">
                  <div className="flex items-center justify-between pb-4 border-b border-white/5">
                     <div className="flex gap-2">
                        <div className="h-3 w-3 rounded-full bg-red-400 opacity-60" />
                        <div className="h-3 w-3 rounded-full bg-amber-400 opacity-60" />
                        <div className="h-3 w-3 rounded-full bg-emerald-400 opacity-60" />
                     </div>
                     <Badge variant="outline" className="text-[9px] border-white/10 uppercase tracking-widest text-white/40 font-mono">Workspace: Main_Team</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-3 opacity-80">
                     <div className="p-3 bg-white/5 rounded-lg border border-white/5"><div className="h-2 w-12 bg-blue-500 mb-2 rounded" /> <div className="h-10 w-full bg-white/5 rounded" /></div>
                     <div className="p-3 bg-white/5 rounded-lg border border-white/5"><div className="h-2 w-12 bg-indigo-500 mb-2 rounded" /> <div className="h-10 w-full bg-white/5 rounded" /></div>
                  </div>
                  <div className="p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20 flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-emerald-400" />
                        <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-tighter">6 Online Contributors</span>
                     </div>
                     <div className="flex -space-x-2">
                        <div className="h-6 w-6 rounded-full border border-background bg-blue-600 flex items-center justify-center text-[8px] font-bold">P</div>
                        <div className="h-6 w-6 rounded-full border border-background bg-indigo-600 flex items-center justify-center text-[8px] font-bold">K</div>
                        <div className="h-6 w-6 rounded-full border border-background bg-emerald-600 flex items-center justify-center text-[8px] font-bold">A</div>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         {/* Advanced Features */}
         <section className="space-y-8">
            <h2 className="text-3xl font-bold tracking-tight">Workspace Management</h2>
            <div className="grid md:grid-cols-3 gap-6">
               <Card className="hover:border-emerald-600 transition-colors cursor-pointer group">
                  <CardHeader>
                     <Bell className="h-8 w-8 text-emerald-500 mb-2 group-hover:scale-110 transition-transform" />
                     <CardTitle className="text-lg">Real-time Updates</CardTitle>
                     <CardDescription className="text-xs">Synchronized request edits and collection updates for the entire team in real-time.</CardDescription>
                  </CardHeader>
               </Card>
               <Card className="hover:border-blue-600 transition-colors cursor-pointer group">
                  <CardHeader>
                     <Settings className="h-8 w-8 text-blue-500 mb-2 group-hover:scale-110 transition-transform" />
                     <CardTitle className="text-lg">Environment Scoping</CardTitle>
                     <CardDescription className="text-xs">Shared API tokens and environment configs that never leave the secure workspace boundary.</CardDescription>
                  </CardHeader>
               </Card>
               <Card className="hover:border-indigo-600 transition-colors cursor-pointer group">
                  <CardHeader>
                     <Globe className="h-8 w-8 text-indigo-500 mb-2 group-hover:scale-110 transition-transform" />
                     <CardTitle className="text-lg">Global Audit Log</CardTitle>
                     <CardDescription className="text-xs">Automated history of every request made through the workspace's associated relay proxies.</CardDescription>
                  </CardHeader>
               </Card>
            </div>
         </section>

         {/* Call to Action Banner */}
         <div className="p-8 rounded-2xl bg-blue-600 text-white shadow-2xl relative overflow-hidden group">
            <Target className="absolute right-[-10px] bottom-[-10px] h-32 w-32 opacity-10 group-hover:rotate-12 transition-transform duration-500" />
            <div className="relative z-10 space-y-4">
               <h3 className="text-2xl font-bold">Ready to Secure Your Proxy?</h3>
               <p className="text-blue-100 opacity-80 leading-relaxed max-w-xl">
                  Learn how to configure the Smart Relay Proxy with custom interception rules inside your workspace.
               </p>
               <Button className="bg-white text-blue-600 hover:bg-blue-50 font-bold group">
                  Setup Interceptors <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
               </Button>
            </div>
         </div>
      </div>
   )
}
