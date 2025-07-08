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
  Code,
  Server,
  Lock,
  Eye,
  AlertTriangle,
  Settings,
  Clock,
  BarChart3,
  Bell,
  Download,
  Upload,
  Database,
  FileText,
  Users,
  Webhook,
  RefreshCw,
  Monitor,
  Gauge,
  Target,
  Shield as ShieldIcon,
  BookOpen,
  Layers,
  GitBranch,
  Folder,
  History,
  Terminal,
  Cpu,
  Network,
  HardDrive,
  Zap as ZapIcon,
  CloudLightning,
  Timer,
  TrendingUp,
  UserCheck,
  KeyRound,
  ShieldCheck,
  Ban,
  List,
  FileCheck,
  Bug,
  Wrench,
  HelpCircle,
  MessageSquare,
  Mail,
  Phone,
  Github,
  Twitter,
  Linkedin,
  BookMarked,
  Lightbulb,
  Rocket,
  Award,
  Users2,
  Building,
  CreditCard,
  Package,
  Sparkles,
  Infinity,
  Crown,
  Gem
} from "lucide-react"
import { toast } from "sonner"

export default function DocumentationPage() {
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

      case "introduction":
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold mb-4">Introduction</h1>
              <p className="text-lg text-muted-foreground mb-8">
                Learn about Fluxport Dashboard and how it can transform your API development workflow.
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Rocket className="h-5 w-5 text-blue-500" />
                  Why Choose Fluxport?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <Zap className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Lightning Fast</h3>
                        <p className="text-sm text-muted-foreground">
                          Built for speed with modern architecture and optimized performance.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <Shield className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Enterprise Security</h3>
                        <p className="text-sm text-muted-foreground">
                          Advanced security features with compliance-ready audit trails.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                        <Users2 className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Team Collaboration</h3>
                        <p className="text-sm text-muted-foreground">
                          Share collections, environments, and collaborate seamlessly.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                        <BarChart3 className="h-4 w-4 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Advanced Analytics</h3>
                        <p className="text-sm text-muted-foreground">
                          Deep insights into API performance and usage patterns.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <Code className="h-8 w-8 text-blue-500 mb-3" />
                    <h4 className="font-semibold mb-2">API Testing</h4>
                    <p className="text-sm text-muted-foreground">
                      Comprehensive REST client with advanced request building and response analysis.
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <Activity className="h-8 w-8 text-green-500 mb-3" />
                    <h4 className="font-semibold mb-2">Real-time Monitoring</h4>
                    <p className="text-sm text-muted-foreground">
                      Monitor API health, performance, and uptime with instant alerts.
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <Key className="h-8 w-8 text-purple-500 mb-3" />
                    <h4 className="font-semibold mb-2">Token Management</h4>
                    <p className="text-sm text-muted-foreground">
                      Secure token storage and management with automatic refresh capabilities.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "quick-start":
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold mb-4">Quick Start Guide</h1>
              <p className="text-lg text-muted-foreground mb-8">
                Get up and running with Fluxport Dashboard in minutes.
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Timer className="h-5 w-5 text-green-500" />
                  5-Minute Setup
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-6">
                  <div className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center font-bold">
                      1
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">Create Your First Project</h3>
                      <p className="text-muted-foreground mb-3">
                        Start by creating a new project to organize your APIs and requests.
                      </p>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm font-mono">Dashboard → New Project → Enter Project Name</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-blue-500 text-white flex items-center justify-center font-bold">
                      2
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">Test Your First API</h3>
                      <p className="text-muted-foreground mb-3">
                        Use our built-in REST client to make your first API request.
                      </p>
                      <div className="bg-gray-900 text-gray-100 p-3 rounded-lg font-mono text-sm">
                        <div className="text-green-400">GET</div>
                        <div className="text-blue-400">https://jsonplaceholder.typicode.com/posts/1</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center justify-center font-bold">
                      3
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">Set Up Monitoring</h3>
                      <p className="text-muted-foreground mb-3">
                        Enable real-time monitoring to track your API's performance.
                      </p>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm font-mono">Monitoring → Add Endpoint → Configure Alerts</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sample APIs for Testing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">JSONPlaceholder API</h4>
                      <Badge variant="secondary">Public</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      A fake REST API for testing and prototyping.
                    </p>
                    <div className="bg-gray-900 text-gray-100 p-3 rounded-lg font-mono text-sm">
                      <div className="text-green-400">GET https://jsonplaceholder.typicode.com/posts</div>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">ReqRes API</h4>
                      <Badge variant="secondary">Public</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      A hosted REST API ready to respond to your AJAX requests.
                    </p>
                    <div className="bg-gray-900 text-gray-100 p-3 rounded-lg font-mono text-sm">
                      <div className="text-green-400">GET https://reqres.in/api/users</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "installation":
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold mb-4">Installation</h1>
              <p className="text-lg text-muted-foreground mb-8">
                Multiple ways to get started with Fluxport Dashboard.
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-500" />
                  Web Application (Recommended)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-2">✅ No Installation Required</h4>
                  <p className="text-green-800 text-sm">
                    Access Fluxport Dashboard directly from your browser. No downloads, no setup - just start testing!
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Instant access from any device</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Always up-to-date</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Cross-platform compatibility</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5 text-purple-500" />
                  Desktop Application
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  For advanced users who prefer a native desktop experience.
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg text-center">
                    <h4 className="font-semibold mb-2">Windows</h4>
                    <Button className="w-full" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download .exe
                    </Button>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <h4 className="font-semibold mb-2">macOS</h4>
                    <Button className="w-full" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download .dmg
                    </Button>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <h4 className="font-semibold mb-2">Linux</h4>
                    <Button className="w-full" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download .AppImage
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Terminal className="h-5 w-5 text-orange-500" />
                  CLI Tool
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Command-line interface for automation and scripting.
                </p>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 text-gray-400 hover:text-white"
                    onClick={() => copyCode("npm install -g fluxport-cli")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <div className="space-y-2">
                    <div className="text-green-400"># Install via NPM</div>
                    <div>npm install -g fluxport-cli</div>
                    <div className="text-green-400"># Or via Homebrew (macOS)</div>
                    <div>brew install fluxport</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "first-request":
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold mb-4">Your First API Request</h1>
              <p className="text-lg text-muted-foreground mb-8">
                Step-by-step guide to making your first API request with Fluxport.
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5 text-green-500" />
                  Let's Make a Request!
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
                    <h4 className="font-semibold text-blue-900 mb-2">Step 1: Open the API Tester</h4>
                    <p className="text-blue-800 text-sm">
                      Navigate to the API Tester section in the left sidebar. This is where all the magic happens!
                    </p>
                  </div>

                  <div className="p-4 border-l-4 border-green-500 bg-green-50">
                    <h4 className="font-semibold text-green-900 mb-2">Step 2: Enter Your URL</h4>
                    <p className="text-green-800 text-sm mb-3">
                      In the URL field, enter the endpoint you want to test. Let's start with a simple example:
                    </p>
                    <div className="bg-white p-3 rounded-lg border">
                      <code className="text-sm">https://jsonplaceholder.typicode.com/posts/1</code>
                    </div>
                  </div>

                  <div className="p-4 border-l-4 border-purple-500 bg-purple-50">
                    <h4 className="font-semibold text-purple-900 mb-2">Step 3: Choose Your Method</h4>
                    <p className="text-purple-800 text-sm">
                      Select the HTTP method from the dropdown. For this example, we'll use GET.
                    </p>
                  </div>

                  <div className="p-4 border-l-4 border-orange-500 bg-orange-50">
                    <h4 className="font-semibold text-orange-900 mb-2">Step 4: Send the Request</h4>
                    <p className="text-orange-800 text-sm">
                      Click the "Send" button and watch the magic happen! You'll see the response in the panel below.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Understanding the Response</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Activity className="h-4 w-4 text-green-500" />
                      Status Code
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      The HTTP status code indicates the result of your request (200 = success, 404 = not found, etc.)
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-500" />
                      Response Time
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      How long it took for the server to respond to your request.
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-purple-500" />
                      Response Body
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      The actual data returned by the API, formatted and syntax-highlighted.
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <List className="h-4 w-4 text-orange-500" />
                      Headers
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      HTTP headers sent by the server, including content type, caching info, etc.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Example Response</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
                  <div className="text-green-400 mb-2">Status: 200 OK | Time: 145ms</div>
                  <div className="text-blue-400 mb-2">Content-Type: application/json</div>
                  <div className="text-gray-300">{`{
  "userId": 1,
  "id": 1,
  "title": "sunt aut facere repellat provident",
  "body": "quia et suscipit..."
}`}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "rest-clients":
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

      case "request-builder":
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold mb-4">Request Builder</h1>
              <p className="text-lg text-muted-foreground mb-8">
                Build complex API requests with our intuitive visual interface
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5 text-blue-500" />
                  Building Your Request
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Globe className="h-4 w-4 text-green-500" />
                        URL Configuration
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Enter your API endpoint URL. Supports variables and environment switching.
                      </p>
                      <div className="bg-gray-100 p-2 rounded text-sm font-mono">
                        {'{{baseUrl}}/api/v1/users'}
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Settings className="h-4 w-4 text-purple-500" />
                        Query Parameters
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Add query parameters with key-value pairs. Toggle individual parameters on/off.
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-500" />
                        Headers
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Configure request headers including authentication and content type.
                      </p>
                      <div className="text-xs space-y-1">
                        <div className="flex justify-between">
                          <span>Content-Type:</span>
                          <span className="text-muted-foreground">application/json</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Authorization:</span>
                          <span className="text-muted-foreground">Bearer {'{{token}}'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Code className="h-4 w-4 text-orange-500" />
                        Request Body
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Support for JSON, XML, form data, and raw text with syntax highlighting.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pre-request Scripts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Execute JavaScript code before sending your request. Perfect for dynamic authentication tokens or data manipulation.
                </p>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
                  <div className="text-green-400 mb-2">// Generate timestamp</div>
                  <div className="text-blue-400">const timestamp = Date.now();</div>
                  <div className="text-purple-400">pm.environment.set("timestamp", timestamp);</div>
                  <div className="text-green-400 mt-2">// Calculate signature</div>
                  <div className="text-blue-400">const signature = CryptoJS.SHA256(data + timestamp);</div>
                  <div className="text-purple-400">pm.request.headers.add("X-Signature", signature);</div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "response-viewer":
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold mb-4">Response Viewer</h1>
              <p className="text-lg text-muted-foreground mb-8">
                Analyze API responses with powerful visualization and inspection tools
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-green-500" />
                  Response Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-500 mb-2">200</div>
                    <div className="text-sm text-muted-foreground">Status Code</div>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-500 mb-2">245ms</div>
                    <div className="text-sm text-muted-foreground">Response Time</div>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-500 mb-2">1.2KB</div>
                    <div className="text-sm text-muted-foreground">Response Size</div>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-2xl font-bold text-orange-500 mb-2">JSON</div>
                    <div className="text-sm text-muted-foreground">Content Type</div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Response Body</h4>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
                      <div className="text-purple-400">{`{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "created_at": "2024-01-15T10:30:00Z"
}`}</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Response Headers</h4>
                    <div className="bg-gray-50 p-4 rounded-lg text-sm space-y-2">
                      <div className="flex justify-between">
                        <span className="font-mono">content-type:</span>
                        <span className="text-muted-foreground">application/json</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-mono">cache-control:</span>
                        <span className="text-muted-foreground">max-age=300</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-mono">server:</span>
                        <span className="text-muted-foreground">nginx/1.18.0</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Visualization Options</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Code className="h-4 w-4 text-blue-500" />
                      Pretty Print
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Automatic formatting and syntax highlighting for JSON, XML, and HTML responses.
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Search className="h-4 w-4 text-green-500" />
                      Search & Filter
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Quickly find specific values in large response bodies with built-in search.
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Download className="h-4 w-4 text-purple-500" />
                      Export Options
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Save responses as files or copy specific parts to clipboard.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "request-history":
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold mb-4">Request History</h1>
              <p className="text-lg text-muted-foreground mb-8">
                Track, organize, and replay your API requests with comprehensive history management
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5 text-blue-500" />
                  Automatic Request Tracking
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                          <span className="text-green-600 font-bold text-sm">GET</span>
                        </div>
                        <div>
                          <div className="font-semibold">Get User Profile</div>
                          <div className="text-sm text-muted-foreground">api.example.com/users/123</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">200</Badge>
                        <span className="text-sm text-muted-foreground">2 min ago</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 font-bold text-sm">POST</span>
                        </div>
                        <div>
                          <div className="font-semibold">Create New User</div>
                          <div className="text-sm text-muted-foreground">api.example.com/users</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">201</Badge>
                        <span className="text-sm text-muted-foreground">5 min ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>History Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Search & Filter</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Search className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">Search by URL, method, or status code</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Settings className="h-4 w-4 text-purple-500" />
                        <span className="text-sm">Filter by date range or response time</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">Mark favorites for quick access</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Export & Share</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Download className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Export history as JSON or CSV</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Upload className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">Import requests from other tools</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-purple-500" />
                        <span className="text-sm">Share requests with team members</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "endpoints":
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold mb-4">Managing Endpoints</h1>
              <p className="text-lg text-muted-foreground mb-8">
                Organize and manage your API endpoints with powerful organization tools
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-500" />
                  Endpoint Organization
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Environment Management</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Switch between development, staging, and production environments seamlessly.
                      </p>
                      <div className="flex gap-2">
                        <Badge variant="outline">Development</Badge>
                        <Badge variant="secondary">Staging</Badge>
                        <Badge>Production</Badge>
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Base URL Configuration</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Set up base URLs for different environments and services.
                      </p>
                      <div className="bg-gray-100 p-2 rounded text-sm font-mono">
                        dev: https://api-dev.example.com
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Endpoint Groups</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Group related endpoints together for better organization.
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Folder className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">User Management</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Folder className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Authentication</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Folder className="h-4 w-4 text-purple-500" />
                          <span className="text-sm">Payment Processing</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Documentation</h4>
                      <p className="text-sm text-muted-foreground">
                        Add descriptions, examples, and documentation for each endpoint.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Endpoint Templates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">REST API</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Standard REST endpoints with CRUD operations.
                    </p>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-green-600">GET</span>
                        <span>/users</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-600">POST</span>
                        <span>/users</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-yellow-600">PUT</span>
                        <span>/users/:id</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-red-600">DELETE</span>
                        <span>/users/:id</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">GraphQL</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      GraphQL query and mutation templates.
                    </p>
                    <div className="bg-gray-100 p-2 rounded text-xs font-mono">
                      query GetUser($id: ID!) {`{
  user(id: $id) {
    name
    email
  }
}`}
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Webhooks</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Webhook endpoint configuration and testing.
                    </p>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-purple-600">POST</span>
                        <span>/webhooks/stripe</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-600">POST</span>
                        <span>/webhooks/github</span>
                      </div>
                    </div>
                  </div>
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
                  <span className="text-white text-sm font-bold">FP</span>
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
