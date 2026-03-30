"use client"

import { useState, useEffect } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Search, Clock, Folder, Plus, MoreVertical, Globe,
  ChevronRight, FileCode, FolderOpen, List, Hash,
  CheckCircle2, Settings2, FolderPlus, FilePlus, MoreHorizontal, Hexagon
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks"
import { fetchCollections } from "@/lib/store/slices/collectionsSlice"
import { fetchLogs } from "@/lib/store/slices/logsSlice"
import { apiClient } from "@/lib/api/client"
import { cn } from "@/lib/utils"

interface Collection {
  id: string
  name: string
  items?: (FolderItem | RequestItem)[]
}

interface FolderItem {
  id: string
  name: string
  type: "folder"
  children?: (FolderItem | RequestItem)[]
}

interface RequestItem {
  id: string
  name: string
  type: "request"
  method: string
  url: string
  headers?: any
  body?: string
}

interface RequestHistorySidebarProps {
  onRequestSelect?: (req: any) => void
  onNewGraphql?: () => void
  onNewHttp?: () => void
  onOpenVariables?: () => void
  onOpenEnvironment?: () => void
}

export function RequestHistorySidebar({
  onRequestSelect,
  onNewGraphql,
  onNewHttp,
  onOpenVariables,
  onOpenEnvironment,
}: RequestHistorySidebarProps) {
  const dispatch = useAppDispatch()
  const { collections } = useAppSelector((state) => state.collections)
  const { logs } = useAppSelector((state) => state.logs)
  const { activeWorkspaceId } = useAppSelector((state) => state.workspaces)
  const [structuredCollections, setStructuredCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeSection, setActiveSection] = useState<"collections" | "history" | "environments">("collections")

  // Dialog States
  const [isAddRequestOpen, setIsAddRequestOpen] = useState(false)
  const [addRequestTarget, setAddRequestTarget] = useState<{ collectionId: string, folderId?: string } | null>(null)
  const [newRequestName, setNewRequestName] = useState("")
  const [newRequestType, setNewRequestType] = useState("http")

  const [isAddFolderOpen, setIsAddFolderOpen] = useState(false)
  const [addFolderTarget, setAddFolderTarget] = useState<{ collectionId: string, parentFolderId?: string } | null>(null)
  const [newFolderName, setNewFolderName] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        if (activeWorkspaceId) {
          await dispatch(fetchCollections(activeWorkspaceId))
        }
        await dispatch(fetchLogs({ limit: 20, workspaceId: activeWorkspaceId || undefined }))
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [dispatch, activeWorkspaceId])

  const structureData = async () => {
    const structured = await Promise.all(
      collections.map(async (col) => {
        try {
          // First test if collection exists and user has access
          console.log("Testing collection access for:", col.id);
          const collection = await apiClient.getCollection(col.id);
          console.log("Collection access OK:", collection);
          
          // Then get the tree structure
          console.log("Fetching tree for collection:", col.id);
          const tree = await apiClient.getCollectionTree(col.id);
          console.log("Tree fetched successfully:", tree);
          
          return {
            ...col,
            items: [
              ...(tree?.folders?.map((f: any) => ({ ...f, type: "folder" })) || []),
              ...(tree?.requests?.map((r: any) => ({ ...r, type: "request" })) || []),
            ],
          };
        } catch (err) {
          console.error("Failed to map structure for collection", col.id, err);
          const error = err as any;
          console.error("Error details:", {
            message: error?.message || 'Unknown error',
            status: error?.status,
            response: error?.response
          });
          return { ...col, items: [] };
        }
      })
    )
    setStructuredCollections(structured)
    setLoading(false)
  }

  useEffect(() => {
    if (collections.length > 0) {
      structureData()
    } else {
      setStructuredCollections([])
      setLoading(false)
    }
  }, [collections])

  const refreshStructure = async () => {
    if (collections.length > 0) {
      await structureData();
    }
  }

  const openAddRequestDialog = (e: React.MouseEvent, collectionId: string, folderId?: string) => {
    e.stopPropagation()
    setAddRequestTarget({ collectionId, folderId })
    setNewRequestName("")
    setNewRequestType("http")
    setIsAddRequestOpen(true)
  }

  const openAddFolderDialog = (e: React.MouseEvent, collectionId: string, parentFolderId?: string) => {
    e.stopPropagation()
    setAddFolderTarget({ collectionId, parentFolderId })
    setNewFolderName("")
    setIsAddFolderOpen(true)
  }

  const submitCreateRequest = async () => {
    if (!newRequestName || !addRequestTarget) return
    try {
      await apiClient.createSavedRequest(
        addRequestTarget.collectionId,
        addRequestTarget.folderId || undefined,
        {
          name: newRequestName,
          method: newRequestType === "graphql" ? "POST" : "GET",
          url: "https://api.example.com/endpoint",
          headers: {},
          body: null,
          params: {},
          auth: {},
        }
      )
      setIsAddRequestOpen(false)
      await refreshStructure()
    } catch (err) {
      console.error(err)
    }
  }

  const submitCreateFolder = async () => {
    if (!newFolderName || !addFolderTarget) return
    try {
      await apiClient.createFolder(addFolderTarget.collectionId, newFolderName)
      setIsAddFolderOpen(false)
      await refreshStructure()
    } catch (err) {
      console.error(err)
    }
  }

  const handleCreateCollection = async () => {
    if (!activeWorkspaceId) {
      alert("No active workspace to create a collection in");
      return;
    }
    const name = prompt("Enter collection name:")
    if (!name) return
    try {
      await apiClient.createCollection(activeWorkspaceId, name)
      await dispatch(fetchCollections(activeWorkspaceId))
    } catch (error) {
      console.error("Failed to create collection:", error)
    }
  }

  const getMethodColor = (method: string) => {
    const colors: Record<string, string> = {
      GET: "text-emerald-400 bg-emerald-400/10",
      POST: "text-amber-400 bg-amber-400/10",
      PUT: "text-blue-400 bg-blue-400/10",
      DELETE: "text-red-400 bg-red-400/10",
      PATCH: "text-violet-400 bg-violet-400/10",
    }
    return colors[method] || "text-muted-foreground bg-muted"
  }

  const FolderTreeItem = ({ item, level = 0 }: { item: FolderItem | RequestItem; level?: number }) => {
    const [isOpen, setIsOpen] = useState(false)

    if (item.type === "request") {
      return (
        <div
          className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-accent cursor-pointer transition-colors group"
          style={{ paddingLeft: `${level * 12 + 8}px` }}
          onClick={() => onRequestSelect?.(item)}
        >
          <span className={cn("text-[9px] font-bold px-1 py-0.5 rounded", getMethodColor((item as RequestItem).method || "GET"))}>
            {(item as RequestItem).method || "GET"}
          </span>
          <span className="text-[11px] truncate flex-1 text-foreground/80 group-hover:text-foreground">
            {item.name}
          </span>
        </div>
      )
    }

    return (
      <div style={{ paddingLeft: `${level * 8}px` }}>
        <div
          className="flex items-center gap-1.5 py-1.5 px-2 rounded hover:bg-accent cursor-pointer transition-colors group"
          onClick={() => setIsOpen(!isOpen)}
        >
          <ChevronRight className={cn("h-3 w-3 text-muted-foreground transition-transform shrink-0", isOpen && "rotate-90")} />
          {isOpen ? (
            <FolderOpen className="h-3.5 w-3.5 text-primary/70 shrink-0" />
          ) : (
            <Folder className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          )}
          <span className="text-[11px] font-medium flex-1 truncate">{item.name}</span>
          
          {/* Folder actions */}
          <div className="opacity-0 group-hover:opacity-100 flex items-center pr-1 transition-opacity shrink-0" onClick={(e) => e.stopPropagation()}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div role="button" tabIndex={0} className="h-5 w-5 rounded hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground outline-none cursor-pointer">
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[140px] text-[11px] border-border bg-card shadow-xl p-1">
                <DropdownMenuItem onClick={(e) => openAddRequestDialog(e as any, (item as any).collectionId, item.id)} className="text-[11px] cursor-pointer py-1.5 px-2 flex items-center gap-2 hover:bg-accent focus:bg-accent rounded">
                  <FilePlus className="h-3.5 w-3.5 opacity-70" /> Add request
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => openAddFolderDialog(e as any, (item as any).collectionId, item.id)} className="text-[11px] cursor-pointer py-1.5 px-2 flex items-center gap-2 hover:bg-accent focus:bg-accent rounded">
                  <FolderPlus className="h-3.5 w-3.5 opacity-70" /> Add folder
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {isOpen && (item as FolderItem).children && (
          <div className="mt-0.5 space-y-0.5">
            {(item as FolderItem).children!.map((child) => (
              <FolderTreeItem key={child.id} item={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Top toolbar */}
      <div className="flex items-center justify-between px-2 py-1.5 border-b border-border">
        <div className="flex items-center gap-0.5">
          <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
            <List className="w-3.5 h-3.5" />
          </button>
          <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
            <Hash className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="relative flex-1 mx-1">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
          <Input
            placeholder="Search"
            className="pl-7 h-7 text-[11px] bg-accent/30 border-transparent focus:border-primary/30"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={handleCreateCollection}
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      <ScrollArea className="flex-1">
        <div className="py-1">
          {/* Collections section */}
          {loading ? (
            <div className="px-4 py-8 flex flex-col items-center justify-center gap-2 text-muted-foreground/40">
              <div className="h-4 w-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              <span className="text-[10px] font-medium">Loading...</span>
            </div>
          ) : (
            <div>
              {structuredCollections.map((collection) => (
                <Accordion key={collection.id} type="multiple" className="border-none relative group/root">
                  <AccordionItem value={collection.id} className="border-none relative">
                    <AccordionTrigger className="py-1.5 px-2 hover:no-underline hover:bg-accent/30 text-[11px] font-semibold flex items-center pr-8 [&>svg]:hidden">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0 transition-transform duration-200 group-data-[state=open]/root:rotate-90" />
                        <span className="truncate flex-1 text-left">{collection.name}</span>
                      </div>
                    </AccordionTrigger>
                    {/* Positioned OUTSIDE AccordionTrigger to prevent nested button hydration errors */}
                    <div className="absolute top-1 right-2 opacity-0 group-hover/root:opacity-100 flex items-center transition-opacity z-10" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <div role="button" tabIndex={0} className="h-5 w-5 rounded hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground outline-none cursor-pointer">
                            <Plus className="h-3.5 w-3.5" />
                          </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[140px] text-[11px] border-border bg-card shadow-xl p-1">
                          <DropdownMenuItem onClick={(e) => openAddRequestDialog(e as any, collection.id)} className="text-[11px] cursor-pointer py-1.5 px-2 flex items-center gap-2 hover:bg-accent focus:bg-accent rounded">
                            <FilePlus className="h-3.5 w-3.5 opacity-70" /> Add request
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => openAddFolderDialog(e as any, collection.id)} className="text-[11px] cursor-pointer py-1.5 px-2 flex items-center gap-2 hover:bg-accent focus:bg-accent rounded">
                            <FolderPlus className="h-3.5 w-3.5 opacity-70" /> Add folder
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    <AccordionContent className="pb-1 pt-0">
                      <div className="ml-2 pl-2 border-l border-border/50">
                        {collection.items?.length ? (
                          collection.items.map((item) => (
                            <FolderTreeItem key={item.id} item={item} />
                          ))
                        ) : (
                          <div className="py-2 pl-4 text-[10px] text-muted-foreground/40 italic">Empty collection</div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ))}

              {/* Untitled request */}
              <div
                className="flex items-center gap-2 py-1.5 px-3 rounded mx-1 hover:bg-accent cursor-pointer transition-colors"
                onClick={() => onNewHttp?.()}
              >
                <span className={cn("text-[9px] font-bold px-1 py-0.5 rounded", getMethodColor("GET"))}>GET</span>
                <span className="text-[11px] text-foreground/80">Untitled request</span>
              </div>
            </div>
          )}

          {/* Environments section */}
          <div className="mt-4 border-t border-border pt-2">
            <div
              className="flex items-center gap-2 py-1.5 px-3 hover:bg-accent cursor-pointer transition-colors rounded mx-1"
              onClick={onOpenEnvironment}
            >
              <Globe className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-[11px] font-medium flex-1">Global Environment</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div
              className="flex items-center gap-2 py-1.5 px-3 hover:bg-accent cursor-pointer transition-colors rounded mx-1"
              onClick={onOpenEnvironment}
            >
              <Settings2 className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-[11px] font-medium flex-1">New Environment</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
          </div>

          {/* History section */}
          <div className="mt-4 border-t border-border pt-2">
            <div className="flex items-center gap-2 px-3 py-1.5 mb-1">
              <Clock className="h-3.5 w-3.5 text-muted-foreground/60" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">History</span>
            </div>
            {logs.length === 0 ? (
              <div className="px-4 py-4 text-center text-[10px] text-muted-foreground/40 italic">
                No request history
              </div>
            ) : (
              logs.slice(0, 15).map((log) => (
                <div
                  key={log.id}
                  className="flex items-center gap-2 py-1.5 px-3 hover:bg-accent cursor-pointer transition-colors rounded mx-1 group"
                  onClick={() =>
                    onRequestSelect?.({
                      name: log.requestUrl?.split("/").pop() || "Request",
                      method: log.requestMethod,
                      url: log.requestUrl || "",
                    })
                  }
                >
                  <span className={cn("text-[9px] font-bold px-1 py-0.5 rounded shrink-0", getMethodColor(log.requestMethod))}>
                    {log.requestMethod}
                  </span>
                  <span className="text-[11px] truncate flex-1 text-foreground/70 group-hover:text-foreground">
                    {log.requestUrl?.split("/").pop() || "Request"}
                  </span>
                  <Badge
                    variant={log.responseStatus < 400 ? "default" : "destructive"}
                    className={cn(
                      "text-[8px] font-bold h-4 px-1 rounded",
                      log.responseStatus < 400
                        ? "bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/20"
                        : "bg-red-500/15 text-red-400 hover:bg-red-500/20"
                    )}
                  >
                    {log.responseStatus}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </div>
      </ScrollArea>
      {/* DIALOGS FOR CREATION */}
      <Dialog open={isAddRequestOpen} onOpenChange={setIsAddRequestOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Request</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="req-name">Request Name</Label>
              <Input
                id="req-name"
                value={newRequestName}
                onChange={(e) => setNewRequestName(e.target.value)}
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && submitCreateRequest()}
              />
            </div>
            <div className="grid gap-2">
              <Label>Request Type</Label>
              <Select value={newRequestType} onValueChange={setNewRequestType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="http">
                    <div className="flex items-center gap-2"><FileCode className="w-4 h-4 text-emerald-500" /> HTTP Request</div>
                  </SelectItem>
                  <SelectItem value="graphql">
                    <div className="flex items-center gap-2"><Hexagon className="w-4 h-4 text-pink-500" /> GraphQL Request</div>
                  </SelectItem>
                  <SelectItem value="environment">
                    <div className="flex items-center gap-2"><Globe className="w-4 h-4 text-blue-500" /> Environment</div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddRequestOpen(false)}>Cancel</Button>
            <Button onClick={submitCreateRequest}>Create Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddFolderOpen} onOpenChange={setIsAddFolderOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="folder-name">Folder Name</Label>
              <Input
                id="folder-name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && submitCreateFolder()}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddFolderOpen(false)}>Cancel</Button>
            <Button onClick={submitCreateFolder}>Create Folder</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
