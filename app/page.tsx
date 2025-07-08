"use client"

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  Zap,
  Globe,
  Shield,
  Activity,
  Star,
  Users,
  Rocket,
  Play,
  Code,
  Database,
  Lock,
  TrendingUp,
  Sparkles,
  CheckCircle,
  Send,
  Eye,
  BarChart3,
  Terminal,
  Workflow,
  Upload,
  Github,
  Slack,
  MessageSquare,
  Figma,
  Target,
  BookOpen,
  Boxes,
  FileText,
  Twitter,
  Linkedin,
} from "lucide-react"
import FeaturesSection from "@/components/Landing/featuresSection"
import StatsSection from "@/components/Landing/Stats"
import WorksSection from "@/components/Landing/WorksSection"
import SecurityFeature from "@/components/Landing/SecurityFeature"
import { TestimonialSec } from "@/components/Landing/TestimonialSec"
import { IntegrationsSection } from "@/components/Landing/IntegrationsSection"
import PriceSection from "@/components/Landing/PriceSection"
import FooterSection from "@/components/Landing/FooterSection"
import ApiGatewayDashboard from "@/components/Landing/apiDemoDashboard"
import Navigation from "@/components/Landing/Navigation"
import Link from "next/link"
import { useRouter } from "next/navigation"

// Type definitions
interface LandingPageProps {
  onGetStarted: () => void
}

interface Particle {
  id: number
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
}

interface FloatingIcon {
  id: number
  icon: React.ComponentType<{ size?: number }>
  x: number
  y: number
  rotation: number
  speed: number
  size: number
}

interface MousePosition {
  x: number
  y: number
}

// Loading Skeleton Component
const LoadingSkeleton: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-50 overflow-hidden relative">
    <div className="relative z-40 container mx-auto px-6 pt-20 pb-32">
      <div className="text-center mb-20">
        <div className="animate-pulse">
          {/* Badge skeleton */}
          <div className="h-10 w-80 bg-gray-200 rounded-full mx-auto mb-8"></div>
          
          {/* Title skeleton */}
          <div className="space-y-4 mb-8">
            <div className="h-16 bg-gray-200 rounded-lg mx-auto max-w-4xl"></div>
            <div className="h-16 bg-gray-200 rounded-lg mx-auto max-w-3xl"></div>
          </div>
          
          {/* Description skeleton */}
          <div className="space-y-3 mb-10">
            <div className="h-6 bg-gray-200 rounded mx-auto max-w-4xl"></div>
            <div className="h-6 bg-gray-200 rounded mx-auto max-w-3xl"></div>
          </div>
          
          {/* Typewriter skeleton */}
          <div className="h-16 bg-gray-200 rounded mx-auto max-w-md mb-12"></div>
          
          {/* Buttons skeleton */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
            <div className="h-16 w-64 bg-gray-200 rounded-lg"></div>
            <div className="h-16 w-48 bg-gray-200 rounded-lg"></div>
          </div>
          
          {/* Trust indicators skeleton */}
          <div className="flex flex-wrap items-center justify-center gap-8 mb-12">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 w-40 bg-gray-200 rounded-full"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
)

