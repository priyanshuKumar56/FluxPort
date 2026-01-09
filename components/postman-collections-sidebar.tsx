"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  Plus,
  Search,
  MoreHorizontal,
  Star,
  Globe,
  Database,
  Settings,
  File,
  FolderPlus,
  FilePlus,
} from "lucide-react"
import { toast } from "sonner"

interface Collection {
  id: string
  name: string
  type: "collection" | "folder" | "request"
  method?: string
  url?: string
  children?: Collection[]
  expanded?: boolean
  starred?: boolean
}

interface PostmanCollectionsSidebarProps {
  onRequestSelect: (request: any) => void
}

export function PostmanCollectionsSidebar({ onRequestSelect }: PostmanCollectionsSidebarProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [newItemName, setNewItemName] = useState("")
  const [newItemType, setNewItemType] = useState<"collection" | "folder" | "request">("collection")
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [collections, setCollections] = useState<Collection[]>([
    {
      id: "workspace-1",
      name: "My Workspace",
      type: "collection",
      expanded: true,
      children: [
        {
          id: "collection-1",
          name: "Fluxport Tests",
          type: "collection",
          expanded: true,
          starred: true,
          children: [
            {
              id: "folder-1",
              name: "Authentication",
              type: "folder",
              expanded: false,
              children: [
                {
                  id: "req-1",
                  name: "Login",
                  type: "request",
                  method: "POST",
                  url: "https://api.example.com/auth/login",
                },
                {
                  id: "req-2",
                  name: "Refresh Token",
                  type: "request",
                  method: "POST",
                  url: "https://api.example.com/auth/refresh",
                },
              ],
            },
            {
              id: "folder-2",
              name: "Users",
              type: "folder",
              expanded: true,
              children: [
                {
                  id: "req-3",
                  name: "Get Users",
                  type: "request",
                  method: "GET",
                  url: "https://jsonplaceholder.typicode.com/users",
                },
                {
                  id: "req-4",
                  name: "Create User",
                  type: "request",
                  method: "POST",
                  url: "https://jsonplaceholder.typicode.com/users",
                },
                {
                  id: "req-5",
                  name: "Update User",
                  type: "request",
                  method: "PUT",
                  url: "https://jsonplaceholder.typicode.com/users/1",
                },
                {
                  id: "req-6",
                  name: "Delete User",
                  type: "request",
                  method: "DELETE",
                  url: "https://jsonplaceholder.typicode.com/users/1",
                },
              ],
            },
            {
              id: "req-7",
              name: "Health Check",
              type: "request",
              method: "GET",
              url: "http://localhost:3000/api/health",
            },
          ],
        },
        {
          id: "collection-2",
          name: "Localhost Tests",
          type: "collection",
          expanded: false,
          children: [
            {
              id: "req-8",
              name: "Local API Health",
              type: "request",
              method: "GET",
              url: "http://localhost:8080/health",
            },
            {
              id: "req-9",
              name: "Local Database",
              type: "request",
              method: "GET",
              url: "http://localhost:3000/api/users",
            },
          ],
        },
      ],
    },
  ])

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET":
        return "bg-green-100 text-green-800 border-green-200"
      case "POST":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "PUT":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "DELETE":
        return "bg-red-100 text-red-800 border-red-200"
      case "PATCH":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const toggleExpanded = (id: string) => {
    const updateCollections = (items: Collection[]): Collection[] => {
      return items.map((item) => {
        if (item.id === id) {
          return { ...item, expanded: !item.expanded }
        }
        if (item.children) {
          return { ...item, children: updateCollections(item.children) }
        }
        return item
      })
    }
    setCollections(updateCollections(collections))
  }

  const handleRequestClick = (request: Collection) => {
    if (request.type === "request") {
      onRequestSelect({
        id: request.id,
        name: request.name,
        method: request.method,
        url: request.url,
      })
    }
  }

  const createNewItem = () => {
    if (!newItemName.trim()) {
      toast.error("Please enter a name")
      return
    }

    const newItem: Collection = {
      id: `${newItemType}-${Date.now()}`,
      name: newItemName.trim(),
      type: newItemType,
      expanded: false,
      children: newItemType !== "request" ? [] : undefined,
      method: newItemType === "request" ? "GET" : undefined,
      url: newItemType === "request" ? "https://api.example.com/endpoint" : undefined,
    }

    const addToCollections = (items: Collection[]): Collection[] => {
      if (!selectedParentId) {
        // Add to root
        return [...items, newItem]
      }

      return items.map((item) => {
        if (item.id === selectedParentId) {
          return {
            ...item,
            children: [...(item.children || []), newItem],
            expanded: true,
          }
        }
        if (item.children) {
          return {
            ...item,
            children: addToCollections(item.children),
          }
        }
        return item
      })
    }

    setCollections(addToCollections(collections))
    setNewItemName("")
    setShowCreateDialog(false)
    setSelectedParentId(null)
    toast.success(`${newItemType.charAt(0).toUpperCase() + newItemType.slice(1)} created successfully`)
  }

  const deleteItem = (id: string) => {
    const removeFromCollections = (items: Collection[]): Collection[] => {
      return items
        .filter((item) => item.id !== id)
        .map((item) => ({
          ...item,
          children: item.children ? removeFromCollections(item.children) : undefined,
        }))
    }

    setCollections(removeFromCollections(collections))
    toast.success("Item deleted successfully")
  }

  const renderCollection = (item: Collection, depth = 0) => {
    const paddingLeft = depth * 16 + 8

    return (
      <div key={item.id}>
        <div
          className={`flex items-center gap-2 py-1 px-2 hover:bg-gray-100 cursor-pointer group ${
            item.type === "request" ? "text-sm" : "text-sm font-medium"
          }`}
          style={{ paddingLeft }}
          onClick={() => {
            if (item.type === "request") {
              handleRequestClick(item)
            } else {
              toggleExpanded(item.id)
            }
          }}
        >
          {item.children && item.children.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0"
              onClick={(e) => {
                e.stopPropagation()
                toggleExpanded(item.id)
              }}
            >
              {item.expanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            </Button>
          )}

          {!item.children && <div className="w-4" />}

          {item.type === "collection" && (
            <div className="flex items-center gap-1">
              {item.expanded ? <FolderOpen className="h-4 w-4" /> : <Folder className="h-4 w-4" />}
              {item.starred && <Star className="h-3 w-3 text-yellow-500 fill-current" />}
            </div>
          )}

          {item.type === "folder" && (
            <div className="flex items-center gap-1">
              {item.expanded ? (
                <FolderOpen className="h-4 w-4 text-blue-600" />
              ) : (
                <Folder className="h-4 w-4 text-blue-600" />
              )}
            </div>
          )}

          {item.type === "request" && (
            <>
              <File className="h-4 w-4 text-gray-500" />
              {item.method && (
                <Badge className={`${getMethodColor(item.method)} text-xs px-1 py-0 h-5 min-w-12 justify-center`}>
                  {item.method}
                </Badge>
              )}
            </>
          )}

          <span className="flex-1 truncate">{item.name}</span>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  setSelectedParentId(item.id)
                  setNewItemType("request")
                  setShowCreateDialog(true)
                }}
              >
                <FilePlus className="h-4 w-4 mr-2" />
                Add Request
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedParentId(item.id)
                  setNewItemType("folder")
                  setShowCreateDialog(true)
                }}
              >
                <FolderPlus className="h-4 w-4 mr-2" />
                Add Folder
              </DropdownMenuItem>
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
              <DropdownMenuItem>Rename</DropdownMenuItem>
              <DropdownMenuItem onClick={() => deleteItem(item.id)} className="text-red-600">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {item.expanded && item.children && (
          <div>{item.children.map((child) => renderCollection(child, depth + 1))}</div>
        )}
      </div>
    )
  }

  const filteredCollections = collections.filter((collection) =>
    collection.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="border-r border-gray-200 bg-white flex flex-col w-full">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-900">Collections</h2>
          <div className="flex items-center gap-1">
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => {
                    setSelectedParentId(null)
                    setNewItemType("collection")
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New {newItemType.charAt(0).toUpperCase() + newItemType.slice(1)}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Type</label>
                    <div className="flex gap-2">
                      <Button
                        variant={newItemType === "collection" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setNewItemType("collection")}
                      >
                        Collection
                      </Button>
                      <Button
                        variant={newItemType === "folder" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setNewItemType("folder")}
                      >
                        Folder
                      </Button>
                      <Button
                        variant={newItemType === "request" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setNewItemType("request")}
                      >
                        Request
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Name</label>
                    <Input
                      placeholder={`Enter ${newItemType} name`}
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          createNewItem()
                        }
                      }}
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={createNewItem}>Create</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search collections..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-8"
          />
        </div>
      </div>

      {/* Collections List */}
      <ScrollArea className="flex-1">
        <div className="p-2">{filteredCollections.map((collection) => renderCollection(collection))}</div>
      </ScrollArea>

      {/* Quick Actions */}
      <div className="p-4 border-t border-gray-200">
        <div className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start bg-transparent"
            onClick={() =>
              onRequestSelect({
                id: "new-get",
                name: "New GET Request",
                method: "GET",
                url: "https://jsonplaceholder.typicode.com/posts/1",
              })
            }
          >
            <Globe className="h-4 w-4 mr-2" />
            New HTTP Request
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start bg-transparent"
            onClick={() =>
              onRequestSelect({
                id: "new-localhost",
                name: "Localhost Test",
                method: "GET",
                url: "http://localhost:3000/api/health",
              })
            }
          >
            <Database className="h-4 w-4 mr-2" />
            Test Localhost
          </Button>
        </div>
      </div>
    </div>
  )
}
