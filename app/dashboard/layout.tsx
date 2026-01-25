"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { LayoutDashboard, ShieldCheck, Zap, Settings, History, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks"
import { getCurrentUser } from "@/lib/store/slices/authSlice"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const dispatch = useAppDispatch()
  const { user, token } = useAppSelector((state) => state.auth)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
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

  if (!mounted) return null

  if (!token || !user) {
    return null
  }

  const menuItems = [
    { title: "Overview", icon: LayoutDashboard, url: "/dashboard" },
    { title: "Interception", icon: ShieldCheck, url: "/dashboard/rules" },
    { title: "API Client", icon: Zap, url: "/dashboard/client" },
    { title: "Request Logs", icon: History, url: "/dashboard/logs" },
    { title: "Settings", icon: Settings, url: "/dashboard/settings" },
  ]

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-[#fafbfc] overflow-hidden font-sans selection:bg-primary/10 selection:text-primary">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel
            defaultSize={16}
            minSize={12}
            maxSize={20}
            className="border-r border-gray-100 bg-white shadow-[4px_0_24px_-12px_rgba(0,0,0,0.02)] z-20"
          >
            <Sidebar className="w-full border-none bg-transparent">
              <SidebarHeader className="p-6 pb-2">
                <div className="flex items-center gap-3 font-bold text-primary cursor-pointer group">
                  <div className="relative flex items-center justify-center p-2.5 rounded-xl bg-primary text-white shadow-lg shadow-primary/20 transition-transform duration-300 group-hover:scale-105 active:scale-95">
                    <Zap className="h-5 w-5 fill-current" />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg tracking-tight font-display text-gray-900 leading-none">FluxPort</span>
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 mt-0.5">Workspace</span>
                  </div>
                </div>
              </SidebarHeader>

              <SidebarContent className="px-3 py-6">
                <SidebarGroup>
                  <SidebarGroupContent>
                    <SidebarMenu className="space-y-1.5">
                      {menuItems.map((item) => {
                        const isActive = pathname === item.url
                        return (
                          <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild tooltip={item.title} className="h-auto py-1">
                              <Link
                                href={item.url}
                                className={`
                                  relative flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-all duration-300 group overflow-hidden
                                  ${isActive
                                    ? "bg-primary text-white shadow-md shadow-primary/25 font-medium"
                                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                  }
                                `}
                              >
                                {isActive && (
                                  <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
                                )}
                                <item.icon
                                  className={`h-[18px] w-[18px] transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`}
                                  strokeWidth={isActive ? 2.5 : 2}
                                />
                                <span className="text-[14px]">{item.title}</span>
                                {isActive && (
                                  <ChevronRight className="ml-auto h-4 w-4 opacity-50 animate-in fade-in slide-in-from-left-1 duration-300" />
                                )}
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        )
                      })}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>

              <SidebarFooter className="p-4 mt-auto">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="relative w-2 h-2">
                        <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-75" />
                        <div className="relative w-2 h-2 bg-emerald-500 rounded-full border-2 border-white" />
                      </div>
                      <span className="text-xs font-semibold text-gray-600">Proxy Active</span>
                    </div>
                    <span className="text-[10px] font-mono text-gray-400">v2.4.0</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full w-[85%] bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.2)] animate-pulse" />
                  </div>
                  <div className="flex justify-between mt-2 text-[10px] text-gray-400 font-medium">
                    <span>Latency</span>
                    <span className="text-gray-600">24ms</span>
                  </div>
                </div>
              </SidebarFooter>
            </Sidebar>
          </ResizablePanel>

          <ResizableHandle withHandle className="w-px bg-transparent hover:bg-primary/20 transition-colors z-30" />

          <ResizablePanel defaultSize={84}>
            <main className="h-full w-full overflow-y-auto bg-[#fafbfc] relative scroll-smooth p-2">
              {/* Subtle background flair */}
              <div className="fixed top-0 right-0 w-[800px] h-[600px] bg-gradient-to-b from-blue-50/50 to-transparent opacity-60 blur-3xl -z-10 pointer-events-none" />
              <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-t from-gray-100/50 to-transparent opacity-40 blur-3xl -z-10 pointer-events-none" />

              <div className="h-full w-full rounded-2xl bg-white/40 border border-white/60 shadow-sm backdrop-blur-sm overflow-hidden relative">
                {children}
              </div>
            </main>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </SidebarProvider>
  )
}
