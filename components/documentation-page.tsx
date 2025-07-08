"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Search,
  Zap,
  Globe,
  Key,
  Activity,
  Shield,
  Play,
  Copy,
  ExternalLink,
  ChevronRight,
  Star,
  CheckCircle,
} from "lucide-react"
import { toast } from "sonner"

export function DocumentationPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeSection, setActiveSection] = useState("getting-started")

  const sections = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: Play,
      items: [
        { id: "introduction", title: "Introduction" },
        { id: "quick-start", title: "Quick Start Guide" },
        { id: "installation", title: "Installation" },
        { id: "first-request", title: "Your First API Request" },
      ],
    },
    {
      id: "api-testing",
      title: "API Testing",
      icon: Zap,
      items: [
        { id: "rest-client", title: "REST Client" },
        { id: "request-builder", title: "Request Builder" },
        { id: "response-viewer", title: "Response Viewer" },
        { id: "request-history", title: "Request History" },
      ],
    },
    {
      id: "api-management",
      title: "API Management",
      icon: Globe,
      items: [
        { id: "endpoints", title: "Managing Endpoints" },
        { id: "routes", title: "Route Configuration" },
        { id: "openapi", title: "OpenAPI Integration" },
        { id: "collections", title: "Request Collections" },
      ],
    },
    {
      id: "authentication",
      title: "Authentication",
      icon: Key,
      items: [
        { id: "jwt-tokens", title: "JWT Tokens" },
        { id: "api-keys", title: "API Keys" },
        { id: "oauth", title: "OAuth 2.0" },
        { id: "token-management", title: "Token Management" },
      ],
    },
    {
      id: "monitoring",
      title: "Monitoring",
      icon: Activity,
      items: [
        { id: "real-time", title: "Real-time Monitoring" },
        { id: "analytics", title: "Analytics Dashboard" },
        { id: "alerts", title: "Alerts & Notifications" },
        { id: "performance", title: "Performance Metrics" },
      ],
    },
    {
      id: "security",
      title: "Security",
      icon: Shield,
      items: [
        { id: "rate-limiting", title: "Rate Limiting" },
        { id: "ip-blocking", title: "IP Blocking" },
        { id: "security-rules", title: "Security Rules" },
        { id: "audit-logs", title: "Audit Logs" },
      ],
    },
  ]

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    toast.success("Code copied to clipboard!")
  }

  const renderContent = () => {
    switch (activeSection) {
      case "getting-started":
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold mb-4">Getting Started</h1>
              <p className="text-lg text-muted-foreground mb-8">
                Welcome to Fluxport Dashboard - your complete solution for API testing, management, and monitoring.
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  What is Fluxport Dashboard?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Fluxport Dashboard is a comprehensive platform that combines the best features of Postman, Kong UI,
                  and modern API management tools. It provides:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Professional API Testing</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Real-time Monitoring</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Advanced Security</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Token Management</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>OpenAPI Integration</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Enterprise Features</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Start Guide</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                      1
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Access the Dashboard</h3>
                      <p className="text-muted-foreground">
                        Open your browser and navigate to the Fluxport Dashboard. No installation required!
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                      2
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Make Your First Request</h3>
                      <p className="text-muted-foreground">
                        Click on "API Tester" in the sidebar, enter a URL, and hit "Send" to test your first API.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                      3
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Explore Features</h3>
                      <p className="text-muted-foreground">
                        Discover monitoring, token management, security features, and more!
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">💡 Pro Tip</h4>
                  <p className="text-blue-800 text-sm">
                    Start with the "Localhost Setup" guide if you want to test local APIs. We provide ready-to-use
                    server examples in Python and Node.js!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "rest-client":
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold mb-4">REST Client</h1>
              <p className="text-lg text-muted-foreground mb-8">
                Professional API testing with a Postman-like interface
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Making HTTP Requests</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3">Basic Request</h3>
                  <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 text-gray-400 hover:text-white"
                      onClick={() => copyCode("GET https://api.example.com/users")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <div className="space-y-2">
                      <div>
                        <span className="text-green-400">GET</span> https://api.example.com/users
                      </div>
                      <div className="text-gray-400"># Click "Send" to execute the request</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">POST Request with Body</h3>
                  <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 text-gray-400 hover:text-white"
                      onClick={() =>
                        copyCode(`POST https://api.example.com/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com"
}`)
                      }
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <div className="space-y-2">
                      <div>
                        <span className="text-blue-400">POST</span> https://api.example.com/users
                      </div>
                      <div>
                        <span className="text-yellow-400">Content-Type:</span> application/json
                      </div>
                      <div className="text-gray-400"># Request Body:</div>
                      <div className="pl-4 text-purple-400">{`{
  "name": "John Doe",
  "email": "john@example.com"
}`}</div>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Supported Methods</h4>
                    <div className="space-y-2">
                      {["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"].map((method) => (
                        <Badge key={method} variant="outline">
                          {method}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Response Formats</h4>
                    <div className="space-y-2">
                      {["JSON", "XML", "HTML", "Text", "Binary"].map((format) => (
                        <Badge key={format} variant="secondary">
                          {format}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Advanced Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Headers Management</h4>
                    <p className="text-sm text-muted-foreground">
                      Add custom headers, authentication tokens, and content types
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Query Parameters</h4>
                    <p className="text-sm text-muted-foreground">Easily add and manage URL query parameters</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Request History</h4>
                    <p className="text-sm text-muted-foreground">Automatically saves all requests for easy replay</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold mb-4">Documentation</h1>
              <p className="text-lg text-muted-foreground">Select a section from the sidebar to get started</p>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded bg-blue-600 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">AG</span>
                </div>
                <span className="font-bold text-xl">Fluxport Docs</span>
              </div>
              <Badge variant="secondary">v2.0</Badge>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search documentation..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline">
                <ExternalLink className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="col-span-3">
            <div className="sticky top-24">
              <ScrollArea className="h-[calc(100vh-8rem)]">
                <div className="space-y-4">
                  {sections.map((section) => (
                    <div key={section.id}>
                      <Button
                        variant={activeSection === section.id ? "default" : "ghost"}
                        className="w-full justify-start mb-2"
                        onClick={() => setActiveSection(section.id)}
                      >
                        <section.icon className="h-4 w-4 mr-2" />
                        {section.title}
                      </Button>
                      {section.items && (
                        <div className="ml-6 space-y-1">
                          {section.items.map((item) => (
                            <Button
                              key={item.id}
                              variant="ghost"
                              size="sm"
                              className="w-full justify-start text-sm text-muted-foreground hover:text-foreground"
                              onClick={() => setActiveSection(item.id)}
                            >
                              <ChevronRight className="h-3 w-3 mr-2" />
                              {item.title}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-9">
            <div className="max-w-4xl">{renderContent()}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
