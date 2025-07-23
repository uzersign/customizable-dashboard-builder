"use client"

import { useState, useEffect } from "react"
import { ComponentLibrary } from "./component-library"
import { CanvasArea } from "./canvas-area"
import { PropertyPanel } from "./property-panel"
import { TopToolbar } from "./top-toolbar"
import { TemplateGallery } from "./template-gallery"
import { ExportDialog } from "./export-dialog"
import { ProjectManager } from "./project-manager"
import { LayoutEditor } from "./layout-editor"
import { ThemeCustomizer } from "./theme-customizer"
import { KeyboardShortcuts } from "./keyboard-shortcuts"
import { useDashboard } from "./dashboard-context"
import { useAuth } from "./auth-provider"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { cn } from "@/lib/utils"

export function DashboardBuilder() {
  const { user } = useAuth()
  const { previewMode, currentBreakpoint } = useDashboard()
  const [showTemplates, setShowTemplates] = useState(false)
  const [showExport, setShowExport] = useState(false)
  const [showProjects, setShowProjects] = useState(false)
  const [showLayoutEditor, setShowLayoutEditor] = useState(false)
  const [showThemeCustomizer, setShowThemeCustomizer] = useState(false)
  const [leftPanelSize, setLeftPanelSize] = useState(20)
  const [rightPanelSize, setRightPanelSize] = useState(25)

  // Auto-save functionality
  useEffect(() => {
    const interval = setInterval(() => {
      if (user) {
        // Auto-save every 30 seconds
        // This would typically save to a backend
        console.log("Auto-saving project...")
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [user])

  if (!user) {
    return null // Auth dialog will handle this
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <TopToolbar
        onShowTemplates={() => setShowTemplates(true)}
        onShowExport={() => setShowExport(true)}
        onShowProjects={() => setShowProjects(true)}
        onShowLayoutEditor={() => setShowLayoutEditor(true)}
        onShowThemeCustomizer={() => setShowThemeCustomizer(true)}
      />

      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Left Panel - Component Library */}
          {!previewMode && (
            <>
              <ResizablePanel defaultSize={leftPanelSize} minSize={15} maxSize={35} onResize={setLeftPanelSize}>
                <ComponentLibrary />
              </ResizablePanel>
              <ResizableHandle withHandle />
            </>
          )}

          {/* Center Panel - Canvas */}
          <ResizablePanel
            defaultSize={previewMode ? 100 : 100 - leftPanelSize - rightPanelSize}
            className={cn(
              "relative",
              currentBreakpoint === "mobile" && "max-w-sm mx-auto",
              currentBreakpoint === "tablet" && "max-w-4xl mx-auto",
            )}
          >
            <CanvasArea />
          </ResizablePanel>

          {/* Right Panel - Properties */}
          {!previewMode && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={rightPanelSize} minSize={20} maxSize={40} onResize={setRightPanelSize}>
                <PropertyPanel />
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>

      {/* Dialogs */}
      <TemplateGallery open={showTemplates} onOpenChange={setShowTemplates} />
      <ExportDialog open={showExport} onOpenChange={setShowExport} />
      <ProjectManager open={showProjects} onOpenChange={setShowProjects} />
      <LayoutEditor open={showLayoutEditor} onOpenChange={setShowLayoutEditor} />
      <ThemeCustomizer open={showThemeCustomizer} onOpenChange={setShowThemeCustomizer} />

      {/* Keyboard Shortcuts */}
      <KeyboardShortcuts />
    </div>
  )
}
