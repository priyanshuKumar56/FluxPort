"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Upload, Download, Eye, RefreshCw } from "lucide-react"

const mockOpenApiSpec = {
  openapi: "3.0.0",
  info: {
    title: "Fluxport",
    version: "1.0.0",
    description: "Smart Fluxport with advanced observability",
  },
  servers: [
    {
      url: "https://api.gateway.com/v1",
      description: "Production server",
    },
  ],
  paths: {
    "/users": {
      get: {
        summary: "Get all users",
        tags: ["Users"],
        responses: {
          "200": {
            description: "List of users",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/User",
                  },
                },
              },
            },
          },
        },
      },
      post: {
        summary: "Create a new user",
        tags: ["Users"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreateUser",
              },
            },
          },
        },
        responses: {
          "201": {
            description: "User created successfully",
          },
        },
      },
    },
    "/auth/login": {
      post: {
        summary: "User login",
        tags: ["Authentication"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string" },
                  password: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Login successful",
          },
        },
      },
    },
  },
  components: {
    schemas: {
      User: {
        type: "object",
        properties: {
          id: { type: "integer" },
          name: { type: "string" },
          email: { type: "string" },
        },
      },
      CreateUser: {
        type: "object",
        properties: {
          name: { type: "string" },
          email: { type: "string" },
        },
        required: ["name", "email"],
      },
    },
  },
}

export function OpenApiDocs() {
  const [uploadedSpec, setUploadedSpec] = useState<any>(mockOpenApiSpec)
  const [specUrl, setSpecUrl] = useState("")

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const spec = JSON.parse(e.target?.result as string)
          setUploadedSpec(spec)
        } catch (error) {
          console.error("Invalid JSON file")
        }
      }
      reader.readAsText(file)
    }
  }

  const fetchSpecFromUrl = async () => {
    if (!specUrl) return
    try {
      // Simulate fetching from URL
      console.log("Fetching spec from:", specUrl)
      // In real implementation, you would fetch from the URL
    } catch (error) {
      console.error("Failed to fetch spec")
    }
  }

  const generateRoutes = () => {
    // Simulate generating routes from OpenAPI spec
    console.log("Generating routes from OpenAPI spec")
  }

  const getMethodColor = (method: string) => {
    switch (method.toLowerCase()) {
      case "get":
        return "bg-green-100 text-green-800"
      case "post":
        return "bg-blue-100 text-blue-800"
      case "put":
        return "bg-yellow-100 text-yellow-800"
      case "delete":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">OpenAPI Documentation</h2>
          <p className="text-muted-foreground">Import and manage OpenAPI specifications</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={generateRoutes}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Generate Routes
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Spec
          </Button>
        </div>
      </div>

      <Tabs defaultValue="upload" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upload">Upload/Import</TabsTrigger>
          <TabsTrigger value="viewer">Spec Viewer</TabsTrigger>
          <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
        </TabsList>

        <TabsContent value="upload">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Upload OpenAPI Spec</CardTitle>
                <CardDescription>Upload a JSON or YAML OpenAPI specification file</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="spec-file">OpenAPI File</Label>
                  <Input id="spec-file" type="file" accept=".json,.yaml,.yml" onChange={handleFileUpload} />
                </div>
                <Button className="w-full">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Specification
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Import from URL</CardTitle>
                <CardDescription>Fetch OpenAPI spec from a remote URL</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="spec-url">Specification URL</Label>
                  <Input
                    id="spec-url"
                    placeholder="https://api.example.com/openapi.json"
                    value={specUrl}
                    onChange={(e) => setSpecUrl(e.target.value)}
                  />
                </div>
                <Button className="w-full" onClick={fetchSpecFromUrl}>
                  <Download className="mr-2 h-4 w-4" />
                  Fetch Specification
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="viewer">
          <Card>
            <CardHeader>
              <CardTitle>OpenAPI Specification</CardTitle>
              <CardDescription>View and edit your OpenAPI specification</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96 w-full rounded-md border p-4">
                <pre className="text-sm">{JSON.stringify(uploadedSpec, null, 2)}</pre>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="endpoints">
          <Card>
            <CardHeader>
              <CardTitle>API Endpoints</CardTitle>
              <CardDescription>Endpoints extracted from your OpenAPI specification</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {uploadedSpec?.paths &&
                  Object.entries(uploadedSpec.paths).map(([path, methods]: [string, any]) => (
                    <div key={path} className="border rounded-lg p-4">
                      <div className="font-mono font-medium mb-3">{path}</div>
                      <div className="space-y-2">
                        {Object.entries(methods).map(([method, details]: [string, any]) => (
                          <div key={method} className="flex items-center justify-between p-2 bg-muted rounded">
                            <div className="flex items-center gap-3">
                              <Badge className={getMethodColor(method)}>{method.toUpperCase()}</Badge>
                              <span className="text-sm">{details.summary || "No summary"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {details.tags?.map((tag: string) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
