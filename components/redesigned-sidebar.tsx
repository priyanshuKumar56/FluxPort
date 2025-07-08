"use client"

import { useState } from "react"
import {
  Globe,
  Zap,
  Key,
  Activity,
  FileText,
  Shield,
  Settings,
  ChevronDown,
  Home,
  History,
  Server,
  BarChart3,
  BookOpen,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"

const menuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: Home,
    badge: "New",
  },
  {
    id: "tester",
    label: "API Testing",
    icon: Zap,
    subItems: [
      { id: "rest-client", label: "REST Client", icon: Zap },
      { id: "request-history", label: "Request History", icon: History },
      { id: "localhost-setup", label: "Localhost Setup", icon: Server },
    ],
  },
  {
    id: "manager",
    label: "API Management",
    icon: Globe,
    subItems: [
      { id: "endpoints", label: "Endpoints", icon: Globe },
      { id: "routes", label: "Routes", icon: Activity },
      { id: "collections", label: "Collections", icon: FileText },
    ],
  },
  {
    id: "tokens",
    label: "Authentication",
    icon: Key,
    badge: "Pro",
  },
  {
    id: "monitoring",
    label: "Analytics",
    icon: BarChart3,
    subItems: [
      { id: "real-time", label: "Real-time", icon: Activity },
      { id: "reports", label: "Reports", icon: FileText },
    ],
  },
  {
    id: "security",
    label: "Security",
    icon: Shield,
    badge: "Enterprise",
  },
  { id: "docs", label: "Documentation", icon: BookOpen },
  { id: "settings", label: "Settings", icon: Settings },
]

export function RedesignedSidebar() {
  const [activeItem, setActiveItem] = useState("tester")

  const handleNavigation = (itemId: string) => {
    setActiveItem(itemId)
    window.dispatchEvent(new CustomEvent("sidebar-navigate", { detail: itemId }))
  }

  return (
    <Sidebar className="border-r w-72 shrink-0">
      <SidebarHeader className="p-6 border-b">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
            <span className="text-white font-bold">AG</span>
          </div>
          <div>
            <div className="font-bold text-lg">Fluxport</div>
            <div className="text-sm text-muted-foreground">Professional Suite</div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4 py-6">
        <SidebarMenu className="space-y-2">
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.id}>
              {item.subItems ? (
                <Collapsible defaultOpen={activeItem === item.id}>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      isActive={activeItem === item.id}
                      onClick={() => handleNavigation(item.id)}
                      className="w-full h-12 px-4 rounded-xl hover:bg-accent/50 transition-all duration-200"
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="ml-auto text-xs">
                          {item.badge}
                        </Badge>
                      )}
                      <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub className="mt-2 ml-4 space-y-1">
                      {item.subItems.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.id}>
                          <SidebarMenuSubButton
                            onClick={() => handleNavigation(subItem.id)}
                            isActive={activeItem === subItem.id}
                            className="h-10 px-4 rounded-lg hover:bg-accent/30 transition-all duration-200"
                          >
                            <subItem.icon className="h-4 w-4" />
                            <span>{subItem.label}</span>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <SidebarMenuButton
                  isActive={activeItem === item.id}
                  onClick={() => handleNavigation(item.id)}
                  className="w-full h-12 px-4 rounded-xl hover:bg-accent/50 transition-all duration-200"
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="ml-auto text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t">
        <div className="text-center">
          <div className="text-sm font-medium">Fluxport Pro</div>
          <div className="text-xs text-muted-foreground">Enterprise Edition</div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
