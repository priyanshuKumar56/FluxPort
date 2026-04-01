"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  BookOpen, 
  ShieldCheck, 
  Zap, 
  Map, 
  ChevronRight,
  Menu,
  X,
  Search,
  Github,
  LayoutDashboard,
  Box,
  FolderTree,
  Terminal,
  Settings,
  HelpCircle,
  History,
  Building,
  FileCode2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FluxPortLandingBackground } from "@/components/Landing/fluxport/FluxPortLandingBackground"
import { Orb } from "@/components/Landing/fluxport/Orb"

const sidebarItems = [
  { 
    title: "The Vision",
    items: [
      { name: "Introduction", href: "/docs", icon: BookOpen },
      { name: "The Relay Hub", href: "/docs/how-it-works", icon: Zap },
    ]
  },
  {
    title: "Engineering Suite",
    items: [
      { name: "API Automation", href: "/docs/features/api-testing", icon: Terminal },
      { name: "Multi-Tenancy", href: "/docs/features/workspaces", icon: LayoutDashboard },
      { name: "Data Hierarchy", href: "/docs/features/collections", icon: FolderTree },
      { name: "Smart Interceptors", href: "/docs/features/proxy-rules", icon: Box },
    ]
  },
  {
    title: "Governance",
    items: [
      { name: "Security Protocols", href: "/docs/security", icon: ShieldCheck },
      { name: "Product Roadmap", href: "/docs/roadmap", icon: Map },
      { name: "Changelog", href: "/docs/changelog", icon: History },
      { name: "Enterprise Guide", href: "/docs/enterprise", icon: Building },
    ]
  },
  {
     title: "Developer API",
     items: [
        { name: "API Reference", href: "/docs/api-reference", icon: FileCode2 }
     ]
  }
]

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#06060f] text-slate-200 selection:bg-indigo-500/30 relative overflow-hidden">
      <FluxPortLandingBackground />
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <Orb size={600} color="rgba(99,102,241,.08)" style={{ top: "-100px", right: "-100px" }} />
          <Orb size={500} color="rgba(139,92,246,.05)" style={{ bottom: "-150px", left: "-150px" }} />
      </div>
      
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-white/[.05] bg-[#06060f]/80 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3 group transition-transform hover:scale-105 active:scale-95">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white font-extrabold text-sm shadow-[0_0_20px_rgba(99,102,241,.3)]">
                F
              </div>
              <span className="font-extrabold text-[15px] tracking-[-0.03em] uppercase hidden md:inline-block">
                FluxPort <span className="text-white/20 ml-2">Engineering</span>
              </span>
            </Link>
            <nav className="hidden lg:flex items-center gap-6">
               <Link href="/dashboard" className="text-[11px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors">Dashboard</Link>
               <Link href="https://github.com/priyanshuKumar56/FluxPort" className="text-[11px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors">GitHub</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex relative group">
              <div className="absolute inset-0 bg-indigo-500/20 blur opacity-0 group-focus-within:opacity-100 transition-opacity rounded-lg" />
              <Search className="absolute left-3 top-[50%] -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-indigo-400 transition-colors" />
              <input 
                type="search" 
                placeholder="Search specs..." 
                className="relative pl-10 h-10 w-64 rounded-xl border border-white/[.08] bg-[#0d0d17]/50 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-white/10"
              />
            </div>
            <Button className="hidden md:flex bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-10 px-6 rounded-xl shadow-[0_0_20px_rgba(99,102,241,.2)]">
               Sign In
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden text-white/40" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      <div className="container flex-1 items-start md:grid md:grid-cols-[280px_1fr] md:gap-14 px-6">
        {/* Sidebar */}
        <aside className={cn(
          "fixed top-16 z-30 -ml-2 hidden h-[calc(100vh-4rem)] w-full shrink-0 overflow-y-auto border-r border-white/[.05] md:sticky md:block",
          isMobileMenuOpen && "block bg-[#06060f] inset-x-0 !w-full z-[100]"
        )}>
          <ScrollArea className="h-full py-10 pr-6">
            <div className="space-y-10">
              {sidebarItems.map((group) => (
                <div key={group.title} className="px-4">
                  <h2 className="mb-4 px-4 text-[10px] font-extrabold uppercase tracking-[0.2em] text-white/20">
                    {group.title}
                  </h2>
                  <div className="space-y-1.5">
                    {group.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          "group flex items-center rounded-xl px-4 py-2.5 text-sm font-semibold transition-all",
                          pathname === item.href 
                            ? "bg-indigo-600/10 text-indigo-400 border border-indigo-600/20 shadow-[0_0_20px_rgba(99,102,241,.1)]" 
                            : "transparent text-white/30 hover:text-white/80 hover:bg-white/[.02]"
                        )}
                      >
                        <item.icon className={cn(
                          "mr-3 h-4 w-4",
                          pathname === item.href ? "text-indigo-400" : "text-white/20 group-hover:text-white/40"
                        )} />
                        <span className="tracking-tight">{item.name}</span>
                        {pathname === item.href && (
                           <div className="ml-auto w-1 h-4 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,.8)] animate-pulse" />
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}

              <div className="px-8 pt-6 border-t border-white/[.03] mt-10">
                 <div className="p-6 rounded-2xl bg-indigo-600/[.03] border border-white/[.04] relative group transition-all hover:bg-indigo-600/[.06]">
                    <HelpCircle className="h-4 w-4 text-indigo-500/40 mb-3" />
                    <p className="text-[11px] text-white/50 font-bold tracking-tight mb-2 uppercase">
                       Support Core
                    </p>
                    <p className="text-[10px] text-white/20 leading-relaxed mb-4">
                       Direct access to lead engineers via GitHub issues.
                    </p>
                    <Button variant="outline" size="sm" className="w-full h-8 text-[10px] font-bold border-white/[.08] hover:bg-white/[.05]" asChild>
                       <Link href="https://github.com/priyanshuKumar56/FluxPort/issues">Open Request</Link>
                    </Button>
                 </div>
              </div>
            </div>
          </ScrollArea>
        </aside>

        {/* Main Content */}
        <main className="relative py-12 lg:py-16 flex justify-center overflow-x-hidden">
            <div className="w-full max-w-4xl space-y-16 animate-in fade-in duration-1000">
                {children}
            </div>
        </main>
      </div>
    </div>
  )
}
