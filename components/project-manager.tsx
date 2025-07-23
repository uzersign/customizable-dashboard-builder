"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FolderOpen, Plus, Search, Calendar, Tag, Trash2, Copy, Star, MoreHorizontal, Archive } from "lucide-react"
import { useDashboard } from "./dashboard-context"
import { formatDistanceToNow } from "date-fns"
import { toast } from "sonner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ProjectManagerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface Project {
  id: string
  name: string
  description: string
  createdAt: string
  updatedAt: string
  version: string
  tags: string[]
  components: any[]
  theme: any
  starred?: boolean
  archived?: boolean
}

export function ProjectManager({ open, onOpenChange }: ProjectManagerProps) {
  const { config, loadProject, createNewProject } = useDashboard()
  const [projects, setProjects] = useState<Project[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [newProjectName, setNewProjectName] = useState("")
  const [newProjectDescription, setNewProjectDescription] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  // Toast queue management - completely isolated from render cycle
  const toastQueueRef = useRef<Array<{ message: string; type: "success" | "error" }>>([])
  const isProcessingRef = useRef(false)
  const mountedRef = useRef(true)

  // Safe toast function that ensures complete isolation from render cycle
  const safeToast = useCallback((message: string, type: "success" | "error" = "success") => {
    if (!mountedRef.current) return

    toastQueueRef.current.push({ message, type })

    if (isProcessingRef.current) return
    isProcessingRef.current = true

    // Multiple async boundaries to ensure complete isolation
    setTimeout(() => {
      if (!mountedRef.current) {
        isProcessingRef.current = false
        return
      }

      requestAnimationFrame(() => {
        if (!mountedRef.current) {
          isProcessingRef.current = false
          return
        }

        setTimeout(() => {
          if (!mountedRef.current) {
            isProcessingRef.current = false
            return
          }

          try {
            const toastsToProcess = [...toastQueueRef.current]
            toastQueueRef.current = []

            toastsToProcess.forEach(({ message, type }) => {
              if (mountedRef.current) {
                if (type === "success") {
                  toast.success(message)
                } else {
                  toast.error(message)
                }
              }
            })
          } catch (error) {
            console.error("Toast error:", error)
          } finally {
            isProcessingRef.current = false
          }
        }, 100)
      })
    }, 0)
  }, [])

  // Component lifecycle management
  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      isProcessingRef.current = false
      toastQueueRef.current = []
    }
  }, [])

  useEffect(() => {
    if (open) {
      loadProjects()
    }
  }, [open])

  const loadProjects = useCallback(() => {
    try {
      const savedProjects = JSON.parse(localStorage.getItem("dashboard-projects") || "[]")
      setProjects(savedProjects)
    } catch (error) {
      console.error("Failed to load projects:", error)
      setProjects([])
    }
  }, [])

  const saveProjects = useCallback(
    (updatedProjects: Project[]) => {
      try {
        localStorage.setItem("dashboard-projects", JSON.stringify(updatedProjects))
        setProjects(updatedProjects)
      } catch (error) {
        console.error("Failed to save projects:", error)
        safeToast("Failed to save projects", "error")
      }
    },
    [safeToast],
  )

  const handleCreateProject = useCallback(async () => {
    if (!newProjectName.trim()) {
      safeToast("Project name is required", "error")
      return
    }

    setIsCreating(true)
    try {
      const newProject: Project = {
        id: `project-${Date.now()}`,
        name: newProjectName,
        description: newProjectDescription,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: "1.0.0",
        tags: [],
        components: [],
        theme: {
          mode: "light",
          primaryColor: "#3b82f6",
          secondaryColor: "#64748b",
        },
        starred: false,
        archived: false,
      }

      const updatedProjects = [...projects, newProject]
      saveProjects(updatedProjects)

      setNewProjectName("")
      setNewProjectDescription("")
      setIsCreating(false)

      safeToast("Project created successfully!")
    } catch (error) {
      safeToast("Failed to create project", "error")
      setIsCreating(false)
    }
  }, [newProjectName, newProjectDescription, projects, saveProjects, safeToast])

  const handleLoadProject = useCallback(
    async (project: Project) => {
      try {
        await loadProject(project.id)
        onOpenChange(false)
      } catch (error) {
        safeToast("Failed to load project", "error")
      }
    },
    [loadProject, onOpenChange, safeToast],
  )

  const handleDeleteProject = useCallback(
    (projectId: string) => {
      const updatedProjects = projects.filter((p) => p.id !== projectId)
      saveProjects(updatedProjects)
      safeToast("Project deleted")
    },
    [projects, saveProjects, safeToast],
  )

  const handleDuplicateProject = useCallback(
    (project: Project) => {
      const duplicatedProject: Project = {
        ...project,
        id: `project-${Date.now()}`,
        name: `${project.name} (Copy)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const updatedProjects = [...projects, duplicatedProject]
      saveProjects(updatedProjects)
      safeToast("Project duplicated")
    },
    [projects, saveProjects, safeToast],
  )

  const handleToggleStar = useCallback(
    (projectId: string) => {
      const updatedProjects = projects.map((p) => (p.id === projectId ? { ...p, starred: !p.starred } : p))
      saveProjects(updatedProjects)
    },
    [projects, saveProjects],
  )

  const handleToggleArchive = useCallback(
    (projectId: string) => {
      const project = projects.find((p) => p.id === projectId)
      const updatedProjects = projects.map((p) => (p.id === projectId ? { ...p, archived: !p.archived } : p))
      saveProjects(updatedProjects)
      safeToast(project?.archived ? "Project unarchived" : "Project archived")
    },
    [projects, saveProjects, safeToast],
  )

  const filteredProjects = projects
    .filter((project) => {
      const matchesSearch =
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())

      switch (activeTab) {
        case "starred":
          return matchesSearch && project.starred
        case "archived":
          return matchesSearch && project.archived
        case "recent":
          return matchesSearch && !project.archived
        default:
          return matchesSearch && !project.archived
      }
    })
    .sort((a, b) => {
      if (activeTab === "recent") {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            Project Manager
            <Badge variant="secondary" className="ml-2">
              {projects.filter((p) => !p.archived).length} Projects
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col h-[70vh]">
          {/* Search and Actions */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={createNewProject} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Project
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All Projects</TabsTrigger>
              <TabsTrigger value="recent">Recent</TabsTrigger>
              <TabsTrigger value="starred">Starred</TabsTrigger>
              <TabsTrigger value="archived">Archived</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="flex-1 mt-4">
              <ProjectGrid
                projects={filteredProjects}
                onLoadProject={handleLoadProject}
                onDeleteProject={handleDeleteProject}
                onDuplicateProject={handleDuplicateProject}
                onToggleStar={handleToggleStar}
                onToggleArchive={handleToggleArchive}
              />
            </TabsContent>

            <TabsContent value="recent" className="flex-1 mt-4">
              <ProjectGrid
                projects={filteredProjects}
                onLoadProject={handleLoadProject}
                onDeleteProject={handleDeleteProject}
                onDuplicateProject={handleDuplicateProject}
                onToggleStar={handleToggleStar}
                onToggleArchive={handleToggleArchive}
              />
            </TabsContent>

            <TabsContent value="starred" className="flex-1 mt-4">
              <ProjectGrid
                projects={filteredProjects}
                onLoadProject={handleLoadProject}
                onDeleteProject={handleDeleteProject}
                onDuplicateProject={handleDuplicateProject}
                onToggleStar={handleToggleStar}
                onToggleArchive={handleToggleArchive}
              />
            </TabsContent>

            <TabsContent value="archived" className="flex-1 mt-4">
              <ProjectGrid
                projects={filteredProjects}
                onLoadProject={handleLoadProject}
                onDeleteProject={handleDeleteProject}
                onDuplicateProject={handleDuplicateProject}
                onToggleStar={handleToggleStar}
                onToggleArchive={handleToggleArchive}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Create Project Form */}
        {isCreating && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Create New Project</CardTitle>
              <CardDescription>Set up your new dashboard project</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="project-name">Project Name</Label>
                <Input
                  id="project-name"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="My Awesome Dashboard"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="project-description">Description</Label>
                <Input
                  id="project-description"
                  value={newProjectDescription}
                  onChange={(e) => setNewProjectDescription(e.target.value)}
                  placeholder="A brief description of your dashboard..."
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCreateProject} disabled={!newProjectName.trim()}>
                  Create Project
                </Button>
                <Button variant="outline" onClick={() => setIsCreating(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  )
}

interface ProjectGridProps {
  projects: Project[]
  onLoadProject: (project: Project) => void
  onDeleteProject: (projectId: string) => void
  onDuplicateProject: (project: Project) => void
  onToggleStar: (projectId: string) => void
  onToggleArchive: (projectId: string) => void
}

function ProjectGrid({
  projects,
  onLoadProject,
  onDeleteProject,
  onDuplicateProject,
  onToggleStar,
  onToggleArchive,
}: ProjectGridProps) {
  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <FolderOpen className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No projects found</h3>
        <p className="text-muted-foreground mb-4">Create your first dashboard project to get started</p>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Project
        </Button>
      </div>
    )
  }

  return (
    <ScrollArea className="h-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-1">
        {projects.map((project) => (
          <Card key={project.id} className="group hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg truncate flex items-center gap-2">
                    {project.name}
                    {project.starred && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                    {project.archived && <Archive className="h-4 w-4 text-gray-500" />}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">{project.description}</CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onLoadProject(project)}>
                      <FolderOpen className="h-4 w-4 mr-2" />
                      Open Project
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onToggleStar(project.id)}>
                      <Star className="h-4 w-4 mr-2" />
                      {project.starred ? "Unstar" : "Star"}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDuplicateProject(project)}>
                      <Copy className="h-4 w-4 mr-2" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onToggleArchive(project.id)}>
                      <Archive className="h-4 w-4 mr-2" />
                      {project.archived ? "Unarchive" : "Archive"}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDeleteProject(project.id)} className="text-red-600">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}
                  </div>
                  <div className="flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    {project.components?.length || 0} components
                  </div>
                </div>

                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {project.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {project.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{project.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                <Button
                  onClick={() => onLoadProject(project)}
                  className="w-full"
                  variant={project.archived ? "outline" : "default"}
                >
                  {project.archived ? "Restore Project" : "Open Project"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  )
}
