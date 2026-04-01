import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Plus,
  CheckCircle2,
  Circle,
  RefreshCw,
  Box,
  Monitor,
  Users,
  Settings,
  Shield,
  Layers,
  ArrowRight
} from "lucide-react"

const roadmapPhases = [
  {
    status: "Completed",
    title: "Phase 1: Foundation",
    icon: CheckCircle2,
    color: "text-emerald-500",
    items: [
      "Next.js 16 + Express Proxy Core",
      "Workspace Isolation",
      "Auth System integration",
      "Professional DevOps (CI/CD, Docker)"
    ]
  },
  {
    status: "Q3 2026",
    title: "Phase 2: Orchestration",
    icon: RefreshCw,
    color: "text-blue-500",
    items: [
      "Real-time Collaboration (Sockets)",
      "Visual Rule Builder for Interceptors",
      "API Mocking Engine",
      "Team Invites & Roles"
    ]
  },
  {
    status: "Q4 2026",
    title: "Phase 3: Enterprise",
    icon: Shield,
    color: "text-indigo-500",
    items: [
      "SAML / SSO Integration",
      "Detailed Audit Logs API",
      "Custom Plugin Marketplace",
      "Advanced Traffic Analytics"
    ]
  },
  {
    status: "2027",
    title: "Phase 4: Ecosystem",
    icon: Layers,
    color: "text-violet-500",
    items: [
      "Managed Cloud Hosting",
      "Native Desktop Client (v2.0)",
      "Serverless Interceptor Extensions",
      "Integration with Terraform / pulumi"
    ]
  }
]

export default function RoadmapPage() {
  return (
    <div className="space-y-12 animate-in fade-in duration-700 max-w-3xl">
      {/* Roadmap Header */}
      <section className="space-y-4">
        <Badge className="bg-indigo-600 text-white border-indigo-700">Project Strategy</Badge>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Project Roadmap</h1>
        <p className="text-xl text-muted-foreground">
          The future of API management is local, secure, and fast. Here is how we're building the FluxPort ecosystem.
        </p>
      </section>

      {/* Roadmap List */}
      <section className="space-y-16 py-8">
        {roadmapPhases.map((phase, idx) => (
          <div key={idx} className="relative group">
            <div className="flex gap-6 items-start">
              <div className={`mt-2 h-10 w-10 shrink-0 rounded-xl bg-muted/50 flex items-center justify-center border group-hover:scale-110 transition-transform ${phase.color}`}>
                <phase.icon className="h-6 w-6" />
              </div>
              <div className="space-y-4 flex-1">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold">{phase.title}</h2>
                  <Badge variant={phase.status === "Completed" ? "default" : "outline"} className={phase.status === "Completed" ? "bg-emerald-500" : "text-muted-foreground"}>{phase.status}</Badge>
                </div>
                <ul className="grid sm:grid-cols-2 gap-4">
                  {phase.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group/item">
                      <div className={`h-2 w-2 rounded-full ${phase.status === "Completed" ? "bg-emerald-500" : "bg-muted-foreground/30 group-hover/item:bg-blue-400"} transition-colors`} />
                      <span className="text-sm font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {idx !== roadmapPhases.length - 1 && (
              <div className="absolute left-5 top-12 h-16 w-px bg-muted-foreground/10" />
            )}
          </div>
        ))}
      </section>

      {/* Community Card */}
      <Card className="bg-indigo-600 text-white shadow-2xl relative overflow-hidden border-none group">
        <div className="absolute top-0 right-0 p-8 transform translate-x-12 translate-y-[-12px] opacity-10 group-hover:translate-x-10 transition-transform duration-500">
          <Users className="h-48 w-48 shrink-0" />
        </div>
        <CardHeader className="relative z-10">
          <CardTitle className="text-2xl">Help Us Build the Future</CardTitle>
          <CardDescription className="text-indigo-100/70">FluxPort is community-first. Build plugins, propose features, or contribute code!</CardDescription>
        </CardHeader>
        <CardContent className="relative z-10 pb-8">
          <div className="flex gap-4">
            <Button className="bg-white text-indigo-600 hover:bg-indigo-50">Explore Contributions</Button>
            <Button variant="outline" className="border-indigo-400 text-indigo-50 hover:bg-indigo-500 hover:text-white">Propose Feature</Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center pt-8 border-t">
        <p className="text-xs text-muted-foreground tracking-widest uppercase italic">Generated with ❤️ for the community v16.0.10</p>
      </div>
    </div>
  )
}
