import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Zap,
  ArrowRightLeft,
  Database,
  Lock,
  Clock,
  Layers,
  Webhook,
  Activity,
  Terminal,
  ShieldAlert,
  ChevronRight,
  ArrowRight,
  Monitor,
  Cpu
} from "lucide-react"

export default function HowItWorks() {
  return (
    <div className="space-y-24 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Intro */}
      <section className="space-y-6 relative overflow-hidden">
        <div className="absolute -left-32 -top-32 w-64 h-64 bg-orange-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="space-y-6">
          <Badge className="bg-orange-500/10 text-orange-400 border-orange-500/20 h-8 px-4 font-bold text-[10px] tracking-[0.2em] uppercase">
            Technical Architecture Specification
          </Badge>
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-[-0.06em] leading-[0.9] text-white">
            The <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 bg-clip-text text-transparent">Smart Relay Hub</span>
          </h1>
          <p className="text-xl text-white/40 max-w-2xl leading-relaxed font-medium tracking-tight">
            FluxPort isn't just a proxy—it's a distributed request-transformation engine. We call it the "Smart Relay Hub," and it operates at the edge of your development environment.
          </p>
        </div>
      </section>

      {/* Logic Flow Diagram-like Grid */}
      <section className="space-y-16">
        <h2 className="text-3xl font-bold tracking-tight text-white mb-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-600/10 flex items-center justify-center border border-orange-600/20 shadow-md">
            <Layers className="h-5 w-5 text-orange-400" />
          </div>
          Request Lifecycle Analysis
        </h2>

        <div className="space-y-16 pl-4 border-l border-white/5 relative">
          {/* Step 1: Ingress */}
          <div className="relative group transition-all hover:bg-white/1 p-8 rounded-3xl border border-transparent hover:border-white/5">
            <div className="absolute -left-4 top-1.5 h-4 w-4 rounded-full border-4 border-[#06060f] bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,.6)]" />
            <div className="grid lg:grid-cols-2 gap-10">
              <div className="space-y-4">
                <h3 className="text-3xl font-extrabold text-white">01 / Unified Ingress</h3>
                <p className="text-white/40 text-[15px] leading-relaxed">
                  Every request sent via the FluxPort UI or the Relay CLI enters the internal dispatcher. Here, we normalize the payload, headers, and protocol (REST or GraphQL) before routing.
                </p>
                <ul className="grid grid-cols-2 gap-2 text-[11px] font-bold text-white/20 uppercase tracking-tighter">
                  <li className="flex items-center gap-2"><div className="w-1 h-1 bg-orange-500 rounded-full" /> Normalization</li>
                  <li className="flex items-center gap-2"><div className="w-1 h-1 bg-orange-500 rounded-full" /> Validation</li>
                  <li className="flex items-center gap-2"><div className="w-1 h-1 bg-orange-500 rounded-full" /> Header Parsing</li>
                  <li className="flex items-center gap-2"><div className="w-1 h-1 bg-orange-500 rounded-full" /> Protocol Detection</li>
                </ul>
              </div>
              <div className="p-6 bg-[#0d0d17] rounded-3xl border border-white/5 font-mono text-[11px] shadow-2xl relative overflow-hidden group/card transition-all hover:scale-105 active:scale-95 cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-emerald-400/60 uppercase font-bold tracking-widest text-[9px]">Ingress Request Object</span>
                  <Badge variant="outline" className="border-white/10 text-white/20 font-mono text-[9px]">Raw Payload</Badge>
                </div>
                <pre className="text-white/20">
                  {`POST /relay/auth/v1/login
Host: gateway.fluxport.io
Content-Type: application/json
Authorization: Bearer test_key_443

{ "user": "admin", "pass": "••••" }`}
                </pre>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>

          {/* Step 2: Interception */}
          <div className="relative group transition-all hover:bg-white/1 p-8 rounded-3xl border border-transparent hover:border-white/5">
            <div className="absolute -left-4 top-1.5 h-4 w-4 rounded-full border-4 border-[#06060f] bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,.6)]" />
            <div className="grid lg:grid-cols-2 gap-10">
              <div className="space-y-4 lg:order-last">
                <h3 className="text-3xl font-extrabold text-white text-right">02 / Smart Interception</h3>
                <p className="text-white/40 text-[15px] leading-relaxed text-right">
                  Our interceptor engine matches the request against your defined workspace rules using high-efficiency regex clustering.
                </p>
                <div className="flex justify-end gap-3 flex-wrap">
                  <Badge className="bg-indigo-600/10 text-indigo-400 border-indigo-600/20 font-mono">Regex Pattern Match</Badge>
                  <Badge className="bg-indigo-600/10 text-indigo-400 border-indigo-600/20 font-mono">Rule Index Lookup</Badge>
                </div>
              </div>
              <Card className="bg-indigo-600/5 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-900 overflow-hidden shadow-2xl transition-all group-hover:scale-105 active:scale-95 cursor-pointer">
                <CardHeader className="bg-indigo-600 text-white py-3">
                  <CardTitle className="text-xs flex items-center justify-between font-bold uppercase tracking-widest"><div className="flex items-center gap-2"><Lock className="h-4 w-4" /> Rule ID: INJ_AUTH_V2</div> <span className="opacity-60">Priority: 1</span></CardTitle>
                </CardHeader>
                <CardContent className="pt-6 relative">
                  <div className="font-mono text-[10px] text-white/30 mb-4 bg-black/40 p-3 rounded-xl border border-white/5">
                    IF path matches <span className="text-indigo-400">/auth/*</span>
                    <br />
                    THEN inject header <span className="text-emerald-400">x-api-key: {"{{PROD_KEY}}"}</span>
                  </div>
                  <div className="flex items-center gap-4 justify-center">
                    <div className="p-2.5 rounded-xl bg-white/[.04] text-white/28 border border-white/[.05] text-[10px] flex items-center gap-2">
                      <Zap className="h-3 w-3 text-amber-500" /> Resolver Engine Running
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Step 3: Transformation */}
          <div className="relative group transition-all hover:bg-white/1 p-8 rounded-3xl border border-transparent hover:border-white/5">
            <div className="absolute -left-4 top-1.5 h-4 w-4 rounded-full border-4 border-[#06060f] bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,.6)]" />
            <div className="grid lg:grid-cols-2 gap-10">
              <div className="space-y-4">
                <h3 className="text-3xl font-extrabold text-white">03 / Payload Mutation</h3>
                <p className="text-white/40 text-[15px] leading-relaxed">
                  The resolver replaces all environment placeholders with raw secrets in a secure, isolated sub-process. The request is then rewritten to its final destination URL.
                </p>
                <p className="text-[11px] text-emerald-400/60 italic border-l-2 border-emerald-500/20 pl-4">No data is cached during transformation to ensure zero-persistence of secrets.</p>
              </div>
              <div className="bg-[#0d0d17] p-8 rounded-3xl border border-emerald-500/20 font-mono text-[11px] text-emerald-400 group-hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-2xl shadow-emerald-500/5">
                <div className="mb-4 text-[9px] uppercase tracking-widest text-emerald-400/40 font-bold border-b border-emerald-500/10 pb-2 flex justify-between">
                  <span>Mutation Complete</span>
                  <Badge variant="outline" className="border-emerald-500/20 text-emerald-400 text-[9px]">Sub-4ms Execution</Badge>
                </div>
                <pre>
                  {`X-TRANSFORMED: true
x-api-key: sk_prod_••••••••283
Host: production-auth.cloud.com`}
                </pre>
              </div>
            </div>
          </div>

          {/* Step 4: Audit */}
          <div className="relative group transition-all hover:bg-white/1 p-8 rounded-3xl border border-transparent hover:border-white/5">
            <div className="absolute -left-4 top-1.5 h-4 w-4 rounded-full border-4 border-[#06060f] bg-slate-400 shadow-[0_0_15px_rgba(255,255,255,.3)]" />
            <div className="grid lg:grid-cols-2 gap-10">
              <div className="space-y-4 lg:order-last">
                <h3 className="text-3xl font-extrabold text-white text-right">04 / Asynchronous Audit</h3>
                <p className="text-white/40 text-[15px] leading-relaxed text-right">
                  Finally, a deep audit object is generated and pushed to our PostgreSQL timeseries log system without delaying the original request response.
                </p>
                <div className="flex justify-end items-center gap-4 text-white/20">
                  <span className="text-[10px] font-mono tracking-widest uppercase font-bold">Persistence Engine: Neon V4</span>
                  <div className="h-2 w-16 bg-white/[.05] rounded-full overflow-hidden">
                    <div className="h-full w-[80%] bg-white/20 animate-pulse" />
                  </div>
                </div>
              </div>
              <div className="bg-white/[.02] p-8 rounded-3xl border border-dashed border-white/[.05] flex items-center justify-between group-hover:scale-105 active:scale-95 transition-all cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-white/[.04] text-white">
                    <Database className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-white font-bold text-sm tracking-tight tracking-tight">Audit_Commit_Success</div>
                    <div className="text-white/20 text-[10px] font-mono">Row_ID: flux_log_2026_04_01</div>
                  </div>
                </div>
                <div className="text-[11px] font-bold text-emerald-500 font-mono">COMMIT</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Engine Specs */}
      <section className="bg-indigo-600 rounded-3xl p-10 lg:p-16 text-white relative overflow-hidden shadow-[0_32px_80px_rgba(30,58,138,.3)] group">
        <Cpu className="absolute left-[-4rem] bottom-[-4rem] h-96 w-96 opacity-10 pointer-events-none group-hover:rotate-12 transition-transform duration-1000" />
        <div className="relative z-10 space-y-12">
          <div className="space-y-4">
            <h2 className="text-4xl lg:text-5xl font-extrabold tracking-[-0.04em] mb-4">Relay Engine v2.0 Specifications</h2>
            <p className="max-w-xl text-indigo-100/70 text-lg leading-relaxed">Our unified routing engine is designed to handle enterprise workloads with zero overhead. Every line of code is optimized for the V8 runtime.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            <div className="space-y-3">
              <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/10"><Activity className="h-5 w-5" /></div>
              <h4 className="font-bold text-lg">Sub-6ms Parse</h4>
              <p className="text-xs text-indigo-100/60 leading-relaxed font-medium">Internal request normalization and route mapping takes less than 6 milliseconds at full throttle.</p>
            </div>
            <div className="space-y-3">
              <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/10"><Monitor className="h-5 w-5" /></div>
              <h4 className="font-bold text-lg">Cross-Origin Engine</h4>
              <p className="text-xs text-indigo-100/60 leading-relaxed font-medium">Automatic CORS bypass and pre-flight handling ensures you never hit browser security blockers in dev.</p>
            </div>
            <div className="space-y-3">
              <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/10"><Webhook className="h-5 w-5" /></div>
              <h4 className="font-bold text-lg">Protocol Agnostic</h4>
              <p className="text-xs text-indigo-100/60 leading-relaxed font-medium">Handles raw REST, complex GraphQL schemas, and soon, WebSocket and bidirectional gRPC streams.</p>
            </div>
            <div className="space-y-3">
              <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/10"><ArrowRightLeft className="h-5 w-5" /></div>
              <h4 className="font-bold text-lg">Zero-Persistence</h4>
              <p className="text-xs text-indigo-100/60 leading-relaxed font-medium">Tokens are parsed from memory buffers and cleared instantly via surgical V8 garbage collection pinning.</p>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 flex justify-between items-center">
            <div className="flex gap-4">
              <Button className="bg-white text-indigo-600 hover:bg-indigo-50 font-bold h-10 px-8 rounded-xl shadow-lg">Read Core Source</Button>
              <Button variant="outline" className="border-white/20 text-white hover:bg-indigo-500 font-bold h-10 px-8 rounded-xl">GitHub Repository</Button>
            </div>
            <p className="text-[10px] font-bold tracking-widest text-indigo-200">Relay_Node_V20_Native_Module</p>
          </div>
        </div>
      </section>

      <div className="flex flex-col items-center gap-4 text-center mt-32 h-64 justify-center border-t border-white/[.05]">
        <Zap className="h-8 w-8 text-white/5" />
        <p className="text-[10px] font-bold text-white/10 uppercase tracking-[0.6em] mb-4 italic">End of Technical Specification — FluxPort Engineering Suite</p>
      </div>
    </div>
  )
}
