"use client"

import { createContext, useContext, useState, useCallback, useRef, useEffect, type ReactNode } from "react"
import { toast } from "sonner"
import { generateId } from "@/lib/utils"

export interface DashboardComponent {
  id: string
  type: string
  name?: string
  props: Record<string, any>
  children?: DashboardComponent[]
  style?: Record<string, any>
  gridArea?: {
    row: number
    col: number
    rowSpan: number
    colSpan: number
  }
  responsive?: {
    mobile?: Partial<DashboardComponent>
    tablet?: Partial<DashboardComponent>
    desktop?: Partial<DashboardComponent>
  }
}

export interface LayoutSection {
  id: string
  type: "header" | "sidebar" | "navbar" | "footer" | "content"
  visible: boolean
  height?: string
  width?: string
  position?: "fixed" | "sticky" | "relative"
  style?: Record<string, any>
  components: DashboardComponent[]
}

export interface DashboardConfig {
  id: string
  name: string
  description: string
  layout: {
    type: "grid" | "flexbox" | "custom"
    rows: number
    cols: number
    gap: number
    sections: LayoutSection[]
    header: { enabled: boolean; height?: string; background?: string; padding?: string }
    sidebar: {
      enabled: boolean
      width?: string
      position?: string
      collapsible?: boolean
      background?: string
      padding?: string
    }
    content: { container?: string; gridColumns?: number; gap?: string; background?: string; padding?: string }
    footer: { enabled: boolean; height?: string; background?: string; padding?: string }
  }
  theme: {
    mode: "light" | "dark" | "custom"
    primaryColor: string
    secondaryColor: string
    backgroundColor: string
    textColor: string
    fontFamily: string
    fontSize: string
    borderRadius: string
    shadows: boolean
  }
  responsive: {
    breakpoints: {
      mobile: number
      tablet: number
      desktop: number
    }
    currentBreakpoint: "mobile" | "tablet" | "desktop"
  }
  components: DashboardComponent[]
  metadata: {
    createdAt: string
    updatedAt: string
    version: string
    tags: string[]
  }
}

interface HistoryState {
  config: DashboardConfig
  timestamp: number
  action: string
}

