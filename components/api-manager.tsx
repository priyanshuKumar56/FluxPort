"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Globe } from "lucide-react"

interface ApiRoute {
  id: string
  name: string
  method: string
  path: string
  description: string
  status: "active" | "inactive"
}

const initialRoutes: ApiRoute[] = [
  {
    id: "1",
    name: "Get Users",
    method: "GET",
    path: "/api/users",
    description: "Retrieve all users",
    status: "active",
  },
  {
    id: "2",
    name: "Create User",
    method: "POST",
    path: "/api/users",
    description: "Create a new user",
    status: "active",
  },
  {
    id: "3",
    name: "Update User",
    method: "PUT",
    path: "/api/users/:id",
    description: "Update user by ID",
    status: "inactive",
  },
]

export function ApiManager() {
  const [routes, setRoutes] = useState<ApiRoute[]>(initialRoutes)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingRoute, setEditingRoute] = useState<ApiRoute | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    method: "GET",
    path: "",
    description: "",
  })

  const handleAddRoute = () => {
    setEditingRoute(null)
    setFormData({ name: "", method: "GET", path: "", description: "" })
    setIsDialogOpen(true)
  }

  const handleEditRoute = (route: ApiRoute) => {
    setEditingRoute(route)
    setFormData({
      name: route.name,
      method: route.method,
      path: route.path,
      description: route.description,
    })
    setIsDialogOpen(true)
  }

  const handleSaveRoute = () => {
    if (editingRoute) {
      // Update existing route
      setRoutes(routes.map((route) => (route.id === editingRoute.id ? { ...route, ...formData } : route)))
    } else {
      // Add new route
      const newRoute: ApiRoute = {
        id: Date.now().toString(),
        ...formData,
        status: "active",
      }
      setRoutes([...routes, newRoute])
    }
    setIsDialogOpen(false)
  }

  const handleDeleteRoute = (id: string) => {
    setRoutes(routes.filter((route) => route.id !== id))
  }

  const toggleRouteStatus = (id: string) => {
    setRoutes(
      routes.map((route) =>
        route.id === id ? { ...route, status: route.status === "active" ? "inactive" : "active" } : route,
      ),
    )
  }

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET":
        return "bg-green-100 text-green-800"
      case "POST":
        return "bg-blue-100 text-blue-800"
      case "PUT":
        return "bg-yellow-100 text-yellow-800"
      case "DELETE":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">API Manager</h1>
          <p className="text-muted-foreground">Manage your API routes and endpoints</p>
        </div>
        <Button onClick={handleAddRoute}>
          <Plus className="mr-2 h-4 w-4" />
          Add Route
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Routes</p>
                <p className="text-2xl font-bold">{routes.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-full bg-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{routes.filter((r) => r.status === "active").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-full bg-gray-400" />
              <div>
                <p className="text-sm text-muted-foreground">Inactive</p>
                <p className="text-2xl font-bold">{routes.filter((r) => r.status === "inactive").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Routes Table */}
      <Card>
        <CardHeader>
          <CardTitle>API Routes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Path</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {routes.map((route) => (
                <TableRow key={route.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{route.name}</div>
                      <div className="text-sm text-muted-foreground">{route.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getMethodColor(route.method)}>{route.method}</Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{route.path}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => toggleRouteStatus(route.id)}>
                      <Badge variant={route.status === "active" ? "default" : "secondary"}>{route.status}</Badge>
                    </Button>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEditRoute(route)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteRoute(route.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingRoute ? "Edit Route" : "Add New Route"}</DialogTitle>
            <DialogDescription>Configure your API endpoint settings.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                className="col-span-3"
                placeholder="Route name"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="method" className="text-right">
                Method
              </Label>
              <Select
                value={formData.method}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, method: value }))}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                  <SelectItem value="PATCH">PATCH</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="path" className="text-right">
                Path
              </Label>
              <Input
                id="path"
                value={formData.path}
                onChange={(e) => setFormData((prev) => ({ ...prev, path: e.target.value }))}
                className="col-span-3"
                placeholder="/api/endpoint"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                className="col-span-3"
                placeholder="Describe this endpoint"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSaveRoute}>{editingRoute ? "Update Route" : "Create Route"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