// Custom hook for typewriter effect
const useTypewriter = (text: string, speed: number = 100, loop: boolean = true) => {
  const [displayedText, setDisplayedText] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const indexRef = useRef(0)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const typeNextChar = useCallback(() => {
    if (indexRef.current < text.length) {
      setDisplayedText(text.slice(0, indexRef.current + 1))
      indexRef.current++
      timeoutRef.current = setTimeout(typeNextChar, speed)
    } else {
      setIsTyping(false)
      if (loop) {
        timeoutRef.current = setTimeout(() => {
          indexRef.current = 0
          setDisplayedText("")
          setIsTyping(true)
          typeNextChar()
        }, 2000)
      }
    }
  }, [text, speed, loop])

  useEffect(() => {
    setIsTyping(true)
    indexRef.current = 0
    setDisplayedText("")
    typeNextChar()

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [typeNextChar])

  return { displayedText, isTyping }
}

// Optimized custom hook for animations with lazy initialization
const useAnimations = (isReady: boolean) => {
  const [particles, setParticles] = useState<Particle[]>([])
  const [floatingIcons, setFloatingIcons] = useState<FloatingIcon[]>([])
  const [mousePos, setMousePos] = useState<MousePosition>({ x: 0, y: 0 })
  const [scrollY, setScrollY] = useState(0)
  const animationFrameRef = useRef<number | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  // Lazy initialization of floating icons
  const floatingIconsData = useMemo(() => {
    if (!isReady || typeof window === 'undefined') return []
    
    const icons = [Code, Database, Shield, Activity, Globe, Zap, Terminal, BarChart3]
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      icon: icons[i],
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      rotation: Math.random() * 360,
      speed: Math.random() * 2 + 1,
      size: Math.random() * 20 + 15,
    }))
  }, [isReady])

  // Lazy initialization of particles
  const particlesData = useMemo(() => {
    if (!isReady || typeof window === 'undefined') return []
    
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 4 + 1,
      speedX: (Math.random() - 0.5) * 2,
      speedY: (Math.random() - 0.5) * 2,
      opacity: Math.random() * 0.5 + 0.1,
    }))
  }, [isReady])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY })
  }, [])

  const handleScroll = useCallback(() => {
    setScrollY(window.scrollY)
  }, [])

  const animate = useCallback(() => {
    if (!isInitialized) return

    setParticles(prev =>
      prev.map(p => ({
        ...p,
        x: p.x > window.innerWidth ? 0 : p.x < 0 ? window.innerWidth : p.x + p.speedX,
        y: p.y > window.innerHeight ? 0 : p.y < 0 ? window.innerHeight : p.y + p.speedY,
      }))
    )

    setFloatingIcons(prev =>
      prev.map(icon => ({
        ...icon,
        y: icon.y < -50 ? window.innerHeight + 50 : icon.y - icon.speed,
        rotation: icon.rotation + 1,
      }))
    )

    animationFrameRef.current = requestAnimationFrame(animate)
  }, [isInitialized])

  useEffect(() => {
    if (!isReady) return

    // Delay initialization to prevent blocking
    const initTimeout = setTimeout(() => {
      setParticles(particlesData)
      setFloatingIcons(floatingIconsData)
      setIsInitialized(true)
    }, 100)

    return () => clearTimeout(initTimeout)
  }, [isReady, particlesData, floatingIconsData])

  useEffect(() => {
    if (!isInitialized) return

    // Passive event listeners for better performance
    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    window.addEventListener("scroll", handleScroll, { passive: true })
    
    // Start animation after a small delay
    const animationTimeout = setTimeout(() => {
      animationFrameRef.current = requestAnimationFrame(animate)
    }, 200)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("scroll", handleScroll)
      clearTimeout(animationTimeout)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isInitialized, handleMouseMove, handleScroll, animate])

  return { particles, floatingIcons, mousePos, scrollY }
}

// Optimized Particle Field Component with conditional rendering
const ParticleField: React.FC<{ particles: Particle[]; isVisible: boolean }> = React.memo(({ particles, isVisible }) => {
  if (!isVisible || particles.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute w-1 h-1 bg-orange-400 rounded-full"
          style={{
            left: particle.x,
            top: particle.y,
            transform: `scale(${particle.size})`,
            opacity: particle.opacity,
          }}
        />
      ))}
    </div>
  )
})

// Optimized Floating Icons Component with conditional rendering
const FloatingIcons: React.FC<{ floatingIcons: FloatingIcon[]; isVisible: boolean }> = React.memo(({ floatingIcons, isVisible }) => {
  if (!isVisible || floatingIcons.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {floatingIcons.map(icon => {
        const IconComponent = icon.icon
        return (
          <div
            key={icon.id}
            className="absolute opacity-5"
            style={{
              left: icon.x,
              top: icon.y,
              transform: `rotate(${icon.rotation}deg)`,
            }}
          >
            <IconComponent size={icon.size} />
          </div>
        )
      })}
    </div>
  )
})

