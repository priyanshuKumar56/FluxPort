import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
   Zap,
   ArrowRightLeft,
   Settings,
   ArrowRight,
   Plus,
   Box,
   Globe,
   Database,
   Search,
   Layers,
   Webhook,
   Activity,
   Terminal,
   ShieldAlert
} from "lucide-react"

export default function ProxyRulesPage() {
   return (
      <div className="space-y-12 animate-in fade-in duration-700">
         <section className="space-y-4">
            <Badge className="bg-orange-600 text-white">Documentation / Advanced Features</Badge>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Proxy & Interceptor Rules</h1>
            <p className="text-xl text-muted-foreground max-w-[800px]">
               The Smart Relay Proxy allows you to rewrite requests and responses dynamically using rule-based interception. Perfect for mocking, debugging, and header injection.
            </p>
         </section>

         {/* Logic Breakdown */}
         <section className="space-y-10 border-b pb-12">
            <h2 className="text-3xl font-bold tracking-tight">The Interception Lifecycle</h2>

            <div className="grid lg:grid-cols-3 gap-6">
               <div className="p-6 rounded-2xl bg-muted/20 border-2 border-dashed border-muted-foreground/10 space-y-4">
                  <div className="h-10 w-10 rounded-xl bg-orange-600/10 text-orange-600 flex items-center justify-center font-bold">1</div>
                  <h4 className="font-bold">Pattern Match</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">The relay engine compares incoming URLs against your defined regex or wildcard patterns (e.g., <code className="text-orange-600">/api/v1/*</code>).</p>
               </div>
               <div className="p-6 rounded-2xl bg-muted/20 border-2 border-dashed border-muted-foreground/10 space-y-4">
                  <div className="h-10 w-10 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center font-bold">2</div>
                  <h4 className="font-bold">Rule Execution</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">If a match is found, specific <strong>InterceptorRules</strong> like Header Injection or URL Rewriting are applied instantly.</p>
               </div>
               <div className="p-6 rounded-2xl bg-muted/20 border-2 border-dashed border-muted-foreground/10 space-y-4">
                  <div className="h-10 w-10 rounded-xl bg-emerald-600/10 text-emerald-600 flex items-center justify-center font-bold">3</div>
                  <h4 className="font-bold">Final Forward</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">The transformed request is sent to the target server, and the response flows back through the same audit log.</p>
               </div>
            </div>
         </section>

         {/* Advanced Interceptor Types */}
         <section className="space-y-8">
            <h2 className="text-3xl font-bold tracking-tight">Interceptor Capabilities</h2>
            <div className="space-y-6">
               <Card className="hover:border-blue-600 transition-colors shadow-none bg-muted/10 group">
                  <CardHeader className="flex flex-row items-center gap-6">
                     <div className="h-12 w-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-lg group-hover:scale-105 transition-transform"><Layers className="h-6 w-6" /></div>
                     <div>
                        <CardTitle className="text-xl">Header Injection Suite</CardTitle>
                        <CardDescription className="text-sm">Inject dynamic headers into any outbound request. Perfect for adding API keys, bearer tokens, or unique session IDs without manual entry.</CardDescription>
                     </div>
                  </CardHeader>
                  <CardContent>
                     <div className="p-4 bg-slate-900 rounded-lg font-mono text-[11px] text-blue-300">
                        <span className="opacity-40"># Adding Rule: Inject API Key</span><br />
                        RULE_TYPE: <span className="text-white font-bold">ADD_HEADER</span><br />
                        MATCH_URL: <span className="text-white font-bold">"https://external-service.com/*"</span><br />
                        PAYLOAD: <span className="text-white font-bold">{"{ \"x-api-key\": \"{{PROD_KEY}}\" }"}</span>
                     </div>
                  </CardContent>
               </Card>

               <Card className="hover:border-emerald-600 transition-colors shadow-none bg-muted/10 group">
                  <CardHeader className="flex flex-row items-center gap-6">
                     <div className="h-12 w-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-lg group-hover:scale-105 transition-transform"><ArrowRightLeft className="h-6 w-6" /></div>
                     <div>
                        <CardTitle className="text-xl">Dynamic URL Rewriting</CardTitle>
                        <CardDescription className="text-sm">Redirect traffic between your local environment and production endpoints on the fly based on specific request patterns.</CardDescription>
                     </div>
                  </CardHeader>
                  <CardContent>
                     <div className="p-4 bg-slate-900 rounded-lg font-mono text-[11px] text-emerald-300">
                        <span className="opacity-40"># Adding Rule: Redirect Auth traffic to Local</span><br />
                        RULE_TYPE: <span className="text-white font-bold">URL_REWRITE</span><br />
                        FROM: <span className="text-white font-bold">"https://api.myapp.com/auth/*"</span><br />
                        TO: <span className="text-white font-bold">"http://localhost:4000/*"</span>
                     </div>
                  </CardContent>
               </Card>
            </div>
         </section>

         {/* Advanced Config Section */}
         <div className="grid md:grid-cols-2 gap-6 pb-8">
            <div className="p-6 rounded-2xl bg-muted/20 border space-y-4">
               <h4 className="font-bold flex items-center gap-2"><Activity className="h-5 w-5 text-indigo-500" /> Latency Simulation</h4>
               <p className="text-xs text-muted-foreground leading-relaxed italic">Simulate slow networks or high-concurrency environments by injecting artificial delay (e.g., <code className="text-indigo-400">500ms</code>) into targeted proxy routes.</p>
            </div>
            <div className="p-6 rounded-2xl bg-muted/20 border space-y-4">
               <h4 className="font-bold flex items-center gap-2"><ShieldAlert className="h-5 w-5 text-red-500" /> Error Injection</h4>
               <p className="text-xs text-muted-foreground leading-relaxed italic">Inject custom HTTP status codes (e.g., <code className="text-red-400">401 Unauthorized</code> or <code className="text-amber-400">429 Too Many Requests</code>) to test your application's error handling and resiliency.</p>
            </div>
         </div>

         <div className="p-8 rounded-2xl bg-orange-600 text-white shadow-2xl relative overflow-hidden group">
            <Settings className="absolute right-[-10px] bottom-[-10px] h-32 w-32 opacity-10 group-hover:rotate-12 transition-transform duration-500" />
            <div className="relative z-10 space-y-4">
               <h3 className="text-2xl font-bold">Deep Audit Logs</h3>
               <p className="text-orange-100 opacity-80 leading-relaxed max-w-xl">
                  Every transformation is logged with "Before" and "After" state capture. Review exactly how your rules impacted a request's journey.
               </p>
               <Button className="bg-white text-orange-600 hover:bg-orange-50 font-bold group">
                  Explore Audit Engine <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
               </Button>
            </div>
         </div>
      </div>
   )
}
