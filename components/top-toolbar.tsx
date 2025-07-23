"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  Save,
  Download,
  Upload,
  Undo,
  Redo,
  Eye,
  EyeOff,
  Smartphone,
  Tablet,
  Monitor,
  Layout,
  Palette,
  FolderOpen,
  Grid,
  Settings,
} from "lucide-react"
import { useDashboard } from "./dashboard-context"
import { useAuth } from "./auth-provider"

interface TopToolbarProps {
  onShowTemplates: () => void
  onShowExport: () => void
  onShowProjects: () => void
  onShowLayoutEditor: () => void
  onShowThemeCustomizer: () => void
}

export function TopToolbar({
  onShowTemplates,
  onShowExport,
  onShowProjects,
  onShowLayoutEditor,
  onShowThemeCustomizer,
}: TopToolbarProps) {
  const { user, logout } = useAuth()
  const {
    previewMode,
    setPreviewMode,
    currentBreakpoint,
    setCurrentBreakpoint,
    canUndo,
    canRedo,
    undo,
    redo,
    saveProject,
    currentProject,
    isAutoSaving,
  } = useDashboard()

  const breakpoints = [
    { id: "desktop", icon: Monitor, label: "Desktop" },
    { id: "tablet", icon: Tablet, label: "Tablet" },
    { id: "mobile", icon: Smartphone, label: "Mobile" },
  ]

  return (
    <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4">
      {/* Left Section - Project Info */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Grid className="h-5 w-5 text-blue-600" />
          <span className="font-semibold text-gray-900">Dashboard Builder</span>
        </div>

        <Separator orientation="vertical" className="h-6" />

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">{currentProject?.name || "Untitled Project"}</span>
          {isAutoSaving && (
            <Badge variant="secondary" className="text-xs">
              <Save className="h-3 w-3 mr-1" />
              Saving...
            </Badge>
          )}
        </div>
      </div>

      {/* Center Section - Main Actions */}
      <div className="flex items-center gap-2">
        {/* Undo/Redo */}
        <div className="flex items-center">
          <Button variant="ghost" size="sm" onClick={undo} disabled={!canUndo} className="h-8 w-8 p-0">
            <Undo className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={redo} disabled={!canRedo} className="h-8 w-8 p-0">
            <Redo className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Breakpoint Selector */}
        <div className="flex items-center bg-gray-100 rounded-md p-1">
          {breakpoints.map((breakpoint) => {
            const Icon = breakpoint.icon
            return (
              <Button
                key={breakpoint.id}
                variant={currentBreakpoint === breakpoint.id ? "default" : "ghost"}
                size="sm"
                onClick={() => setCurrentBreakpoint(breakpoint.id as any)}
                className="h-7 w-7 p-0"
                title={breakpoint.label}
              >
                <Icon className="h-4 w-4" />
              </Button>
            )
          })}
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Preview Toggle */}
        <Button
          variant={previewMode ? "default" : "ghost"}
          size="sm"
          onClick={() => setPreviewMode(!previewMode)}
          className="flex items-center gap-2"
        >
          {previewMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          {previewMode ? "Edit" : "Preview"}
        </Button>

        <Separator orientation="vertical" className="h-6" />

        {/* Tools */}
        <Button variant="ghost" size="sm" onClick={onShowLayoutEditor} className="flex items-center gap-2">
          <Layout className="h-4 w-4" />
          Layout
        </Button>

        <Button variant="ghost" size="sm" onClick={onShowThemeCustomizer} className="flex items-center gap-2">
          <Palette className="h-4 w-4" />
          Theme
        </Button>
      </div>

      {/* Right Section - File Actions */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onShowProjects} className="flex items-center gap-2">
          <FolderOpen className="h-4 w-4" />
          Projects
        </Button>

        <Button variant="ghost" size="sm" onClick={onShowTemplates} className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          Templates
        </Button>

        <Button variant="ghost" size="sm" onClick={saveProject} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save
        </Button>

        <Button variant="ghost" size="sm" onClick={onShowExport} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>

        <Separator orientation="vertical" className="h-6" />

        {/* User Menu */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">{user?.name}</span>
          <Button variant="ghost" size="sm" onClick={logout} className="h-8 w-8 p-0">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
