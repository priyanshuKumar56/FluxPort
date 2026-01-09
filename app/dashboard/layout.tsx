"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { LayoutDashboard, ShieldCheck, Zap, Settings, History } from "lucide-react"
import Link from "next/link"
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks"
import { getCurrentUser } from "@/lib/store/slices/authSlice"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { user, token } = useAppSelector((state) => state.auth)

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

  if (!token || !user) {
    return null
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background overflow-hidden font-sans">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel
            defaultSize={14}
            minSize={10}
            maxSize={20}
            className="border-r border-border/50 bg-card/40 backdrop-blur-md"
          >
            <Sidebar className="w-full border-none bg-transparent">
              <SidebarHeader className="p-4 border-b border-border/50">
                <div className="flex items-center gap-2.5 font-bold text-primary group cursor-pointer">
                  <div className="p-2 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-all duration-300 shadow-sm">
                    <Zap className="h-5 w-5 fill-current animate-pulse" />
                  </div>
                  <span className="tracking-tighter text-lg bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">FluxPort</span>
                </div>
              </SidebarHeader>
              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupContent>
                    <SidebarMenu className="px-3 mt-4 space-y-1">
                      {[
                        { title: "Overview", icon: LayoutDashboard, url: "/dashboard" },
                        { title: "Interception", icon: ShieldCheck, url: "/dashboard/rules" },
                        { title: "API Client", icon: Zap, url: "/dashboard/client" },
                        { title: "Request Logs", icon: History, url: "/dashboard/logs" },
                        { title: "Settings", icon: Settings, url: "/dashboard/settings" },
                      ].map((item) => (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton asChild tooltip={item.title}>
                            <Link
                              href={item.url}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-primary/10 hover:text-primary transition-all duration-200 group relative overflow-hidden"
                            >
                              <div className="absolute inset-0 bg-primary/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
                              <item.icon className="h-4.5 w-4.5 relative z-10 group-hover:scale-110 transition-transform" />
                              <span className="text-[13px] font-semibold relative z-10">{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>
              <div className="mt-auto p-4 border-t border-border/50">
                <div className="p-3 rounded-xl bg-muted/30 border border-border/50">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">System Online</span>
                  </div>
                  <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full w-[85%] bg-primary rounded-full shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
                  </div>
                </div>
              </div>
            </Sidebar>
          </ResizablePanel>
          <ResizableHandle withHandle className="w-px bg-border/40 hover:bg-primary/50 transition-colors" />
          <ResizablePanel defaultSize={86}>
            <main className="h-full overflow-auto bg-background/30 relative custom-scrollbar">
              {/* Premium Background elements */}
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -mr-40 -mt-40 animate-blob" />
              <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px] -ml-20 -mb-20 animate-blob animation-delay-2000" />

              <div className="relative z-10 h-full">
                {children}
              </div>
            </main>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </SidebarProvider>
  )
}

function SidebarHeader({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={className}>{children}</div>
}
