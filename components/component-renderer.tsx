"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { ChartRenderer } from "./renderers/chart-renderer"
import { WidgetRenderer } from "./renderers/widget-renderer"
import { TableRenderer } from "./renderers/table-renderer"
import { ElementRenderer } from "./renderers/element-renderer"
import { useDashboard } from "./dashboard-context"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Trash2, Copy, Move, Eye, EyeOff } from "lucide-react"

interface ComponentRendererProps {
  component: any
}

export function ComponentRenderer({ component }: ComponentRendererProps) {
  const { selectedComponent, setSelectedComponent, updateComponent, deleteComponent, duplicateComponent, previewMode } =
    useDashboard()

  const [isHovered, setIsHovered] = useState(false)
  const isSelected = selectedComponent === component.id

  const handleSelect = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      setSelectedComponent(component.id)
    },
    [component.id, setSelectedComponent],
  )

  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      // Use setTimeout to ensure this happens outside of any render cycle
      setTimeout(() => {
        deleteComponent(component.id)
      }, 0)
    },
    [component.id, deleteComponent],
  )

  const handleDuplicate = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      // Use setTimeout to ensure this happens outside of any render cycle
      setTimeout(() => {
        duplicateComponent(component.id)
      }, 0)
    },
    [component.id, duplicateComponent],
  )

  const handleToggleVisibility = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      // Use setTimeout to ensure this happens outside of any render cycle
      setTimeout(() => {
        updateComponent(component.id, {
          ...component,
          style: {
            ...component.style,
            display: component.style?.display === "none" ? "block" : "none",
          },
        })
      }, 0)
    },
    [component, updateComponent],
  )

  const renderComponent = () => {
    switch (component.type) {
      case "line-chart":
      case "bar-chart":
      case "pie-chart":
      case "area-chart":
        return <ChartRenderer component={component} />

      case "stat-card":
      case "progress-bar":
      case "badge":
      case "alert":
        return <WidgetRenderer component={component} />

      case "table":
      case "data-list":
        return <TableRenderer component={component} />

      default:
        return <ElementRenderer component={component} />
    }
  }

  const componentStyle = {
    ...component.style,
    position: component.style?.position || "relative",
    zIndex: isSelected ? 10 : "auto",
  }

  return (
    <div
      className={cn(
        "relative group transition-all duration-200",
        isSelected && !previewMode && "ring-2 ring-blue-500 ring-offset-2",
        isHovered && !previewMode && !isSelected && "ring-1 ring-gray-300",
        component.style?.display === "none" && "opacity-50",
      )}
      style={componentStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleSelect}
    >
      {/* Component Controls */}
      {!previewMode && (isSelected || isHovered) && (
        <div className="absolute -top-8 left-0 z-20 flex items-center gap-1 bg-white border border-gray-200 rounded-md shadow-sm p-1">
          <span className="text-xs font-medium text-gray-600 px-2">{component.name || component.type}</span>

          <div className="flex items-center gap-1 border-l border-gray-200 pl-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleVisibility}
              className="h-6 w-6 p-0"
              title={component.style?.display === "none" ? "Show" : "Hide"}
            >
              {component.style?.display === "none" ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
            </Button>

            <Button variant="ghost" size="sm" onClick={handleDuplicate} className="h-6 w-6 p-0" title="Duplicate">
              <Copy className="h-3 w-3" />
            </Button>

            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" title="Move">
              <Move className="h-3 w-3" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
              title="Delete"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}

      {/* Component Content */}
      <div className="relative">{renderComponent()}</div>

      {/* Resize Handles */}
      {!previewMode && isSelected && (
        <>
          {/* Corner handles */}
          <div className="absolute -top-1 -left-1 w-2 h-2 bg-blue-500 border border-white rounded-full cursor-nw-resize" />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 border border-white rounded-full cursor-ne-resize" />
          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-500 border border-white rounded-full cursor-sw-resize" />
          <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-blue-500 border border-white rounded-full cursor-se-resize" />

          {/* Edge handles */}
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-500 border border-white rounded-full cursor-n-resize" />
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-500 border border-white rounded-full cursor-s-resize" />
          <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-blue-500 border border-white rounded-full cursor-w-resize" />
          <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-blue-500 border border-white rounded-full cursor-e-resize" />
        </>
      )}
    </div>
  )
}
