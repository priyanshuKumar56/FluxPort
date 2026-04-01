import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  UserCheck, 
  AlertTriangle,
  FileCheck,
  Zap,
  Globe,
  Key
} from "lucide-react"

const securityMilestones = [
  { status: "Implemented", title: "JWT Authentication", desc: "Secure token-based user verification with automated refresh logic." },
  { status: "Implemented", title: "Workspace Isolation", desc: "No data leakage across multi-tenant workspaces via DB-level checks." },
  { status: "In Progress", title: "RBAC (Role Controls)", desc: "Granular access for viewers, editors, and admins within a team." },
  { status: "Planned", title: "SAML / SSO", desc: "Enterprise login support for Okta, Azure AD, and Google Workspace." },
  { status: "Planned", title: "Zero-Trust Proxy", desc: "Mutual TLS (mTLS) support for internal relay secure segments." },
]

export default function SecurityPage() {
  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Security Header */}
      <section className="space-y-4">
        <Badge className="bg-emerald-600 text-white border-emerald-700">Security & Compliance</Badge>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Enterprise-Grade Protection</h1>
        <p className="text-xl text-muted-foreground max-w-[800px]">
          We believe security is a feature, not a checklist. FluxPort is designed from the database-up to protect your secrets and API configurations.
        </p>
      </section>

      {/* Security Features */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-8 border-b">
        <div className="space-y-3 p-4 rounded-xl border bg-muted/20">
          <Lock className="h-6 w-6 text-emerald-500 mb-2" />
          <h4 className="font-bold">Secret Sanitization</h4>
          <p className="text-sm text-muted-foreground">Automatic redacting of passwords and keys in dashboard logs and exports.</p>
        </div>
        <div className="space-y-3 p-4 rounded-xl border bg-muted/20">
          <UserCheck className="h-6 w-6 text-blue-500 mb-2" />
          <h4 className="font-bold">Strict Validation</h4>
          <p className="text-sm text-muted-foreground">Every endpoint is guarded by Express-level `express-validator` and JWT checks.</p>
        </div>
        <div className="space-y-3 p-4 rounded-xl border bg-muted/20">
          <Eye className="h-6 w-6 text-purple-500 mb-2" />
          <h4 className="font-bold">Visibility Control</h4>
          <p className="text-sm text-muted-foreground">Full audit trails of who created, edited, or deleted any request within a workspace.</p>
        </div>
      </section>

      {/* Security Roadmap */}
      <section className="space-y-8">
        <h2 className="text-3xl font-bold tracking-tight">Security Roadmap</h2>
        <div className="relative pl-8 space-y-12 before:absolute before:left-[11px] before:top-2 before:h-[calc(100%-1rem)] before:w-0.5 before:bg-muted-foreground/10">
          {securityMilestones.map((ms, idx) => (
            <div key={idx} className="relative group">
              <div className="absolute left-[-2.05rem] top-1.5 h-4 w-4 rounded-full border-2 border-background bg-muted-foreground/20 group-hover:bg-emerald-500 transition-colors" />
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-lg">{ms.title}</h4>
                  <Badge variant={ms.status === "Implemented" ? "default" : "secondary"} className={ms.status === "Implemented" ? "bg-emerald-500 hover:bg-emerald-600" : ""}>{ms.status}</Badge>
                </div>
                <p className="text-muted-foreground">{ms.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Compliance Card */}
      <Card className="border-2 border-dashed border-muted-foreground/20 bg-muted/10">
        <CardHeader>
           <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/10 flex items-center justify-center mb-2">
              <ShieldCheck className="h-6 w-6 text-emerald-600" />
           </div>
           <CardTitle>Compliance Commitment</CardTitle>
           <CardDescription>We aim for SOC 2 Type II and GDPR readiness by the end of 2026.</CardDescription>
        </CardHeader>
        <CardContent>
           <p className="text-sm text-muted-foreground italic">
             "Our infrastructure is designed to isolate data at the row level using PostgreSQL security policies, ensuring that enterprise clients can trust us with their internal API structures."
           </p>
        </CardContent>
      </Card>

      {/* Reporting Banner */}
      <div className="flex items-center gap-6 p-6 rounded-2xl bg-slate-900 text-white shadow-xl group">
        <AlertTriangle className="h-10 w-10 text-yellow-400 shrink-0 group-hover:scale-110 transition-transform" />
        <div className="space-y-1">
           <h4 className="font-bold text-lg">Found a vulnerability?</h4>
           <p className="text-slate-400 text-sm">We provide bounties for responsibly disclosed security issues. Please email <span className="underline text-blue-400">security@fluxport.org</span></p>
        </div>
      </div>
    </div>
  )
}
