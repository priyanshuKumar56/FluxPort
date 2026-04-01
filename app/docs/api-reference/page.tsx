import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { 
  FileCode2, 
  Terminal, 
  Copy, 
  ChevronRight,
  ArrowRight,
  Database,
  Lock,
  Globe,
  Layers,
  Zap,
  Webhook
} from "lucide-react"

const apiSpecs = [
  { method: "GET", path: "/v1/workspaces", desc: "List all workspaces the authenticated user has access to.", auth: "JWT Required" },
  { method: "POST", path: "/v1/saved-requests", desc: "Create a new saved request entry within a collection.", auth: "JWT Required" },
  { method: "GET", path: "/v1/collections/:id", desc: "Retrieve a complete collection tree including folders and requests.", auth: "JWT Required" },
  { method: "POST", path: "/relay/auth-proxy", desc: "Intercept and relay a request through the Smart Proxy engine.", auth: "API Key Required" },
]

export default function ApiReferencePage() {
  return (
    <div className="space-y-24 animate-in fade-in duration-1000 slide-in-from-bottom-4">
      {/* Hero Section */}
      <section className="space-y-6 relative overflow-hidden">
        <div className="absolute -left-32 -top-32 w-64 h-64 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="space-y-4">
           <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 h-8 px-4 font-bold text-[10px] tracking-widest uppercase">
             Infrastructure Interface
           </Badge>
           <h1 className="text-5xl md:text-7xl font-extrabold tracking-[-0.05em] leading-[0.95] text-white">
             API <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-violet-500 bg-clip-text text-transparent">Reference</span>
           </h1>
           <p className="text-xl text-white/40 max-w-2xl leading-relaxed font-medium">
             Deploy, manage, and scale your FluxPort resources programmatically via our unified REST API. 
           </p>
        </div>
      </section>

      {/* API Authentication */}
      <section className="space-y-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-white mb-8 border-b border-white/[.05] pb-4">Authentication</h2>
        <div className="grid lg:grid-cols-2 gap-8">
           <div className="space-y-4 font-medium text-white/40 text-sm leading-relaxed">
              <p>Every request to the FluxPort API must be authenticated using a <strong className="text-white">Bearer Token</strong> or a valid <strong className="text-white">X-API-Key</strong> header.</p>
              <p>Tokens can be generated within your FluxPort dashboard settings and are scoped to either your account or a specific workspace.</p>
           </div>
           <div className="bg-[#0d0d17] p-6 rounded-3xl border border-white/[.05] shadow-2xl relative overflow-hidden group">
              <pre className="text-[11px] font-mono leading-relaxed text-indigo-300">
                {`# Request Header Sample
Authorization: Bearer <your_jwt_token>
X-API-Key: <your_workspace_key>
X-Workspace-Id: <id>`}
              </pre>
           </div>
        </div>
      </section>

      {/* Endpoint Table */}
      <section className="space-y-12">
        <h2 className="text-3xl font-extrabold tracking-tight text-white mb-8 border-b border-white/[.05] pb-4">Endpoints Explorer</h2>
        <div className="space-y-4">
           {apiSpecs.map((spec, idx) => (
             <div key={idx} className="group p-6 bg-white/[.01] border border-white/[.05] hover:bg-white/[.03] rounded-3xl transition-all flex flex-col lg:flex-row lg:items-center gap-6">
                <div className="flex gap-4 items-center lg:w-[340px] shrink-0">
                   <Badge className={`h-8 px-3 rounded-lg font-mono text-[10px] font-bold tracking-widest ${spec.method === "GET" ? "bg-emerald-600/10 text-emerald-400 border-emerald-500/20" : "bg-indigo-600/10 text-indigo-400 border-indigo-500/20"}`}>
                      {spec.method}
                   </Badge>
                   <code className="text-[13px] font-bold tracking-tight text-white/60 group-hover:text-white transition-colors">
                      {spec.path}
                   </code>
                </div>
                <div className="flex-1 text-sm text-white/30 leading-relaxed font-semibold">
                   {spec.desc}
                </div>
                <div className="lg:w-[140px] shrink-0">
                   <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-500/60">{spec.auth}</span>
                </div>
                <ChevronRight className="h-5 w-5 text-white/10 group-hover:text-white group-hover:translate-x-2 transition-all ml-auto hidden lg:block" />
             </div>
           ))}
        </div>
      </section>

      {/* Code Snippet Example */}
      <section className="space-y-10">
        <div className="space-y-4 text-center pb-8 border-b border-white/[.05]">
           <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 h-8 px-4 font-bold text-[10px] tracking-widest uppercase mb-4">Code Sandbox</Badge>
           <h2 className="text-4xl font-extrabold tracking-tight text-white">Direct Integration</h2>
           <p className="text-white/40 text-lg leading-relaxed max-w-xl mx-auto">Copy these snippets to integrate FluxPort automation directly into your environment setup scripts.</p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-10">
           <div className="p-8 bg-[#0d0d17] rounded-3xl border border-white/[.05] shadow-2xl relative">
              <div className="flex items-center justify-between mb-6 pb-2 border-b border-white/5">
                 <span className="text-[10px] uppercase font-bold tracking-widest text-white/10 flex items-center gap-2"><Terminal className="h-4 w-4" /> cURL request</span>
                 <Copy className="h-4 w-4 text-white/10 hover:text-white transition-colors cursor-pointer" />
              </div>
              <pre className="text-[11px] font-mono text-indigo-300 leading-relaxed whitespace-pre-wrap">
                {`curl -X POST "https://gateway.fluxport.io/v1/collections" \\
  -H "Authorization: Bearer <token>" \\
  -H "Content-Type: application/json" \\
  -d '{ "name": "Production APIs" }'`}
              </pre>
           </div>
           
           <div className="p-8 bg-[#0d0d17] rounded-3xl border border-white/[.05] shadow-2xl relative">
              <div className="flex items-center justify-between mb-6 pb-2 border-b border-white/5">
                 <span className="text-[10px] uppercase font-bold tracking-widest text-white/10 flex items-center gap-2"><Webhook className="h-4 w-4" /> Axios (Node.js)</span>
                 <Copy className="h-4 w-4 text-white/10 hover:text-white transition-colors cursor-pointer" />
              </div>
              <pre className="text-[11px] font-mono text-emerald-300 leading-relaxed whitespace-pre-wrap">
                {`const axios = require('axios');

axios.get('https://gateway.fluxport.io/v1/workspaces', {
  headers: { 'Authorization': 'Bearer <token>' }
}).then(res => console.log(res.data));`}
              </pre>
           </div>
        </div>
      </section>

      <footer className="pt-8 border-t border-white/[.03] opacity-40 text-center">
         <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-white/30 italic">© 2026 FluxPort Global API Specification v16.0.10</p>
      </footer>
    </div>
  )
}