// Typewriter Component with loading state
const TypewriterText: React.FC<{ text: string; isVisible: boolean }> = ({ text, isVisible }) => {
  const { displayedText, isTyping } = useTypewriter(text, 80, true)
  
  if (!isVisible) {
    return <div className="h-16 flex items-center justify-center mb-12" />
  }
  
  return (
    <div className="h-16 flex items-center justify-center mb-12">
      <div className="text-xl text-gray-700 font-mono">
        <span>{displayedText}</span>
        <span
          className={`inline-block w-1.5 h-6 bg-orange-500 ml-1 transition-opacity duration-300 ${
            isTyping ? "animate-pulse opacity-100" : "opacity-0"
          }`}
        />
      </div>
    </div>
  )
}

// Background Meshes Component with conditional rendering
const BackgroundMeshes: React.FC<{ scrollY: number; isVisible: boolean }> = React.memo(({ scrollY, isVisible }) => {
  if (!isVisible) return null

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div 
        className="absolute w-96 h-96 rounded-full opacity-20 animate-pulse"
        style={{
          background: 'radial-gradient(circle, rgba(249,115,22,0.3) 0%, rgba(239,68,68,0.1) 70%)',
          top: '10%',
          right: '10%',
          animation: 'float 6s ease-in-out infinite',
          transform: `translateY(${scrollY * 0.1}px)`
        }}
      />
      <div 
        className="absolute w-80 h-80 rounded-full opacity-15 animate-pulse"
        style={{
          background: 'radial-gradient(circle, rgba(59,130,246,0.3) 0%, rgba(147,51,234,0.1) 70%)',
          bottom: '20%',
          left: '15%',
          animation: 'float 8s ease-in-out infinite reverse',
          animationDelay: '2s',
          transform: `translateY(${scrollY * 0.05}px)`
        }}
      />
      <div 
        className="absolute w-64 h-64 rounded-full opacity-10 animate-pulse"
        style={{
          background: 'radial-gradient(circle, rgba(16,185,129,0.3) 0%, rgba(6,182,212,0.1) 70%)',
          top: '50%',
          left: '50%',
          animation: 'float 10s ease-in-out infinite',
          animationDelay: '4s',
          transform: `translateY(${scrollY * 0.08}px)`
        }}
      />
    </div>
  )
})

// Trust Indicators Component
const TrustIndicators: React.FC<{ isVisible: boolean }> = React.memo(({ isVisible }) => {
  if (!isVisible) return null

  return (
    <div className="flex flex-wrap items-center justify-center gap-8 text-lg text-gray-600 mb-12">
      <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
        <Star className="w-5 h-5 text-yellow-500 fill-current animate-pulse" />
        <span className="font-semibold">4.9/5 Rating</span>
      </div>
      <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
        <Users className="w-5 h-5 text-blue-500 animate-pulse" />
        <span className="font-semibold">2M+ Developers</span>
      </div>
      <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
        <Shield className="w-5 h-5 text-green-500 animate-pulse" />
        <span className="font-semibold">Enterprise Ready</span>
      </div>
      <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
        <Globe className="w-5 h-5 text-purple-500 animate-pulse" />
        <span className="font-semibold">Global CDN</span>
      </div>
    </div>
  )
})