interface DashboardContextType {
  config: DashboardConfig
  updateConfig: (updates: Partial<DashboardConfig>) => void
  addComponent: (component: DashboardComponent, sectionId?: string) => void
  updateComponent: (id: string, updates: Partial<DashboardComponent>) => void
  removeComponent: (id: string) => void
  duplicateComponent: (id: string) => void
  deleteComponent: (id: string) => void
  moveComponent: (id: string, newPosition: { row: number; col: number }) => void
  selectedComponent: string | null
  setSelectedComponent: (id: string | null) => void
  selectedSection: string | null
  setSelectedSection: (id: string | null) => void
  previewMode: boolean
  setPreviewMode: (mode: boolean) => void
  currentBreakpoint: "mobile" | "tablet" | "desktop"
  setCurrentBreakpoint: (breakpoint: "mobile" | "tablet" | "desktop") => void
  showGrid: boolean
  setShowGrid: (show: boolean) => void
  // History management
  undo: () => void
  redo: () => void
  canUndo: boolean
  canRedo: boolean
  // Project management
  saveProject: () => Promise<void>
  loadProject: (projectId: string) => Promise<void>
  createNewProject: () => void
  currentProject: { id: string; name: string } | null
  isAutoSaving: boolean
  // Layout management
  updateLayoutSection: (sectionId: string, updates: Partial<LayoutSection>) => void
  toggleSectionVisibility: (sectionId: string) => void
  layout: {
    header: { enabled: boolean; height?: string; background?: string; padding?: string }
    sidebar: {
      enabled: boolean
      width?: string
      position?: string
      collapsible?: boolean
      background?: string
      padding?: string
    }
    content: { container?: string; gridColumns?: number; gap?: string; background?: string; padding?: string }
    footer: { enabled: boolean; height?: string; background?: string; padding?: string }
  }
  updateLayout: (layout: any) => void
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

const defaultConfig: DashboardConfig = {
  id: generateId(),
  name: "New Dashboard",
  description: "A custom dashboard built with Dashboard Builder",
  layout: {
    type: "grid",
    rows: 12,
    cols: 12,
    gap: 16,
    sections: [
      {
        id: "header",
        type: "header",
        visible: true,
        height: "64px",
        position: "sticky",
        style: { backgroundColor: "#ffffff", borderBottom: "1px solid #e5e7eb" },
        components: [],
      },
      {
        id: "sidebar",
        type: "sidebar",
        visible: true,
        width: "256px",
        position: "fixed",
        style: { backgroundColor: "#f8fafc", borderRight: "1px solid #e5e7eb" },
        components: [],
      },
      {
        id: "content",
        type: "content",
        visible: true,
        style: { backgroundColor: "#ffffff", padding: "24px" },
        components: [],
      },
      {
        id: "footer",
        type: "footer",
        visible: false,
        height: "48px",
        style: { backgroundColor: "#f8fafc", borderTop: "1px solid #e5e7eb" },
        components: [],
      },
    ],
    header: { enabled: true, height: "64px", background: "white", padding: "16px 24px" },
    sidebar: {
      enabled: true,
      width: "256px",
      position: "left",
      collapsible: false,
      background: "gray-50",
      padding: "16px",
    },
    content: { container: "fluid", gridColumns: 12, gap: "md", background: "white", padding: "24px" },
    footer: { enabled: false, height: "48px", background: "gray-50", padding: "16px 24px" },
  },
  theme: {
    mode: "light",
    primaryColor: "#3b82f6",
    secondaryColor: "#64748b",
    backgroundColor: "#ffffff",
    textColor: "#1f2937",
    fontFamily: "Inter",
    fontSize: "14px",
    borderRadius: "8px",
    shadows: true,
  },
  responsive: {
    breakpoints: {
      mobile: 768,
      tablet: 1024,
      desktop: 1280,
    },
    currentBreakpoint: "desktop",
  },
  components: [],
  metadata: {
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: "1.0.0",
    tags: [],
  },
}

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<DashboardConfig>(defaultConfig)
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null)
  const [selectedSection, setSelectedSection] = useState<string | null>(null)
  const [previewMode, setPreviewMode] = useState(false)
  const [currentBreakpoint, setCurrentBreakpoint] = useState<"mobile" | "tablet" | "desktop">("desktop")
  const [showGrid, setShowGrid] = useState(true)
  const [currentProject, setCurrentProject] = useState<{ id: string; name: string } | null>(null)
  const [isAutoSaving, setIsAutoSaving] = useState(false)

  // History management
  const [history, setHistory] = useState<HistoryState[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [layout, setLayout] = useState(defaultConfig.layout)

  // Toast queue management - completely isolated from render cycle
  const toastQueueRef = useRef<Array<{ message: string; type: "success" | "error"; id: string }>>([])
  const isProcessingRef = useRef(false)
  const mountedRef = useRef(true)

  // Robust toast queue processor that ensures complete isolation from render cycle
  const processToastQueue = useCallback(() => {
    if (!mountedRef.current || isProcessingRef.current || toastQueueRef.current.length === 0) {
      return
    }

    isProcessingRef.current = true

    // Use multiple async boundaries to ensure we're completely outside render
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
            console.error("Toast processing error:", error)
          } finally {
            isProcessingRef.current = false
          }
        }, 50)
      })
    }, 0)
  }, [])

  // Safe toast queuing function
  const queueToast = useCallback(
    (message: string, type: "success" | "error" = "success") => {
      if (!mountedRef.current) return

      const toastId = `toast-${Date.now()}-${Math.random()}`
      toastQueueRef.current.push({ message, type, id: toastId })

      // Process queue with multiple async boundaries
      setTimeout(() => {
        if (mountedRef.current) {
          processToastQueue()
        }
      }, 0)
    },
    [processToastQueue],
  )

  const addToHistory = useCallback(
    (newConfig: DashboardConfig, action: string) => {
      const newHistory = history.slice(0, historyIndex + 1)
      newHistory.push({
        config: JSON.parse(JSON.stringify(newConfig)),
        timestamp: Date.now(),
        action,
      })

      // Keep only last 50 states
      if (newHistory.length > 50) {
        newHistory.shift()
      }

      setHistory(newHistory)
      setHistoryIndex(newHistory.length - 1)
    },
    [history, historyIndex],
  )

  const updateConfig = useCallback(
    (updates: Partial<DashboardConfig>) => {
      const newConfig = {
        ...config,
        ...updates,
        metadata: {
          ...config.metadata,
          ...updates.metadata,
          updatedAt: new Date().toISOString(),
        },
      }
      setConfig(newConfig)
      addToHistory(newConfig, "Update config")
    },
    [config, addToHistory],
  )

  const addComponent = useCallback(
    (component: DashboardComponent, sectionId?: string) => {
      const newConfig = { ...config }

      if (sectionId) {
        const section = newConfig.layout.sections.find((s) => s.id === sectionId)
        if (section) {
          section.components.push(component)
        }
      } else {
        newConfig.components.push(component)
      }

      newConfig.metadata.updatedAt = new Date().toISOString()
      setConfig(newConfig)
      addToHistory(newConfig, `Add ${component.type}`)

      // Queue toast notification
      queueToast(`${component.name || component.type} added successfully`)
    },
    [config, addToHistory, queueToast],
  )

  const updateComponent = useCallback(
    (id: string, updates: Partial<DashboardComponent>) => {
      const newConfig = { ...config }

      // Update in main components
      const componentIndex = newConfig.components.findIndex((c) => c.id === id)
      if (componentIndex !== -1) {
        newConfig.components[componentIndex] = { ...newConfig.components[componentIndex], ...updates }
      } else {
        // Update in section components
        for (const section of newConfig.layout.sections) {
          const sectionComponentIndex = section.components.findIndex((c) => c.id === id)
          if (sectionComponentIndex !== -1) {
            section.components[sectionComponentIndex] = { ...section.components[sectionComponentIndex], ...updates }
            break
          }
        }
      }

      newConfig.metadata.updatedAt = new Date().toISOString()
      setConfig(newConfig)
      addToHistory(newConfig, `Update component`)
    },
    [config, addToHistory],
  )

  const removeComponent = useCallback(
    (id: string) => {
      const newConfig = { ...config }

      // Remove from main components
      newConfig.components = newConfig.components.filter((c) => c.id !== id)

      // Remove from section components
      for (const section of newConfig.layout.sections) {
        section.components = section.components.filter((c) => c.id !== id)
      }

      newConfig.metadata.updatedAt = new Date().toISOString()
      setConfig(newConfig)
      addToHistory(newConfig, "Remove component")
      setSelectedComponent(null)

      // Queue toast notification
      queueToast("Component removed")
    },
    [config, addToHistory, queueToast],
  )

  const deleteComponent = useCallback(
    (id: string) => {
      removeComponent(id)
    },
    [removeComponent],
  )

  const duplicateComponent = useCallback(
    (id: string) => {
      const findComponent = (components: DashboardComponent[]): DashboardComponent | null => {
        for (const comp of components) {
          if (comp.id === id) return comp
          if (comp.children) {
            const found = findComponent(comp.children)
            if (found) return found
          }
        }
        return null
      }

      let component = findComponent(config.components)
      if (!component) {
        for (const section of config.layout.sections) {
          component = findComponent(section.components)
          if (component) break
        }
      }

      if (component) {
        const duplicated = {
          ...JSON.parse(JSON.stringify(component)),
          id: generateId(),
          name: `${component.name || component.type} Copy`,
          gridArea: component.gridArea
            ? {
                ...component.gridArea,
                col: Math.min(
                  component.gridArea.col + component.gridArea.colSpan,
                  config.layout.cols - component.gridArea.colSpan + 1,
                ),
              }
            : undefined,
        }
        addComponent(duplicated)
      }
    },
    [config, addComponent],
  )

  const moveComponent = useCallback(
    (id: string, newPosition: { row: number; col: number }) => {
      const component = config.components.find((c) => c.id === id)
      if (component?.gridArea) {
        updateComponent(id, {
          gridArea: {
            ...component.gridArea,
            row: newPosition.row,
            col: newPosition.col,
          },
        })
      }
    },
    [config.components, updateComponent],
  )

  const updateLayoutSection = useCallback(
    (sectionId: string, updates: Partial<LayoutSection>) => {
      const newConfig = { ...config }
      const sectionIndex = newConfig.layout.sections.findIndex((s) => s.id === sectionId)

      if (sectionIndex !== -1) {
        newConfig.layout.sections[sectionIndex] = {
          ...newConfig.layout.sections[sectionIndex],
          ...updates,
        }
        newConfig.metadata.updatedAt = new Date().toISOString()
        setConfig(newConfig)
        addToHistory(newConfig, `Update ${sectionId} section`)
      }
    },
    [config, addToHistory],
  )

  const toggleSectionVisibility = useCallback(
    (sectionId: string) => {
      const section = config.layout.sections.find((s) => s.id === sectionId)
      if (section) {
        updateLayoutSection(sectionId, { visible: !section.visible })
      }
    },
    [config.layout.sections, updateLayoutSection],
  )

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setConfig(history[historyIndex - 1].config)
      queueToast("Undone")
    }
  }, [history, historyIndex, queueToast])

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setConfig(history[historyIndex + 1].config)
      queueToast("Redone")
    }
  }, [history, historyIndex, queueToast])

  const saveProject = useCallback(async () => {
    setIsAutoSaving(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const projects = JSON.parse(localStorage.getItem("dashboard-projects") || "[]")
      const existingIndex = projects.findIndex((p: any) => p.id === config.id)

      if (existingIndex !== -1) {
        projects[existingIndex] = config
      } else {
        projects.push(config)
      }

      localStorage.setItem("dashboard-projects", JSON.stringify(projects))
      setCurrentProject({ id: config.id, name: config.name })
      queueToast("Project saved successfully!")
    } catch (error) {
      queueToast("Failed to save project", "error")
    } finally {
      setIsAutoSaving(false)
    }
  }, [config, queueToast])

  const loadProject = useCallback(
    async (projectId: string) => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500))

        const projects = JSON.parse(localStorage.getItem("dashboard-projects") || "[]")
        const project = projects.find((p: any) => p.id === projectId)

        if (project) {
          setConfig(project)
          setCurrentProject({ id: project.id, name: project.name })
          setHistory([])
          setHistoryIndex(-1)
          addToHistory(project, "Load project")
          queueToast("Project loaded successfully!")
        } else {
          queueToast("Project not found", "error")
        }
      } catch (error) {
        queueToast("Failed to load project", "error")
      }
    },
    [addToHistory, queueToast],
  )

  const createNewProject = useCallback(() => {
    const newConfig = {
      ...defaultConfig,
      id: generateId(),
      metadata: {
        ...defaultConfig.metadata,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    }
    setConfig(newConfig)
    setCurrentProject({ id: newConfig.id, name: newConfig.name })
    setSelectedComponent(null)
    setSelectedSection(null)
    setHistory([])
    setHistoryIndex(-1)
    addToHistory(newConfig, "Create new project")
    queueToast("New project created!")
  }, [addToHistory, queueToast])

  const updateLayout = useCallback(
    (newLayout: any) => {
      setLayout(newLayout)
      updateConfig({ layout: newLayout })
    },
    [updateConfig],
  )

  // Component lifecycle management
  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      isProcessingRef.current = false
      toastQueueRef.current = []
    }
  }, [])

  const contextValue: DashboardContextType = {
    config,
    updateConfig,
    addComponent,
    updateComponent,
    removeComponent,
    duplicateComponent,
    deleteComponent,
    moveComponent,
    selectedComponent,
    setSelectedComponent,
    selectedSection,
    setSelectedSection,
    previewMode,
    setPreviewMode,
    currentBreakpoint,
    setCurrentBreakpoint,
    showGrid,
    setShowGrid,
    undo,
    redo,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
    saveProject,
    loadProject,
    createNewProject,
    currentProject,
    isAutoSaving,
    updateLayoutSection,
    toggleSectionVisibility,
    layout,
    updateLayout,
  }

  return <DashboardContext.Provider value={contextValue}>{children}</DashboardContext.Provider>
}

export function useDashboard() {
  const context = useContext(DashboardContext)
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider")
  }
  return context
}
