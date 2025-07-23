"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { DashboardRenderer } from "./dashboard-renderer"
import { GridOverlay } from "./grid-overlay"
import { useDashboard } from "./dashboard-context"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut, RotateCcw, Maximize } from "lucide-react"

export function CanvasArea() {
  const { previewMode, currentBreakpoint, showGrid, setShowGrid, selectedComponent, setSelectedComponent } =
    useDashboard()

  const [zoom, setZoom] = useState(100)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 })
  const canvasRef = useRef<HTMLDivElement>(null)

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 10, 200))
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 10, 25))
  const handleResetZoom = () => {
    setZoom(100)
    setCanvasOffset({ x: 0, y: 0 })
  }

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button === 1 || (e.button === 0 && e.altKey)) {
        // Middle mouse or Alt+Left click
        setIsDragging(true)
        setDragStart({ x: e.clientX - canvasOffset.x, y: e.clientY - canvasOffset.y })
        e.preventDefault()
      }
    },
    [canvasOffset],
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging) {
        setCanvasOffset({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        })
      }
    },
    [isDragging, dragStart],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const getCanvasWidth = () => {
    switch (currentBreakpoint) {
      case "mobile":
        return "375px"
      case "tablet":
        return "768px"
      default:
        return "100%"
    }
  }

  const getCanvasMaxWidth = () => {
    switch (currentBreakpoint) {
      case "mobile":
        return "375px"
      case "tablet":
        return "768px"
      default:
        return "1200px"
    }
  }

  return (
    <div className="h-full bg-gray-100 relative overflow-hidden">
      {/* Canvas Controls */}
      {!previewMode && (
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-white rounded-lg shadow-sm border border-gray-200 p-2">
          <Button variant="ghost" size="sm" onClick={handleZoomOut} disabled={zoom <= 25} className="h-8 w-8 p-0">
            <ZoomOut className="h-4 w-4" />
          </Button>

          <span className="text-sm font-medium min-w-[3rem] text-center">{zoom}%</span>

          <Button variant="ghost" size="sm" onClick={handleZoomIn} disabled={zoom >= 200} className="h-8 w-8 p-0">
            <ZoomIn className="h-4 w-4" />
          </Button>

          <Button variant="ghost" size="sm" onClick={handleResetZoom} className="h-8 w-8 p-0">
            <RotateCcw className="h-4 w-4" />
          </Button>

          <div className="w-px h-6 bg-gray-200 mx-1" />

          <Button
            variant={showGrid ? "default" : "ghost"}
            size="sm"
            onClick={() => setShowGrid(!showGrid)}
            className="h-8 w-8 p-0"
          >
            <Maximize className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Canvas Container */}
      <div
        ref={canvasRef}
        className={cn(
          "h-full flex items-center justify-center p-8 transition-all duration-200",
          isDragging && "cursor-grabbing",
          !isDragging && "cursor-grab",
        )}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px)`,
        }}
      >
        {/* Canvas */}
        <div
          className={cn(
            "bg-white shadow-lg transition-all duration-200 relative",
            previewMode ? "border-0" : "border border-gray-300",
            currentBreakpoint === "mobile" && "rounded-[2.5rem] p-2",
            currentBreakpoint === "tablet" && "rounded-xl",
            currentBreakpoint === "desktop" && "rounded-lg",
          )}
          style={{
            width: getCanvasWidth(),
            maxWidth: getCanvasMaxWidth(),
            minHeight: currentBreakpoint === "mobile" ? "667px" : "600px",
            transform: `scale(${zoom / 100})`,
            transformOrigin: "center center",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedComponent(null)
            }
          }}
        >
          {/* Mobile Frame */}
          {currentBreakpoint === "mobile" && !previewMode && (
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gray-400 rounded-full" />
          )}

          {/* Grid Overlay */}
          {showGrid && !previewMode && <GridOverlay />}

          {/* Dashboard Content */}
          <div className={cn("relative h-full", currentBreakpoint === "mobile" && "rounded-[2rem] overflow-hidden")}>
            <DashboardRenderer />
          </div>

          {/* Empty State */}
          {!previewMode && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center text-gray-400">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-lg font-medium mb-2">Start Building Your Dashboard</h3>
                <p className="text-sm">Drag components from the library to get started</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Breakpoint Indicator */}
      {!previewMode && (
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-sm border border-gray-200 px-3 py-2">
          <div className="flex items-center gap-2 text-sm">
            <div
              className={cn(
                "w-2 h-2 rounded-full",
                currentBreakpoint === "mobile" && "bg-green-500",
                currentBreakpoint === "tablet" && "bg-yellow-500",
                currentBreakpoint === "desktop" && "bg-blue-500",
              )}
            />
            <span className="font-medium capitalize">{currentBreakpoint}</span>
            <span className="text-gray-500">
              {currentBreakpoint === "mobile" && "≤ 768px"}
              {currentBreakpoint === "tablet" && "769px - 1024px"}
              {currentBreakpoint === "desktop" && "≥ 1025px"}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
