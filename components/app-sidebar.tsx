"use client"

import { useState } from "react"
import { Globe, Zap, Key, Activity, FileText, Shield, Settings, ChevronDown } from "lucide-react"
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
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

const menuItems = [
  {
    id: "tester",
    label: "API Tester",
    icon: Zap,
    subItems: [
      { id: "rest-client", label: "REST Client" },
      { id: "request-history", label: "Request History" },
      { id: "localhost-setup", label: "Localhost Setup" },
    ],
  },
  {
    id: "manager",
    label: "API Manager",
    icon: Globe,
    subItems: [
      { id: "endpoints", label: "Endpoints" },
      { id: "routes", label: "Routes" },
    ],
  },
  { id: "tokens", label: "Tokens", icon: Key },
  { id: "monitoring", label: "Monitoring", icon: Activity },
  { id: "docs", label: "Documentation", icon: FileText },
  { id: "security", label: "Security", icon: Shield },
  { id: "settings", label: "Settings", icon: Settings },
]

export function AppSidebar() {
  const [activeItem, setActiveItem] = useState("tester")

  const handleNavigation = (itemId: string) => {
    setActiveItem(itemId)
    window.dispatchEvent(new CustomEvent("sidebar-navigate", { detail: itemId }))
  }

  return (
    <Sidebar className="border-r w-64 shrink-0">
      <SidebarHeader className="p-4 border-b">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded bg-blue-600 flex items-center justify-center">
            <span className="text-white text-sm font-bold">FP</span>
          </div>
          <div>
            <div className="font-semibold">Fluxport</div>
            <div className="text-xs text-muted-foreground">Dashboard</div>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-2 py-4">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.id}>
              {item.subItems ? (
                <Collapsible defaultOpen={activeItem === item.id}>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      isActive={activeItem === item.id}
                      onClick={() => handleNavigation(item.id)}
                      className="w-full"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                      <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.subItems.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.id}>
                          <SidebarMenuSubButton
                            onClick={() => handleNavigation(subItem.id)}
                            isActive={activeItem === subItem.id}
                          >
                            {subItem.label}
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
                  className="w-full"
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}
