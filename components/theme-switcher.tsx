"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useTheme } from "@/components/theme-provider"
import { Palette, Sun, Moon, Sparkles, Coffee, Zap } from "lucide-react"

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()

  const themes = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    // { value: "glassmorphism", label: "Glassmorphism", icon: Sparkles },
    { value: "rice", label: "Rice White", icon: Coffee },
    { value: "postman", label: "Postman Blue", icon: Zap },
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <Palette className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {themes.map((themeOption) => (
          <DropdownMenuItem
            key={themeOption.value}
            onClick={() => setTheme(themeOption.value as any)}
            className={theme === themeOption.value ? "bg-accent" : ""}
          >
            <themeOption.icon className="h-4 w-4 mr-2" />
            {themeOption.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
