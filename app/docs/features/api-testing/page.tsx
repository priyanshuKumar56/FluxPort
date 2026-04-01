import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
   Zap,
   Terminal,
   Code2,
   History,
   Send,
   Plus,
   Play,
   ArrowRight,
   Settings,
   ChevronRight,
   Copy,
   ChevronDown
} from "lucide-react"

export default function ApiTestingPage() {
   return (
      <div className="space-y-12 animate-in fade-in duration-700">
         <section className="space-y-4">
            <Badge className="bg-blue-600 text-white">Documentation / Features</Badge>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">API Testing & Request Builder</h1>
            <p className="text-xl text-muted-foreground max-w-[800px]">
               FluxPort provides a high-performance, developer-first interface for testing REST and GraphQL endpoints with sub-40ms latency.
            </p>
         </section>

         {/* Step by Step Breakdown */}
         <section className="space-y-10 border-b pb-12">
            <h2 className="text-3xl font-bold tracking-tight">Core Functionality Workflow</h2>

            <div className="space-y-16 pl-6 relative border-l-2 border-muted/50">
               {/* Step 1 */}
               <div className="relative">
                  <div className="absolute left-[-2.45rem] top-1.5 h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold shadow-lg">1</div>
                  <div className="space-y-4">
                     <h3 className="text-2xl font-bold">Initial Request Setup</h3>
                     <p className="text-muted-foreground leading-relaxed">
                        Start by typing your target endpoint in the URL bar. FluxPort supports a wide range of HTTP methods including <Badge variant="secondary" className="bg-green-100 text-green-700 font-mono">GET</Badge>, <Badge variant="secondary" className="bg-blue-100 text-blue-700 font-mono">POST</Badge>, <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 font-mono">PUT</Badge>, and more.
                     </p>
                     <Card className="bg-slate-900 border-none shadow-xl overflow-hidden p-6 font-mono text-sm">
                        <div className="flex gap-3 mb-4">
                           <div className="w-24 bg-green-500/20 text-green-400 p-2 rounded text-center font-bold">GET</div>
                           <div className="flex-1 bg-white/5 p-2 rounded">https://api.fluxport.io/v1/user</div>
                           <button className="bg-blue-600 px-6 py-2 rounded text-white font-bold hover:bg-blue-700 transition-all active:scale-95 shadow-md">SEND</button>
                        </div>
                     </Card>
                  </div>
               </div>

               {/* Step 2 */}
               <div className="relative">
                  <div className="absolute left-[-2.45rem] top-1.5 h-6 w-6 rounded-full bg-indigo-600 flex items-center justify-center text-white text-[10px] font-bold shadow-lg">2</div>
                  <div className="space-y-4">
                     <h3 className="text-2xl font-bold">Headers & Auth Injection</h3>
                     <p className="text-muted-foreground">
                        Click the <strong>Auth</strong> or <strong>Headers</strong> tabs in the request panel. You can define authentication schemes like <Badge variant="outline">Bearer Token</Badge> or <Badge variant="outline">Basic Auth</Badge>, or add custom metadata.
                     </p>
                     <div className="grid sm:grid-cols-2 gap-4">
                        <div className="p-4 border rounded-xl bg-muted/20">
                           <h4 className="font-bold flex items-center gap-2 mb-2 text-sm"><Plus className="h-4 w-4" /> Add Header</h4>
                           <div className="flex gap-2">
                              <div className="flex-1 p-2 bg-muted/40 rounded border text-[10px] font-mono opacity-60 italic">key</div>
                              <div className="flex-1 p-2 bg-muted/40 rounded border text-[10px] font-mono opacity-60 italic">value</div>
                           </div>
                        </div>
                        <div className="p-4 border rounded-xl bg-muted/20">
                           <h4 className="font-bold flex items-center gap-2 mb-2 text-sm"><Terminal className="h-4 w-4" /> Environment Injection</h4>
                           <p className="text-[10px] text-muted-foreground leading-relaxed">
                              Use <code className="text-blue-600 font-bold">{"{{API_KEY}}"}</code> to automatically pull from your active environment variables.
                           </p>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Step 3 */}
               <div className="relative">
                  <div className="absolute left-[-2.45rem] top-1.5 h-6 w-6 rounded-full bg-violet-600 flex items-center justify-center text-white text-[10px] font-bold shadow-lg">3</div>
                  <div className="space-y-4">
                     <h3 className="text-2xl font-bold">Body JSON Editor</h3>
                     <p className="text-muted-foreground leading-relaxed">
                        For <Badge variant="secondary">POST</Badge> and <Badge variant="secondary">PUT</Badge> requests, our built-in JSON editor provides real-time syntax highlighting and schema validation.
                     </p>
                     <div className="relative bg-slate-900 text-slate-400 p-6 rounded-xl font-mono text-sm border-l-4 border-violet-500 shadow-inner">
                        <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
                           <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Payload Builder</span>
                           <Badge className="bg-violet-600/20 text-violet-400 border-none font-mono text-[9px]">Valid JSON</Badge>
                        </div>
                        <pre className="text-indigo-300">
                           {`{
  "name": "Alex Smith",
  "email": "alex@fluxport.org",
  "roles": ["dev", "lead"]
}`}
                        </pre>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         {/* Advanced Features */}
         <section className="space-y-8">
            <h2 className="text-3xl font-bold tracking-tight">Advanced Testing Tools</h2>
            <div className="grid md:grid-cols-3 gap-6">
               <Card className="hover:border-blue-600 transition-colors cursor-pointer group">
                  <CardHeader>
                     <History className="h-8 w-8 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
                     <CardTitle className="text-lg">Request History</CardTitle>
                     <CardDescription className="text-xs">FluxPort automatically saves every request with full headers and body history for instant replay.</CardDescription>
                  </CardHeader>
               </Card>
               <Card className="hover:border-indigo-600 transition-colors cursor-pointer group">
                  <CardHeader>
                     <Code2 className="h-8 w-8 text-indigo-600 mb-2 group-hover:scale-110 transition-transform" />
                     <CardTitle className="text-lg">Code Generation</CardTitle>
                     <CardDescription className="text-xs">Export your request as cURL, Axios, Fetch, or Python code snippets directly from the UI.</CardDescription>
                  </CardHeader>
               </Card>
               <Card className="hover:border-violet-600 transition-colors cursor-pointer group">
                  <CardHeader>
                     <Settings className="h-8 w-8 text-violet-600 mb-2 group-hover:scale-110 transition-transform" />
                     <CardTitle className="text-lg">Settings Injection</CardTitle>
                     <CardDescription className="text-xs">Deep configuration of timeout limits, SSL verification, and CORS proxy routing.</CardDescription>
                  </CardHeader>
               </Card>
            </div>
         </section>

         <div className="p-8 rounded-2xl bg-indigo-600 text-white shadow-2xl relative overflow-hidden group">
            <Zap className="absolute right-[-10px] bottom-[-10px] h-32 w-32 opacity-10 group-hover:rotate-12 transition-transform duration-500" />
            <div className="relative z-10 space-y-4">
               <h3 className="text-2xl font-bold">Fast-Tracking Your Debugging</h3>
               <p className="text-indigo-100 opacity-80 leading-relaxed max-w-xl">
                  Combine our <strong className="text-white">Smart Relay Proxy</strong> with the Request Builder to intercept and rewrite production traffic on the fly for local testing.
               </p>
               <Button className="bg-white text-indigo-600 hover:bg-indigo-50 font-bold group">
                  Learn about Interceptor Rules <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
               </Button>
            </div>
         </div>
      </div>
   )
}
