"use client"

import { useEffect } from "react"
import { useDashboard } from "./dashboard-context"
import { toast } from "sonner"

export function KeyboardShortcuts() {
  const {
    undo,
    redo,
    canUndo,
    canRedo,
    saveProject,
    selectedComponent,
    removeComponent,
    duplicateComponent,
    setPreviewMode,
    previewMode,
  } = useDashboard()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent shortcuts when typing in inputs
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return
      }

      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0
      const ctrlKey = isMac ? e.metaKey : e.ctrlKey

      // Undo (Ctrl/Cmd + Z)
      if (ctrlKey && e.key === "z" && !e.shiftKey) {
        e.preventDefault()
        if (canUndo) {
          undo()
        }
        return
      }

      // Redo (Ctrl/Cmd + Y or Ctrl/Cmd + Shift + Z)
      if ((ctrlKey && e.key === "y") || (ctrlKey && e.shiftKey && e.key === "z")) {
        e.preventDefault()
        if (canRedo) {
          redo()
        }
        return
      }

      // Save (Ctrl/Cmd + S)
      if (ctrlKey && e.key === "s") {
        e.preventDefault()
        saveProject()
        return
      }

      // Delete selected component (Delete or Backspace)
      if ((e.key === "Delete" || e.key === "Backspace") && selectedComponent) {
        e.preventDefault()
        removeComponent(selectedComponent)
        return
      }

      // Duplicate selected component (Ctrl/Cmd + D)
      if (ctrlKey && e.key === "d" && selectedComponent) {
        e.preventDefault()
        duplicateComponent(selectedComponent)
        return
      }

      // Toggle preview mode (Ctrl/Cmd + P)
      if (ctrlKey && e.key === "p") {
        e.preventDefault()
        setPreviewMode(!previewMode)
        toast.success(previewMode ? "Edit mode enabled" : "Preview mode enabled")
        return
      }

      // Escape to deselect
      if (e.key === "Escape") {
        e.preventDefault()
        // This would be handled by the dashboard context
        return
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [
    undo,
    redo,
    canUndo,
    canRedo,
    saveProject,
    selectedComponent,
    removeComponent,
    duplicateComponent,
    setPreviewMode,
    previewMode,
  ])

  return null
}
