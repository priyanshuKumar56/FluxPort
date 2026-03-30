"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import {
  Globe,
  Zap,
  Clock,
  Shield,
  FileText,
  Settings,
  ChevronDown,
  Plus,
  Download,
  Wifi,
  Star,
  Sparkles,
  User,
  LayoutDashboard,
  History,
} from "lucide-react"
import Link from "next/link"
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks"
import { getCurrentUser } from "@/lib/store/slices/authSlice"
import { fetchWorkspaces, setActiveWorkspace } from "@/lib/store/slices/workspacesSlice"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CreateWorkspaceModal } from "@/components/create-workspace-modal"

const iconNavItems = [
  { id: "apis", icon: Zap, label: "APIs", url: "/dashboard/client" },
  { id: "sessions", icon: Clock, label: "Sessions", url: "/dashboard/logs" },
  { id: "rules", icon: Shield, label: "Rules", url: "/dashboard/rules" },
  { id: "files", icon: Settings, label: "Settings", url: "/dashboard/settings" },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const dispatch = useAppDispatch()
  const { user, token } = useAppSelector((state) => state.auth)
  const { workspaces, activeWorkspaceId } = useAppSelector((state) => state.workspaces)
  const [isCreateWorkspaceOpen, setIsCreateWorkspaceOpen] = useState(false)

  // Connection State
  const [connectionUrl, setConnectionUrl] = useState("localhost:3000")
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [isEditingConnection, setIsEditingConnection] = useState(false)

  const handleConnect = () => {
    setIsConnecting(true)
    setTimeout(() => {
      setIsConnecting(false)
      setIsConnected(true)
    }, 800)
  }

  useEffect(() => {
    if (!token) {
      router.push("/auth/login")
      return
    }
    if (!user) {
      dispatch(getCurrentUser()).catch(() => {
        router.push("/auth/login")
      })
    }
  }, [token, user, router, dispatch])

  // Fetch workspaces when user is authenticated
  useEffect(() => {
    if (user && token) {
      dispatch(fetchWorkspaces())
    }
  }, [user, token, dispatch])

  // Force dark mode
  useEffect(() => {
    document.documentElement.classList.add("dark")
  }, [])

  if (!token || !user) {
    return null
  }

  const getActiveNav = () => {
    if (pathname === "/dashboard") return "apis"
    if (pathname?.startsWith("/dashboard/client")) return "apis"
    if (pathname?.startsWith("/dashboard/logs")) return "sessions"
    if (pathname?.startsWith("/dashboard/rules")) return "rules"
    if (pathname?.startsWith("/dashboard/settings")) return "files"
    return "apis"
  }

  const activeNav = getActiveNav()

  const activeWorkspace = workspaces.find(w => w.id === activeWorkspaceId)
  const personalWorkspaces = workspaces.filter(w => w.is_personal)
  const teamWorkspaces = workspaces.filter(w => !w.is_personal)

  return (
    <>
      <CreateWorkspaceModal open={isCreateWorkspaceOpen} onOpenChange={setIsCreateWorkspaceOpen} />
      <div className="flex h-screen w-full bg-background overflow-hidden font-sans">
        {/* Narrow Icon Rail - Requestly style */}
        <div className="w-[52px] flex flex-col items-center py-3 border-r border-border bg-[oklch(0.11_0.01_270)] shrink-0">
          {/* Logo */}
          <div className="mb-6 p-2">
            <Link href="/" className="relative w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <img src="/logo.png" alt="FluxPort" className="w-full h-full object-cover" />
            </Link>
          </div>

          {/* Nav Icons */}
          <div className="flex flex-col items-center gap-1 flex-1">
            {iconNavItems.map((item) => (
              <Link
                key={item.id}
                href={item.url}
                className={cn(
                  "relative w-10 h-10 flex flex-col items-center justify-center rounded-lg transition-all duration-200 group",
                  activeNav === item.id
                    ? "bg-primary/10 text-primary icon-rail-active"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                )}
                title={item.label}
              >
                <item.icon className="w-[18px] h-[18px]" />
                <span className="text-[8px] font-bold mt-0.5 leading-none tracking-tight">{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Bottom settings */}
          <div className="mt-auto flex flex-col items-center gap-2 pb-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-8 h-8 rounded-full bg-primary/20 hover:bg-primary/30 transition-colors flex items-center justify-center text-primary text-xs font-bold outline-none">
                  {user?.email?.[0]?.toUpperCase() || "U"}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" side="right" className="w-56" sideOffset={12}>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none capitalize">{user.email.split('@')[0]}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/dashboard/settings")}>
                  Project Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Toolbar - Requestly style */}
          <div className="h-10 flex items-center border-b border-border bg-[oklch(0.14_0.012_270)] px-3 shrink-0">
            {/* Left section: Workspace */}
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1.5 text-[11px] font-semibold text-foreground hover:bg-accent/50 px-2 py-1.5 rounded transition-colors outline-none cursor-pointer">
                    <div className="w-4 h-4 rounded bg-muted-foreground/20 flex items-center justify-center text-[8px] font-bold text-foreground">
                      {activeWorkspace?.name.charAt(0).toUpperCase() || "D"}
                    </div>
                    <span className="ml-1 tracking-wide">{activeWorkspace?.name || "Default workspace"}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-muted-foreground ml-2" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[340px] p-0 border-border bg-[#222222] shadow-2xl rounded-xl overflow-hidden mt-1 text-foreground">
                  {/* Private Workspace Header */}
                  <div className="bg-[#1a56db] p-3 flex items-center gap-3">
                    <div className="bg-white/10 p-1.5 rounded-md">
                      <Shield className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-semibold text-white text-sm">Private Workspace</span>
                  </div>

                  <div className="p-3 pb-2 pt-4">
                    <div className="flex items-center justify-between mb-2 px-1">
                      <span className="text-sm font-medium text-foreground/80">Personal workspaces ({personalWorkspaces.length})</span>
                      <button onClick={() => setIsCreateWorkspaceOpen(true)} className="flex items-center gap-1 text-xs text-foreground/60 hover:text-foreground transition-colors outline-none font-medium">
                        + Add
                      </button>
                    </div>

                    <div className="space-y-1">
                      {personalWorkspaces.length === 0 ? (
                        <p className="text-xs italic text-muted-foreground px-2">No personal workspaces.</p>
                      ) : (
                        personalWorkspaces.map(ws => (
                          <div key={ws.id} onClick={(e) => { e.preventDefault(); dispatch(setActiveWorkspace(ws.id)) }} className={cn("flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors", ws.id === activeWorkspaceId ? "bg-white/10" : "hover:bg-white/5")}>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-[#3d3d3d] flex items-center justify-center text-lg text-white">
                                {ws.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm font-medium text-white">{ws.name}</span>
                                <span className="text-xs text-foreground/50 truncate w-[200px]">Personal Workspace</span>
                              </div>
                            </div>
                            {ws.id === activeWorkspaceId && (
                              <div className="bg-[#1b4332] text-[#4ade80] text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                                Current
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="h-px bg-white/10 w-full my-1" />

                  <div className="p-3 pt-2">
                    <div className="flex items-center justify-between mb-2 px-1">
                      <span className="text-sm font-medium text-foreground/80">Team workspaces ({teamWorkspaces.length})</span>
                      <button onClick={() => setIsCreateWorkspaceOpen(true)} className="flex items-center gap-1 text-xs text-foreground/60 hover:text-foreground transition-colors outline-none font-medium">
                        + Add
                      </button>
                    </div>

                    <div className="space-y-1 mb-2">
                      {teamWorkspaces.map(ws => (
                        <div key={ws.id} onClick={(e) => { e.preventDefault(); dispatch(setActiveWorkspace(ws.id)) }} className={cn("flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors", ws.id === activeWorkspaceId ? "bg-white/10" : "hover:bg-white/5")}>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#b48600] flex items-center justify-center text-lg text-white font-medium">
                              {ws.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-white">{ws.name}</span>
                              <span className="text-xs text-foreground/50">Team Workspace</span>
                            </div>
                          </div>
                          {ws.id === activeWorkspaceId && (
                            <div className="bg-[#1b4332] text-[#4ade80] text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">
                              Current
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-white/10 bg-[#1c1c1c] p-3 cursor-pointer hover:bg-white/5 transition-colors flex items-center gap-3">
                    <User className="w-5 h-5 text-foreground/70 ml-1" />
                    <span className="text-sm font-medium text-white flex-1">Join a workspace</span>
                    <div className="bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded min-w-[20px] text-center">
                      1
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              <span className="text-[11px] text-muted-foreground/60 cursor-pointer hover:text-primary transition-colors ml-1">Tutorials</span>
            </div>

            {/* Center: Connection bar */}
            <div className="flex-1 flex justify-center">
              <div className="flex items-center justify-between gap-2 px-3 py-1 bg-accent/40 rounded-lg border border-border/60 min-w-[200px] transition-colors hover:border-border">
                <div className="flex items-center gap-2 flex-1 overflow-hidden" onClick={() => setIsEditingConnection(true)}>
                  <Wifi className={cn("w-3 h-3 shrink-0 transition-colors", isConnected ? "text-emerald-500" : "text-primary")} />
                  {isEditingConnection ? (
                    <input
                      type="text"
                      value={connectionUrl}
                      onChange={(e) => setConnectionUrl(e.target.value)}
                      onBlur={() => setIsEditingConnection(false)}
                      onKeyDown={(e) => e.key === 'Enter' && setIsEditingConnection(false)}
                      className="bg-transparent border-none text-[10px] font-mono text-foreground focus:outline-none w-full min-w-[120px]"
                      autoFocus
                    />
                  ) : (
                    <span className="text-[10px] font-mono text-muted-foreground cursor-pointer hover:text-foreground transition-colors truncate">
                      {connectionUrl}
                    </span>
                  )}
                </div>
                <button
                  onClick={handleConnect}
                  disabled={isConnecting}
                  className={cn(
                    "text-[10px] font-semibold transition-colors ml-2 shrink-0 outline-none",
                    isConnected ? "text-emerald-500 hover:text-emerald-400" : "text-primary hover:text-primary/80"
                  )}
                >
                  {isConnecting ? "Connecting..." : isConnected ? "Connected" : "Connect"}
                </button>
              </div>
            </div>

            {/* Right section: Actions */}
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1 px-2 py-1 text-[10px] font-medium text-muted-foreground hover:text-foreground transition-colors">
                <Star className="w-3 h-3" />
                <span className="font-mono">6,575</span>
              </button>
              <button className="flex items-center gap-1 px-2 py-1 text-[10px] font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent">
                <Sparkles className="w-3 h-3" />
                Ask AI
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="w-6 h-6 rounded-full bg-gradient-to-br from-primary/40 to-primary/20 flex items-center justify-center hover:opacity-80 transition-opacity outline-none">
                    <User className="w-3 h-3 text-primary" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none capitalize">{user.email.split('@')[0]}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push("/dashboard/settings")}>
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Page content */}
          <main className="flex-1 overflow-y-auto bg-background relative custom-scrollbar">
            {children}
          </main>
        </div>
      </div>
    </>
  )
}
