"use client"

import { useState, useEffect } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Clock, Folder, Plus, MoreVertical, Globe, ChevronRight, FileCode, FolderOpen } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
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
}

export function RequestHistorySidebar({ onRequestSelect }: RequestHistorySidebarProps) {
  const dispatch = useAppDispatch()
  const { collections } = useAppSelector((state) => state.collections)
  const { logs } = useAppSelector((state) => state.logs)
  const [structuredCollections, setStructuredCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedEnvironment, setSelectedEnvironment] = useState("staging")

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        await dispatch(fetchCollections())
        await dispatch(fetchLogs({ limit: 20 }))
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [dispatch])

  useEffect(() => {
    const structureData = async () => {
      const structured = await Promise.all(
        collections.map(async (col) => {
          const folders = await apiClient.getFolders(col.id)
          const reqs = await apiClient.getSavedRequests(col.id)

          return {
            ...col,
            items: [
              ...(folders?.map((f) => ({ ...f, type: "folder" })) || []),
              ...(reqs?.map((r) => ({ ...r, type: "request" })) || []),
            ],
          }
        }),
      )
      setStructuredCollections(structured)
      setLoading(false)
    }

    if (collections.length > 0) {
      structureData()
    }
  }, [collections])

  const handleCreateCollection = async () => {
    const name = prompt("Enter collection name:")
    if (!name) return

    try {
      await apiClient.createCollection(name)
      await dispatch(fetchCollections())
      // Refresh structured collections
      const updatedCollections = await apiClient.getCollections()
      const structured = await Promise.all(
        updatedCollections.map(async (col) => {
          const folders = await apiClient.getFolders(col.id)
          const reqs = await apiClient.getSavedRequests(col.id)
          return {
            ...col,
            items: [
              ...(folders?.map((f) => ({ ...f, type: "folder" })) || []),
              ...(reqs?.map((r) => ({ ...r, type: "request" })) || []),
            ],
          }
        }),
      )
      setStructuredCollections(structured)
    } catch (error) {
      console.error('Failed to create collection:', error)
    }
  }

  const handleCreateFolder = async (collectionId: string) => {
    const name = prompt("Enter folder name:")
    if (!name) return

    try {
      await apiClient.createFolder(name, collectionId)
      await dispatch(fetchCollections())
      // Refresh structured collections
      const updatedCollections = await apiClient.getCollections()
      const structured = await Promise.all(
        updatedCollections.map(async (col) => {
          const folders = await apiClient.getFolders(col.id)
          const reqs = await apiClient.getSavedRequests(col.id)
          return {
            ...col,
            items: [
              ...(folders?.map((f) => ({ ...f, type: "folder" })) || []),
              ...(reqs?.map((r) => ({ ...r, type: "request" })) || []),
            ],
          }
        }),
      )
      setStructuredCollections(structured)
    } catch (error) {
      console.error('Failed to create folder:', error)
    }
  }

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET":
        return "text-green-500"
      case "POST":
        return "text-yellow-500"
      case "PUT":
        return "text-blue-500"
      case "DELETE":
        return "text-red-500"
      case "PATCH":
        return "text-purple-500"
      default:
        return "text-gray-500"
    }
  }

  // Recursive component to render nested folders
  const FolderTreeItem = ({ item, level = 0 }: { item: FolderItem | RequestItem; level?: number }) => {
    const [isOpen, setIsOpen] = useState(false)

    if (item.type === "request") {
      return (
        <div
          className="flex items-center gap-2 p-2 pl-4 rounded-md hover:bg-accent cursor-pointer transition-colors group"
          style={{ paddingLeft: `${level * 16 + 8}px` }}
        >
          <FileCode className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <span className={`text-[10px] font-bold w-12 ${getMethodColor(item.method || "GET")}`}>{item.method}</span>
          <span className="text-xs truncate flex-1">{item.name}</span>
        </div>
      )
    }

    return (
      <div style={{ paddingLeft: `${level * 8}px` }}>
        <div
          className="flex items-center gap-2 p-2 rounded-md hover:bg-accent cursor-pointer transition-colors group"
          onClick={() => setIsOpen(!isOpen)}
        >
          <ChevronRight
            className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${isOpen ? "rotate-90" : ""}`}
          />
          {isOpen ? (
            <FolderOpen className="h-3.5 w-3.5 text-primary" />
          ) : (
            <Folder className="h-3.5 w-3.5 text-muted-foreground" />
          )}
          <span className="text-xs font-medium flex-1">{item.name}</span>
          <Badge variant="outline" className="text-[9px] px-1 h-4">
            {item.children?.length || 0}
          </Badge>
        </div>
        {isOpen && item.children && (
          <div className="mt-1 space-y-0.5">
            {item.children.map((child) => (
              <FolderTreeItem key={child.id} item={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-card/20 backdrop-blur-xl border-r border-border/50">
      <div className="p-5 space-y-5 border-b border-border/50 bg-muted/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <Globe className="h-4 w-4 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/60 leading-none mb-1">Environment</span>
              <span className="text-xs font-bold text-foreground tracking-tight uppercase">{selectedEnvironment}</span>
            </div>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10 transition-colors">
              <Plus className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10 transition-colors">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Search collections..."
            className="pl-9 h-10 text-xs bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all rounded-xl"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <ScrollArea className="flex-1 px-2 py-4">
        <div className="space-y-8">
          <div>
            <div className="flex items-center justify-between px-3 mb-4">
              <div className="flex items-center gap-2">
                <Folder className="h-4 w-4 text-primary/60" />
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/80">Collections</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 hover:bg-primary/10 rounded-lg transition-all"
                onClick={handleCreateCollection}
              >
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>

            {loading ? (
              <div className="px-4 py-8 flex flex-col items-center justify-center gap-3 text-muted-foreground/40 italic">
                <div className="h-4 w-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                <span className="text-[10px] font-medium tracking-wider uppercase">Loading Workspace...</span>
              </div>
            ) : (
              <Accordion type="multiple" className="space-y-1.5">
                {structuredCollections.map((collection) => (
                  <AccordionItem key={collection.id} value={collection.id} className="border-none px-1">
                    <div className="flex items-center group pr-1 rounded-xl transition-all hover:bg-primary/5">
                      <AccordionTrigger className="py-2.5 px-3 hover:no-underline text-xs font-bold flex-1 transition-all">
                        <div className="flex items-center gap-3">
                          <div className="p-1 rounded-md bg-primary/5 text-primary">
                            <Folder className="h-3.5 w-3.5 fill-current" />
                          </div>
                          <span className="truncate max-w-[120px]">{collection.name}</span>
                        </div>
                      </AccordionTrigger>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 opacity-0 group-hover:opacity-100 hover:bg-primary/10 rounded-lg transition-all"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleCreateFolder(collection.id)
                        }}
                      >
                        <Plus className="h-3.5 w-3.5 text-primary" />
                      </Button>
                    </div>
                    <AccordionContent className="pb-2 pt-1">
                      <div className="space-y-1 ml-2 border-l-2 border-primary/10 pl-2 mt-1">
                        {collection.items?.length ? (
                          collection.items.map((item) => (
                            <FolderTreeItem key={item.id} item={item} />
                          ))
                        ) : (
                          <div className="py-2 pl-4 text-[10px] text-muted-foreground/40 font-medium uppercase tracking-tighter">Empty folder</div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 px-3 mb-4">
              <div className="p-1 rounded-md bg-secondary/10">
                <Clock className="h-4 w-4 text-secondary" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/80">Request History</span>
            </div>

            <div className="space-y-1 px-1">
              {logs.length === 0 ? (
                <div className="px-4 py-8 flex flex-col items-center justify-center gap-2 text-muted-foreground/30 border-2 border-dashed rounded-2xl">
                  <Clock className="h-8 w-8 opacity-10" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">No Sessions</span>
                </div>
              ) : (
                logs.map((log) => (
                  <div
                    key={log.id}
                    className="flex justify-between items-center gap-3 px-3 py-3 rounded-xl hover:bg-primary/5 border border-transparent hover:border-primary/10 cursor-pointer transition-all animate-in fade-in slide-in-from-left-2 group"
                    onClick={() => onRequestSelect?.({
                      name: log.requestUrl.split('/').pop() || 'Request',
                      method: log.requestMethod,
                      url: log.requestUrl,
                    })}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={cn(
                        "w-12 h-6 flex items-center justify-center rounded-lg text-[9px] font-black uppercase tracking-tighter shadow-sm",
                        log.requestMethod === "GET" ? "bg-green-500/10 text-green-500" :
                          log.requestMethod === "POST" ? "bg-yellow-500/10 text-yellow-500" :
                            log.requestMethod === "PUT" ? "bg-blue-500/10 text-blue-500" :
                              log.requestMethod === "DELETE" ? "bg-red-500/10 text-red-500" :
                                "bg-muted text-muted-foreground"
                      )}>
                        {log.requestMethod}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[12px] truncate font-bold text-foreground/90 group-hover:text-primary transition-colors">
                          {log.requestUrl.split('/').pop() || 'Untitled Request'}
                        </div>
                        <div className="text-[10px] text-muted-foreground/60 truncate font-mono tracking-tighter">{log.requestUrl}</div>
                      </div>
                    </div>
                    <Badge
                      variant={log.responseStatus < 400 ? "default" : "destructive"}
                      className={cn(
                        "text-[9px] font-black h-5 px-1.5 rounded-md shadow-sm opacity-80 group-hover:opacity-100 transition-opacity",
                        log.responseStatus < 400 ? "bg-green-500/20 text-green-500 hover:bg-green-500/30" : "bg-red-500/20 text-red-500 hover:bg-red-500/30"
                      )}
                    >
                      {log.responseStatus}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
