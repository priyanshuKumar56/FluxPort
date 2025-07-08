"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Zap, Shield, Globe, Activity, Play, Star, Users, Rocket, Database, Lock } from "lucide-react"

export function LandingPage() {
  const [isVisible, setIsVisible] = useState(false)
  const [currentFeature, setCurrentFeature] = useState(0)

  useEffect(() => {
    setIsVisible(true)
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % 4)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const features = [
    {
      icon: Zap,
      title: "Lightning Fast API Testing",
      description: "Test any REST API endpoint with our Postman-like interface",
      color: "text-yellow-500",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "JWT tokens, rate limiting, and advanced security features",
      color: "text-green-500",
    },
    {
      icon: Globe,
      title: "Global API Management",
      description: "Manage all your APIs from one centralized dashboard",
      color: "text-blue-500",
    },
    {
      icon: Activity,
      title: "Real-time Monitoring",
      description: "Live analytics and performance monitoring",
      color: "text-purple-500",
    },
  ]

  const stats = [
    { label: "API Requests", value: "10M+", icon: Database },
    { label: "Active Users", value: "50K+", icon: Users },
    { label: "Uptime", value: "99.9%", icon: Activity },
    { label: "Security Score", value: "A+", icon: Lock },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-50">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-gradient-to-r from-blue-400 to-purple-600 opacity-20 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 300 + 50}px`,
                height: `${Math.random() * 300 + 50}px`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${Math.random() * 3 + 2}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between p-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-white text-sm font-bold">AG</span>
          </div>
          <span className="text-white font-bold text-xl">Fluxport</span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="text-white hover:bg-white/10">
            Documentation
          </Button>
          <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
            Get Started
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-6 pt-20 pb-32">
        <div className="text-center mb-16">
          <div
            className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <Badge className="mb-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
              ✨ Now with AI-Powered API Testing
            </Badge>
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
              The Future of
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {" "}
                API Management
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Professional API testing, monitoring, and management platform. Built for developers who demand speed,
              security, and simplicity.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8 py-6"
              >
                <Play className="mr-2 h-5 w-5" />
                Start Testing APIs
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 text-lg px-8 py-6 bg-transparent"
              >
                <Star className="mr-2 h-5 w-5" />
                View Demo
              </Button>
            </div>
          </div>
        </div>

        {/* Animated Dashboard Preview */}
        <div
          className={`transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="relative max-w-6xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-2xl blur-3xl"></div>
            <Card className="relative bg-white/10 backdrop-blur-xl border-white/20 overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-4 flex items-center gap-2">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="flex-1 text-center">
                    <span className="text-gray-300 text-sm font-mono">api-gateway-dashboard.vercel.app</span>
                  </div>
                </div>

                {/* Animated Interface */}
                <div className="p-8 bg-gradient-to-br from-slate-50 to-blue-50">
                  <div className="grid grid-cols-12 gap-6 h-96">
                    {/* Sidebar */}
                    <div className="col-span-3 bg-white rounded-lg shadow-lg p-4">
                      <div className="space-y-3">
                        {["API Tester", "Monitoring", "Security", "Tokens"].map((item, i) => (
                          <div
                            key={item}
                            className={`p-2 rounded transition-all duration-500 ${
                              currentFeature === i ? "bg-blue-500 text-white" : "bg-gray-100"
                            }`}
                          >
                            <div className="text-sm font-medium">{item}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Main Content */}
                    <div className="col-span-9 bg-white rounded-lg shadow-lg p-6">
                      <div className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                        <div className="h-8 bg-gradient-to-r from-blue-200 to-purple-200 rounded mb-4"></div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="h-32 bg-gray-100 rounded"></div>
                          <div className="h-32 bg-gray-100 rounded"></div>
                        </div>
                        <div className="mt-4 h-4 bg-gray-200 rounded w-3/4"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 py-32 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Everything you need for API management</h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              From testing to monitoring, security to analytics - we've got you covered
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className={`bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/20 transition-all duration-500 hover:scale-105 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6 text-center">
                  <feature.icon className={`h-12 w-12 mx-auto mb-4 ${feature.color}`} />
                  <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-gray-300 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative z-10 py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`text-center transition-all duration-500 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <stat.icon className="h-8 w-8 mx-auto mb-4 text-blue-400" />
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 py-32">
        <div className="container mx-auto px-6 text-center">
          <div
            className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <h2 className="text-4xl font-bold text-white mb-6">Ready to supercharge your API workflow?</h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of developers who trust our platform for their API management needs
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-12 py-6"
            >
              <Rocket className="mr-2 h-5 w-5" />
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
