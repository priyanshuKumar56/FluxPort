import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowRight, 
  Terminal, 
  Zap, 
  ShieldCheck, 
  Globe, 
  Users,
  Box,
  Copy,
  ChevronRight,
  Code2,
  Lock,
  Cpu,
  Layers,
  Sparkles
} from "lucide-react"
import Link from "next/link"

export default function DocsHome() {
  return (
    <div className="space-y-24 animate-in fade-in duration-1000 slide-in-from-bottom-4">
      {/* Hero Section */}
      <section className="space-y-8 relative">
        <div className="absolute -left-32 -top-32 w-64 h-64 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -right-32 top-32 w-64 h-64 bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="space-y-6">
           <Badge variant="outline" className="text-indigo-400 border-indigo-500/20 bg-indigo-500/10 h-8 px-4 font-bold text-[10px] tracking-[0.2em] uppercase">
             Version 2.0.0 Stable
           </Badge>
           <h1 className="text-6xl md:text-8xl font-extrabold tracking-[-0.06em] leading-[0.9] text-white">
             The <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-500 bg-clip-text text-transparent">Power of FluxPort 2.0</span>
           </h1>
           <p className="text-xl text-white/40 max-w-2xl leading-relaxed font-medium tracking-tight">
             Welcome to the FluxPort Engineering documentation. This guide navigates you through the most powerful, security-centric API Gateway and collaboration suite on the web.
           </p>
        </div>
        
        <div className="flex flex-wrap gap-4 pt-6">
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold h-12 px-8 rounded-xl shadow-[0_0_25px_rgba(99,102,241,.3)] transition-all hover:scale-105 active:scale-95">
            Quick Start Guide <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="outline" className="h-12 px-8 rounded-xl border-white/5 bg-white/2 text-white/60 hover:text-white transition-all hover:bg-white/5">Explore Specs</Button>
        </div>
      </section>

      {/* Feature Pillar Grid */}
      <section className="grid sm:grid-cols-2 gap-8 border-y border-white/[.05] py-16 px-4 md:px-0">
        <div className="space-y-4 group">
          <div className="h-12 w-12 rounded-2xl bg-indigo-600/10 flex items-center justify-center border border-indigo-600/20 group-hover:scale-110 transition-transform">
             <Zap className="h-6 w-6 text-indigo-400" />
          </div>
          <h3 className="text-2xl font-bold text-white">Smart Relay Hub</h3>
          <p className="text-white/30 text-sm leading-relaxed max-w-[340px]">High-performance routing engine powered by Next.js 16 Edge middleware and isolation.</p>
          <Link href="/docs/how-it-works" className="text-indigo-400 text-xs font-bold uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
             View Specs <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="space-y-4 group">
          <div className="h-12 w-12 rounded-2xl bg-violet-600/10 flex items-center justify-center border border-violet-600/20 group-hover:scale-110 transition-transform">
             <ShieldCheck className="h-6 w-6 text-violet-400" />
          </div>
          <h3 className="text-2xl font-bold text-white">Security-First Vault</h3>
          <p className="text-white/30 text-sm leading-relaxed max-w-[340px]">Your tokens and keys are encrypted locally using AES-256-GCM. We never store secrets.</p>
          <Link href="/docs/security" className="text-violet-400 text-xs font-bold uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
             Audit Policy <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="space-y-4 group">
          <div className="h-12 w-12 rounded-2xl bg-cyan-600/10 flex items-center justify-center border border-cyan-600/20 group-hover:scale-110 transition-transform">
             <Code2 className="h-6 w-6 text-cyan-400" />
          </div>
          <h3 className="text-2xl font-bold text-white">Advanced Testing Client</h3>
          <p className="text-white/30 text-sm leading-relaxed max-w-[340px]">Dual-protocol REST and GraphQL engine with real-time response parsing and history logs.</p>
          <Link href="/docs/features/api-testing" className="text-cyan-400 text-xs font-bold uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
             Read API Guide <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="space-y-4 group">
          <div className="h-12 w-12 rounded-2xl bg-emerald-600/10 flex items-center justify-center border border-emerald-600/20 group-hover:scale-110 transition-transform">
             <Users className="h-6 w-6 text-emerald-400" />
          </div>
          <h3 className="text-2xl font-bold text-white">Global Collaboration</h3>
          <p className="text-white/30 text-sm leading-relaxed max-w-[340px]">Isolated workspaces for team collaboration without cross-tenant data leakage risks.</p>
          <Link href="/docs/features/workspaces" className="text-emerald-400 text-xs font-bold uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
             Team Workflow <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </section>

      {/* Terminal Block */}
      <section className="space-y-10">
        <div className="space-y-4">
           <h2 className="text-4xl font-extrabold tracking-tight text-white mb-4">Zero-Inertia Installation</h2>
           <p className="text-white/40 text-lg leading-relaxed max-w-xl">
             Launch FluxPort locally in under 30 seconds. No legacy installations required—just pure modern infrastructure.
           </p>
        </div>
        
        <div className="relative group perspective-1000">
           <div className="absolute inset-0 bg-indigo-600/10 blur-[120px] opacity-20 pointer-events-none group-hover:opacity-40 transition-opacity" />
           <div className="bg-[#0d0d17]/60 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-8 lg:p-14 shadow-2xl relative z-10 transition-all group-hover:bg-[#0d0d17]/80">
              <div className="flex items-center justify-between mb-10 pb-8 border-b border-white/5">
                 <div className="flex gap-2.5">
                    <div className="h-3.5 w-3.5 rounded-full bg-red-400/20 border border-red-400/30" />
                    <div className="h-3.5 w-3.5 rounded-full bg-amber-400/20 border border-amber-400/30" />
                    <div className="h-3.5 w-3.5 rounded-full bg-emerald-400/20 border border-emerald-400/30" />
                 </div>
                 <div className="flex items-center gap-6">
                    <span className="text-[10px] font-mono text-white/10 uppercase tracking-[0.3em] hidden md:inline-block">Engine Lifecycle: Active</span>
                    <button className="bg-white/5 hover:bg-white/10 p-2.5 rounded-xl transition-all group/copy border border-white/5">
                       <Copy className="h-4 w-4 text-white/20 group-hover/copy:text-white/60 transition-colors" />
                    </button>
                 </div>
              </div>
              <div className="space-y-8">
                 <div className="flex gap-6">
                    <span className="text-white/10 font-mono text-sm leading-8 pt-1">01</span>
                    <div className="flex-1 space-y-5">
                       <p className="text-white font-extrabold tracking-tight text-lg">Clone the source project</p>
                       <code className="block bg-black/40 p-5 rounded-2xl font-mono text-[13px] text-indigo-400/80 border border-white/5 shadow-inner leading-relaxed">
                          git clone https://github.com/priyanshuKumar56/FluxPort.git
                       </code>
                    </div>
                 </div>
                 <div className="flex gap-6">
                    <span className="text-white/10 font-mono text-sm leading-8 pt-1">02</span>
                    <div className="flex-1 space-y-5">
                       <p className="text-white font-extrabold tracking-tight text-lg">Initiate container cluster</p>
                       <code className="block bg-black/40 p-5 rounded-2xl font-mono text-[13px] text-emerald-400/80 border border-white/5 shadow-inner relative overflow-hidden group/cli leading-relaxed">
                          docker-compose up <span className="text-white/30">--build</span>
                          <div className="absolute right-0 top-0 h-full w-1.5 bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,.8)] animate-pulse" />
                       </code>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Integration Roadmap */}
      <section className="space-y-8 pb-32">
        <h3 className="text-3xl font-bold tracking-[-0.04em] text-white">Engineering Next Steps</h3>
        <div className="grid gap-4">
          {[
            { 
              title: "The Relay Hub", 
              desc: "Deep technical dive into the request lifecycle and Smart Relay Proxy engine.",
              href: "/docs/how-it-works", 
              icon: Zap,
              color: "text-indigo-400",
              bg: "bg-indigo-600/10"
            },
            { 
              title: "Vault Security Audit", 
              desc: "Detailed breakdown of our AES-256 sanitization and zero-cloud persistence protocols.",
              href: "/docs/security", 
              icon: ShieldCheck,
              color: "text-violet-400",
              bg: "bg-violet-600/10"
            },
            { 
              title: "API Automation Suite", 
              desc: "Step-by-step guide to testing, saving, and scaling your API collections.",
              href: "/docs/features/api-testing", 
              icon: Terminal,
              color: "text-cyan-400",
              bg: "bg-cyan-600/10"
            },
          ].map((link) => (
            <Link 
              key={link.title}
              href={link.href} 
              className="flex items-center p-6 rounded-2xl border border-white/[.05] bg-white/[.01] hover:bg-white/[.03] hover:border-white/[.1] transition-all group"
            >
              <div className={`mr-6 h-12 w-12 rounded-2xl ${link.bg} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                <link.icon className={`h-6 w-6 ${link.color}`} />
              </div>
              <div className="space-y-1">
                 <span className="font-bold text-lg text-white group-hover:text-indigo-300 transition-colors">{link.title}</span>
                 <p className="text-sm text-white/20">{link.desc}</p>
              </div>
              <div className="ml-auto flex items-center gap-2 text-white/10 group-hover:text-white/40 transition-colors">
                 <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:block">View Specs</span>
                 <ChevronRight className="h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <footer className="pt-8 border-t border-white/[.03] opacity-40 text-center">
         <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-white/30 italic">© 2026 FluxPort Engineering Suite v16.0.10</p>
      </footer>
    </div>
  )
}
