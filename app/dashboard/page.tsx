"use client"

import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { PostmanMainDashboard } from "@/components/postman-main-dashboard"
import { ThemeProvider } from "@/components/theme-provider"

import { useState, useEffect, Suspense, lazy } from "react"
import { Loader2, Activity, Zap, BarChart3 } from "lucide-react"

// Lazy load components for better performance
const LazyPostmanMainDashboard = lazy(() => 
  import("@/components/postman-main-dashboard").then(module => ({
    default: module.PostmanMainDashboard
  }))
)

const LazyAppSidebar = lazy(() => 
  import("@/components/app-sidebar").then(module => ({
    default: module.AppSidebar
  }))
)

// Loading skeleton for the dashboard
const DashboardSkeleton = () => (
  <div className="flex h-screen bg-background overflow-hidden">
    <div className="flex-1 flex flex-col min-w-0">
      {/* Header skeleton */}
      <div className="flex items-center justify-between p-4 border-b bg-white/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-32 h-6 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-24 h-8 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Main content skeleton */}
      <div className="flex-1 p-6 space-y-6">
        {/* Stats cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg border p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="w-10 h-10 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border p-6 shadow-sm">
            <div className="w-32 h-6 bg-gray-200 rounded animate-pulse mb-4"></div>
            <div className="w-full h-64 bg-gray-100 rounded animate-pulse"></div>
          </div>
          <div className="bg-white rounded-lg border p-6 shadow-sm">
            <div className="w-28 h-6 bg-gray-200 rounded animate-pulse mb-4"></div>
            <div className="w-full h-64 bg-gray-100 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Table skeleton */}
        <div className="bg-white rounded-lg border shadow-sm">
          <div className="p-6 border-b">
            <div className="w-32 h-6 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
                    <div className="space-y-1">
                      <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="w-16 h-3 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                  <div className="w-16 h-6 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)

// Enhanced loading component with animations
const DashboardLoader = () => (
  <div className="flex h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-50 overflow-hidden">
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      <div className="text-center space-y-6">
        {/* Animated logo/icon */}
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl mx-auto flex items-center justify-center shadow-2xl">
            <Activity className="w-10 h-10 text-white animate-pulse" />
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
        </div>

        {/* Loading text */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">
            Setting up your dashboard
          </h2>
          <p className="text-gray-600">
            Please wait while we prepare your workspace...
          </p>
        </div>

        {/* Enhanced loading spinner */}
        <div className="relative">
          <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto"></div>
          <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-b-red-500 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
        </div>

        {/* Progress indicators */}
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <Zap className="w-4 h-4 animate-pulse" />
          <span>Loading components...</span>
        </div>

        {/* Animated dots */}
        <div className="flex items-center justify-center gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            ></div>
          ))}
        </div>
      </div>

      {/* Background animations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-orange-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-blue-200 rounded-full opacity-15 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-16 h-16 bg-green-200 rounded-full opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
    </div>
  </div>
)

// Fallback component for suspense
const SuspenseFallback = () => (
  <div className="flex items-center justify-center h-full">
    <div className="text-center space-y-4">
      <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto" />
      <p className="text-gray-600">Loading dashboard...</p>
    </div>
  </div>
)

export default function Page() {
  const [isLoading, setIsLoading] = useState(true)
  const [showSkeleton, setShowSkeleton] = useState(true)
  const [componentsReady, setComponentsReady] = useState(false)

  useEffect(() => {
    // Simulate component preparation and loading
    const loadingTimer = setTimeout(() => {
      setIsLoading(false)
      
      // Show skeleton for a brief moment while components hydrate
      setTimeout(() => {
        setShowSkeleton(false)
        setComponentsReady(true)
      }, 300)
    }, 1500) // Adjust this timing based on your needs

    return () => clearTimeout(loadingTimer)
  }, [])

  // Show enhanced loader initially
  if (isLoading) {
    return <DashboardLoader />
  }

  // Show skeleton while components are loading
  if (showSkeleton) {
    return <DashboardSkeleton />
  }

  // Render the actual dashboard with lazy loading
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <SidebarProvider defaultOpen={true}>
        {/* Lazy load sidebar */}
        <Suspense fallback={<div className="w-64 bg-gray-100 animate-pulse" />}>
          {/* Uncomment when you want to show sidebar */}
          {/* <LazyAppSidebar /> */}
        </Suspense>
        
        <SidebarInset className="flex-1 flex flex-col min-w-0">
          <Suspense fallback={<SuspenseFallback />}>
            {componentsReady ? (
              <ThemeProvider>

                <LazyPostmanMainDashboard />
              </ThemeProvider>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center space-y-4">
                  <BarChart3 className="w-12 h-12 text-orange-500 mx-auto animate-pulse" />
                  <p className="text-gray-600">Initializing dashboard...</p>
                </div>
              </div>
            )}
          </Suspense>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}