// Main Component
export default function Page({ onGetStarted }: LandingPageProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [showAnimations, setShowAnimations] = useState(false)
  const heroRef = useRef<HTMLElement>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Initialize animations hook
  const { particles, floatingIcons, scrollY } = useAnimations(isReady)

  // Staged loading process
  useEffect(() => {
    // Stage 1: Show basic content immediately
    setIsVisible(true)
    
    // Stage 2: Initialize animations after content is visible
    const readyTimeout = setTimeout(() => {
      setIsReady(true)
    }, 300)

    // Stage 3: Show animations after initialization
    const animationTimeout = setTimeout(() => {
      setShowAnimations(true)
    }, 800)

    return () => {
      clearTimeout(readyTimeout)
      clearTimeout(animationTimeout)
    }
  }, [])

  const handleStart = async () => {
    setLoading(true)
    if (onGetStarted) onGetStarted()

    // Simulate delay (optional, remove in real use)
    await new Promise((res) => setTimeout(res, 300))

    router.push("/dashboard")
  }

  // Show loading skeleton until content is ready
  if (!isVisible) {
    return <LoadingSkeleton />
  }
 
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-50 overflow-hidden relative">
      <ParticleField particles={particles} isVisible={showAnimations} />
      <FloatingIcons floatingIcons={floatingIcons} isVisible={showAnimations} />
      <BackgroundMeshes scrollY={scrollY} isVisible={showAnimations} />
      <Navigation onGetStarted={onGetStarted} />
      
      {/* Hero Section */}
      <section ref={heroRef} className="relative z-40 container mx-auto px-6 pt-20 pb-32">
        <div className="text-center mb-20">
          <div
            className={`transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <Badge className="mb-8 bg-gradient-to-r from-orange-500 to-red-600 text-white border-0 px-6 py-3 text-sm hover:scale-105 transition-transform duration-300">
              <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
              New: AI-Powered API Testing & Security Analysis
            </Badge>
            
            <div className="relative">
              <h1 className="text-7xl md:text-8xl font-black text-gray-900 mb-8 leading-tight">
                The Future of
                <span className="relative block">
                  <span className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
                    API Excellence
                  </span>
                  <div className="absolute -bottom-3.5 left-0 w-full h-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full opacity-30 animate-pulse"></div>
                </span>
              </h1>
              
              {showAnimations && (
                <>
                  <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-20 animate-bounce"></div>
                  <div className="absolute -bottom-5 -left-5 w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-15 animate-pulse"></div>
                </>
              )}
            </div>
            
            <p className="text-2xl text-gray-600 mb-10 max-w-4xl mx-auto leading-relaxed">
              Professional API testing, monitoring, and management platform. 
              <span className="text-orange-600 font-semibold"> Built for developers who demand speed, security, and simplicity.</span>
            </p>

            <TypewriterText text="Test APIs like a pro with our powerful testing suite" isVisible={isReady} />
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
              <Button
                size="lg"
                onClick={handleStart}
                disabled={loading}
                className={`bg-gradient-to-r from-orange-500 to-red-600 text-white text-xl px-12 py-8 shadow-2xl transition-all duration-300 group ${
                  loading ? "opacity-60 cursor-not-allowed" : "hover:scale-105 hover:shadow-3xl"
                }`}
              >
                {loading ? (
                  <>
                    <span className="animate-spin mr-3 w-5 h-5 border-2 border-t-white border-b-white rounded-full" />
                    Loading...
                  </>
                ) : (
                  <>
                    <Rocket className="mr-3 h-6 w-6 group-hover:animate-bounce" />
                    Start Testing APIs
                    <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-orange-200 text-orange-600 hover:bg-orange-50 text-xl px-12 py-8 bg-white/80 backdrop-blur-sm hover:border-orange-300 transition-all duration-300 group"
              >
                <Play className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" />
                Watch Demo
              </Button>
            </div>

            <TrustIndicators isVisible={isReady} />
          </div>
        </div>

        {/* API Dashboard Demo */}
        {isReady && <ApiGatewayDashboard />}
      </section>
     
      {/* Other sections - wrapped in conditional rendering for better performance */}
      {isReady && (
        <>
          <FeaturesSection />
          <StatsSection />
          <WorksSection />
          <SecurityFeature />
          <TestimonialSec />
          <IntegrationsSection />
          <PriceSection />
          <FooterSection />
        </>
      )}
     
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  )
}