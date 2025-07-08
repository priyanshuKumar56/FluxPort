"use client"

import { useState } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { LandingPage } from "@/components/landing-page"
import { DocumentationPage } from "@/components/documentation-page"
import { RedesignedDashboard } from "@/components/redesigned-dashboard"
import { Button } from "@/components/ui/button"
import { Home, Book, BarChart3 } from "lucide-react"

export default function Page() {
  const [currentPage, setCurrentPage] = useState("landing")

  const renderPage = () => {
    switch (currentPage) {
      case "landing":
        return <LandingPage />
      case "docs":
        return <DocumentationPage />
      case "dashboard":
        return <RedesignedDashboard />
      default:
        return <LandingPage />
    }
  }

  return (
    <ThemeProvider defaultTheme="light" storageKey="api-gateway-theme">
      <div className="min-h-screen">
        {/* Navigation Pills - Fixed position */}
        <div className="fixed top-6 right-6 z-50 flex gap-2">
          <Button
            variant={currentPage === "landing" ? "default" : "outline"}
            size="sm"
            onClick={() => setCurrentPage("landing")}
            className="backdrop-blur-sm"
          >
            <Home className="h-4 w-4 mr-2" />
            Landing
          </Button>
          <Button
            variant={currentPage === "docs" ? "default" : "outline"}
            size="sm"
            onClick={() => setCurrentPage("docs")}
            className="backdrop-blur-sm"
          >
            <Book className="h-4 w-4 mr-2" />
            Docs
          </Button>
          <Button
            variant={currentPage === "dashboard" ? "default" : "outline"}
            size="sm"
            onClick={() => setCurrentPage("dashboard")}
            className="backdrop-blur-sm"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Dashboard
          </Button>
        </div>

        {renderPage()}
      </div>
    </ThemeProvider>
  )
}
