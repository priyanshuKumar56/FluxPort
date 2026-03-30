"use client"

import { useState, useEffect } from "react"
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
  Loader2,
  Trash2,
} from "lucide-react"
import { toast } from "sonner"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import {
  fetchCollections,
  fetchCollectionTree,
  createCollection,
  createFolder,
  createSavedRequest,
  deleteCollection,
  clearCurrentCollection
} from "@/lib/store/slices/collectionsSlice"

interface PostmanCollectionsSidebarProps {
  onRequestSelect: (request: any) => void
}

interface ExpandedState {
  [key: string]: boolean
}

export function PostmanCollectionsSidebar({ onRequestSelect }: PostmanCollectionsSidebarProps) {
  const dispatch = useAppDispatch()
  const { collections, currentCollection, loading } = useAppSelector((state) => state.collections)
  const { activeWorkspaceId } = useAppSelector((state) => state.workspaces)

  const [searchTerm, setSearchTerm] = useState("")
  const [newItemName, setNewItemName] = useState("")
  const [newItemType, setNewItemType] = useState<"collection" | "folder" | "request">("collection")
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null)
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [expandedCollections, setExpandedCollections] = useState<ExpandedState>({})

  // Load collections when workspace changes
  useEffect(() => {
    if (activeWorkspaceId) {
      dispatch(fetchCollections(activeWorkspaceId))
    }
  }, [dispatch, activeWorkspaceId])

  // Load collection tree when expanded
  const handleToggleCollection = async (collectionId: string) => {
    const isExpanded = expandedCollections[collectionId]
    setExpandedCollections(prev => ({ ...prev, [collectionId]: !isExpanded }))

    if (!isExpanded && collectionId !== currentCollection?.id) {
      dispatch(fetchCollectionTree(collectionId))
    }
  }

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

  const handleRequestClick = (request: any) => {
    onRequestSelect({
      id: request.id,
      name: request.name,
      method: request.method,
      url: request.url,
      headers: request.headers || {},
      body: request.body,
      query_params: request.query_params,
      auth_type: request.auth_type,
      auth_config: request.auth_config,
    })
  }

  const createNewItem = async () => {
    if (!newItemName.trim()) {
      toast.error("Please enter a name")
      return
    }

    if (!activeWorkspaceId) {
      toast.error("No workspace selected")
      return
    }

    try {
      if (newItemType === "collection") {
        await dispatch(createCollection({
          workspaceId: activeWorkspaceId,
          name: newItemName.trim()
        })).unwrap()
        toast.success("Collection created successfully")
      } else if (newItemType === "folder" && selectedCollectionId) {
        await dispatch(createFolder({
          collectionId: selectedCollectionId,
          name: newItemName.trim(),
          parent_folder_id: selectedFolderId || undefined
        })).unwrap()
        toast.success("Folder created successfully")
        // Refresh collection tree
        dispatch(fetchCollectionTree(selectedCollectionId))
      } else if (newItemType === "request" && selectedCollectionId) {
        await dispatch(createSavedRequest({
          collectionId: selectedCollectionId,
          folderId: selectedFolderId || undefined,
          data: {
            name: newItemName.trim(),
            method: "GET",
            url: "https://api.example.com/endpoint",
            headers: {},
            auth_type: "none"
          }
        })).unwrap()
        toast.success("Request created successfully")
        // Refresh collection tree
        dispatch(fetchCollectionTree(selectedCollectionId))
      }

      setNewItemName("")
      setShowCreateDialog(false)
      setSelectedCollectionId(null)
      setSelectedFolderId(null)
    } catch (error) {
      toast.error("Failed to create item")
      console.error(error)
    }
  }

  const handleDeleteCollection = async (id: string) => {
    try {
      await dispatch(deleteCollection(id)).unwrap()
      toast.success("Collection deleted successfully")
      if (currentCollection?.id === id) {
        dispatch(clearCurrentCollection())
      }
    } catch (error) {
      toast.error("Failed to delete collection")
    }
  }

  const filteredCollections = collections.filter((collection) =>
    collection.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const openCreateDialog = (type: "collection" | "folder" | "request", collectionId?: string, folderId?: string) => {
    setNewItemType(type)
    setSelectedCollectionId(collectionId || null)
    setSelectedFolderId(folderId || null)
    setShowCreateDialog(true)
  }

  return (
    <div className="border-r border-gray-200 bg-white flex flex-col w-full h-full">
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
                  onClick={() => openCreateDialog("collection")}
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
                        disabled={!selectedCollectionId}
                      >
                        Folder
                      </Button>
                      <Button
                        variant={newItemType === "request" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setNewItemType("request")}
                        disabled={!selectedCollectionId}
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
        <div className="p-2">
          {loading && collections.length === 0 ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : filteredCollections.length === 0 ? (
            <div className="text-center p-8 text-gray-500">
              <Folder className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No collections found</p>
              <p className="text-xs mt-1">Create a collection to get started</p>
            </div>
          ) : (
            filteredCollections.map((collection) => (
              <div key={collection.id}>
                {/* Collection Header */}
                <div
                  className="flex items-center gap-2 py-1.5 px-2 hover:bg-gray-100 cursor-pointer group text-sm font-medium"
                  onClick={() => handleToggleCollection(collection.id)}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleToggleCollection(collection.id)
                    }}
                  >
                    {expandedCollections[collection.id] ? (
                      <ChevronDown className="h-3 w-3" />
                    ) : (
                      <ChevronRight className="h-3 w-3" />
                    )}
                  </Button>
                  {expandedCollections[collection.id] ? (
                    <FolderOpen className="h-4 w-4 text-yellow-600" />
                  ) : (
                    <Folder className="h-4 w-4 text-yellow-600" />
                  )}
                  <span className="flex-1 truncate">{collection.name}</span>
                  {collection.request_count !== undefined && (
                    <Badge variant="secondary" className="text-xs">
                      {collection.request_count}
                    </Badge>
                  )}
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
                      <DropdownMenuItem onClick={() => openCreateDialog("folder", collection.id)}>
                        <FolderPlus className="h-4 w-4 mr-2" />
                        Add Folder
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openCreateDialog("request", collection.id)}>
                        <FilePlus className="h-4 w-4 mr-2" />
                        Add Request
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteCollection(collection.id)} className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Collection Content */}
                {expandedCollections[collection.id] && currentCollection?.id === collection.id && (
                  <div className="ml-4">
                    {/* Folders */}
                    {currentCollection.folders?.map((folder) => (
                      <div key={folder.id}>
                        <div className="flex items-center gap-2 py-1 px-2 hover:bg-gray-100 cursor-pointer group text-sm">
                          <div className="w-4" />
                          <Folder className="h-4 w-4 text-blue-600" />
                          <span className="flex-1 truncate">{folder.name}</span>
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
                              <DropdownMenuItem onClick={() => openCreateDialog("request", collection.id, folder.id)}>
                                <FilePlus className="h-4 w-4 mr-2" />
                                Add Request
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        {/* Requests in folder */}
                        {folder.requests?.map((request) => (
                          <div
                            key={request.id}
                            className="flex items-center gap-2 py-1 px-2 hover:bg-gray-100 cursor-pointer group text-sm"
                            style={{ paddingLeft: "32px" }}
                            onClick={() => handleRequestClick(request)}
                          >
                            <div className="w-4" />
                            <File className="h-4 w-4 text-gray-500" />
                            <Badge className={`${getMethodColor(request.method)} text-xs px-1 py-0 h-5 min-w-12 justify-center`}>
                              {request.method}
                            </Badge>
                            <span className="flex-1 truncate">{request.name}</span>
                          </div>
                        ))}
                      </div>
                    ))}
                    {/* Root Requests */}
                    {currentCollection.requests?.map((request) => (
                      <div
                        key={request.id}
                        className="flex items-center gap-2 py-1 px-2 hover:bg-gray-100 cursor-pointer group text-sm"
                        style={{ paddingLeft: "16px" }}
                        onClick={() => handleRequestClick(request)}
                      >
                        <div className="w-4" />
                        <File className="h-4 w-4 text-gray-500" />
                        <Badge className={`${getMethodColor(request.method)} text-xs px-1 py-0 h-5 min-w-12 justify-center`}>
                          {request.method}
                        </Badge>
                        <span className="flex-1 truncate">{request.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
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
