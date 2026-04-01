import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  History,
  Plus,
  RefreshCw,
  ShieldCheck,
  Zap,
  Code2,
  Target,
  ArrowRight
} from "lucide-react"

const changelogEntries = [
  {
    version: "v2.0.0",
    date: "April 01, 2026",
    status: "Stable",
    highlights: [
      { type: "Feature", icon: Zap, color: "text-indigo-400", title: "Next.js 16 Gateway Integration", desc: "Complete overhaul of the relay engine to leverage Next.js 16's high-performance edge routing." },
      { type: "Feature", icon: RefreshCw, color: "text-blue-400", title: "Real-time Delta Sync", desc: "Workspace changes are now synchronized across all team members in real-time." },
      { type: "Security", icon: ShieldCheck, color: "text-emerald-400", title: "AES-256 Vault v2", desc: "Enhanced encryption protocols for credential sanitization and local storage security." },
      { type: "DevOps", icon: Code2, color: "text-violet-400", title: "Multi-arch Docker Images", desc: "Production-ready Docker images now support ARM64 and x86_64 architectures." },
    ]
  },
  {
    version: "v1.8.4",
    date: "March 20, 2026",
    status: "Legacy",
    highlights: [
      { type: "Feature", icon: Target, title: "Request History Retention", desc: "Extended request history to support up to 10,000 requests per workspace." },
      { type: "Fix", icon: RefreshCw, title: "Auth Header Collision", desc: "Resolved a rare race condition when refreshing multiple JWT tokens simultaneously." },
    ]
  }
]

export default function ChangelogPage() {
  return (
    <div className="space-y-24 animate-in fade-in duration-1000 slide-in-from-bottom-4">
      {/* Hero Section */}
      <section className="space-y-6 relative overflow-hidden">
        <div className="absolute -left-32 -top-32 w-64 h-64 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="space-y-4">
          <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 h-8 px-4 font-bold text-[10px] tracking-widest uppercase">
            Release Specification
          </Badge>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-[-0.05em] leading-[0.95] text-white">
            Engineering <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-violet-500 bg-clip-text text-transparent">Changelog</span>
          </h1>
          <p className="text-xl text-white/40 max-w-2xl leading-relaxed font-medium">
            Track every iteration of the FluxPort ecosystem. From low-level engine optimizations to high-level UI enhancements.
          </p>
        </div>
      </section>

      {/* Changelog Flow */}
      <section className="space-y-20 relative">
        <div className="absolute left-6 top-10 bottom-10 w-px bg-white/[.05] pointer-events-none" />

        {changelogEntries.map((entry, idx) => (
          <div key={idx} className="relative pl-20 group">
            <div className={`absolute left-[18.5px] top-4 h-3 w-3 rounded-full border-4 border-[#06060f] ${entry.status === "Stable" ? "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,.8)]" : "bg-white/10"} transition-all group-hover:scale-125`} />

            <div className="space-y-8">
              <div className="flex items-center gap-6">
                <h2 className="text-4xl font-extrabold text-white tracking-tight">{entry.version}</h2>
                <span className="text-white/20 text-sm font-bold uppercase tracking-widest">{entry.date}</span>
                <Badge variant="outline" className={`border-white/10 ${entry.status === "Stable" ? "text-emerald-400" : "text-white/20"} font-bold text-[10px]`}>{entry.status}</Badge>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {entry.highlights.map((h, i) => (
                  <Card key={i} className="bg-white/[.01] border-white/[.05] p-6 lg:p-8 rounded-3xl space-y-4 hover:bg-white/[.03] transition-all group/card border-l-4 border-transparent hover:border-indigo-600">
                    <div className={`h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center group-hover/card:scale-110 transition-transform ${h.icon || "text-white/40"}`}>
                      <h.icon className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-lg font-bold text-white group-hover/card:text-indigo-200 transition-colors">{h.title}</h4>
                      <p className="text-sm text-white/30 leading-relaxed font-medium">{h.desc}</p>
                    </div>
                    <Badge variant="outline" className="text-[9px] border-white/5 text-white/10 uppercase tracking-widest font-bold">{h.type}</Badge>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Subscribe Banner */}
      <section className="bg-gradient-to-br from-[#0d0d17] to-indigo-900/10 rounded-[3rem] p-12 text-white relative overflow-hidden border border-white/[.03] shadow-2xl group text-center">
        <History className="absolute right-[-2rem] top-[-2rem] h-64 w-64 opacity-5 pointer-events-none group-hover:rotate-12 transition-transform duration-1000" />
        <div className="relative z-10 space-y-6 max-w-xl mx-auto">
          <h2 className="text-3xl font-extrabold tracking-tight mb-4 text-white">Track the build</h2>
          <p className="text-white/40 text-lg leading-relaxed font-medium">Never miss a critical security update or engine optimization. Join 2,000+ engineers tracking the FluxPort commit history.</p>
          <div className="flex gap-4 pt-4 justify-center">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold h-12 px-8 rounded-2xl shadow-lg">Subscribe to Releases 🚀</Button>
          </div>
        </div>
      </section>

      <footer className="pt-8 border-t border-white/[.03] opacity-40 text-center">
        <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-white/30 italic">© 2026 FluxPort Version History — Public Record v16.0.10</p>
      </footer>
    </div>
  )
}
