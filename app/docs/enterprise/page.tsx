import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Building,
  ShieldCheck,
  Lock,
  ChevronRight,
  ArrowRight,
  Users,
  LayoutDashboard,
  Server,
  Cloud,
  Layers,
  Webhook,
  Activity,
  Terminal,
  Zap
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const enterpriseFeatures = [
  { icon: ShieldCheck, title: "SSO / SAML 2.0 Integration", desc: "Native support for Okta, Azure AD, and Google Workspace for seamless team onboarding." },
  { icon: Lock, title: "RBAC (Role Controls)", desc: "Granular access for viewers, editors, and admins within an enterprise organization." },
  { icon: Server, title: "On-Premise Deployment", desc: "Self-host FluxPort on your own infrastructure for maximum data sovereignty and compliance." },
  { icon: Activity, title: "Centralized Audit Logs", desc: "A unified view of every request made by your entire engineering team across all projects." },
]

export default function EnterprisePage() {
  return (
    <div className="space-y-24 animate-in fade-in duration-1000 slide-in-from-bottom-4">
      {/* Hero Section */}
      <section className="space-y-8 relative overflow-hidden">
        <div className="absolute -left-32 -top-32 w-64 h-64 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="space-y-4">
          <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 h-8 px-4 font-bold text-[10px] tracking-widest uppercase">
            Scale and Compliance
          </Badge>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-[-0.05em] leading-[0.95] text-white">
            FluxPort for <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-500 bg-clip-text text-transparent">Enterprises</span>
          </h1>
          <p className="text-xl text-white/40 max-w-2xl leading-relaxed font-medium">
            FluxPort is built to scale with your team. Whether you're a startup of 10 or an enterprise of 10,000, we provide the security and control you need to manage your API ecosystem.
          </p>
        </div>
      </section>

      {/* Feature Pillar Grid */}
      <section className="grid sm:grid-cols-2 gap-12 border-y border-white/[.05] py-20 px-4 md:px-0">
        {enterpriseFeatures.map((feat, idx) => (
          <div key={idx} className="space-y-4 group">
            <div className="h-14 w-14 rounded-2xl bg-white/[.02] flex items-center justify-center border border-white/[.05] group-hover:bg-indigo-600/10 group-hover:border-indigo-600/20 transition-all duration-500">
              <feat.icon className="h-7 w-7 text-white/20 group-hover:text-indigo-400 transition-colors" />
            </div>
            <h3 className="text-2xl font-bold text-white group-hover:text-indigo-200 transition-colors">{feat.title}</h3>
            <p className="text-white/30 text-[15px] leading-relaxed max-w-[340px]">{feat.desc}</p>
          </div>
        ))}
      </section>

      {/* Compliance Block */}
      <section className="space-y-12">
        <div className="text-center space-y-4">
          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 h-8 px-4 font-bold text-[10px] tracking-widest uppercase">
            Data Sovereignty
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4">SOC 2 Type II Readiness</h2>
          <p className="text-white/40 text-lg leading-relaxed max-w-xl mx-auto">
            We understand that data security is paramount. That's why FluxPort is designed to support the most stringent compliance standards.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <Card className="bg-white/[.01] border-white/[.05] p-8 rounded-3xl space-y-4 hover:bg-white/[.03] transition-all">
            <ShieldCheck className="h-10 w-10 text-emerald-500 mb-2" />
            <h4 className="text-xl font-bold text-white">Encryption at Rest</h4>
            <p className="text-sm text-white/30 leading-relaxed font-medium">All sensitive data, including API keys and tokens, is encrypted at rest using AES-256-GCM.</p>
          </Card>
          <Card className="bg-white/[.01] border-white/[.05] p-8 rounded-3xl space-y-4 hover:bg-white/[.03] transition-all">
            <Lock className="h-10 w-10 text-blue-500 mb-2" />
            <h4 className="text-xl font-bold text-white">Zero Trust Architecture</h4>
            <p className="text-sm text-white/30 leading-relaxed font-medium">FluxPort follows a zero-trust model, ensuring that every request is authenticated and authorized.</p>
          </Card>
          <Card className="bg-white/1 border-white/5 p-8 rounded-3xl space-y-4 hover:bg-white/3 transition-all">
            <Users className="h-10 w-10 text-indigo-500 mb-2" />
            <h4 className="text-xl font-bold text-white">Audit Trails</h4>
            <p className="text-sm text-white/30 leading-relaxed font-medium">Maintain a complete audit trail of all actions performed within the system for complete visibility.</p>
          </Card>
        </div>
      </section>

      {/* Integration Banner */}
      <section className="bg-linear-to-br from-[#0d0d17] to-indigo-900/10 rounded-[3rem] p-12 lg:p-20 text-white relative overflow-hidden border border-white/[.03] shadow-2xl group">
        <Server className="absolute -right-16 -top-16 h-96 w-96 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-1000" />
        <div className="relative z-10 space-y-10">
          <div className="space-y-6 max-w-2xl">
            <h2 className="text-5xl lg:text-6xl font-extrabold tracking-[-0.04em] mb-4">Elevate your team's API experience</h2>
            <p className="text-white/40 text-xl leading-relaxed font-medium">Contact our enterprise engineering unit to discuss custom integration, on-premise deployment, and tailored support plans.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold h-14 px-12 rounded-2xl shadow-[0_0_30px_rgba(99,102,241,.3)] text-lg">Talk to Engineering 💼</Button>
            <Link href="/docs/api-reference" className="text-white/40 font-bold uppercase tracking-widest text-[11px] hover:text-white transition-colors flex items-center gap-2">View Technical Specs <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>

      <footer className="pt-8 border-t border-white/3 opacity-40 text-center">
        <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-white/30 italic">© 2026 FluxPort Enterprise Solutions — Confidential Specification v16.0.10</p>
      </footer>
    </div>
  )
}
