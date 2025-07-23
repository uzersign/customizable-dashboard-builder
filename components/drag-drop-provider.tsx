"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface DragDropContextType {
  draggedComponent: string | null
  setDraggedComponent: (id: string | null) => void
  dropTarget: { row: number; col: number } | null
  setDropTarget: (target: { row: number; col: number } | null) => void
  isDragging: boolean
}

const DragDropContext = createContext<DragDropContextType | undefined>(undefined)

export function DragDropProvider({ children }: { children: ReactNode }) {
  const [draggedComponent, setDraggedComponent] = useState<string | null>(null)
  const [dropTarget, setDropTarget] = useState<{ row: number; col: number } | null>(null)

  return (
    <DragDropContext.Provider
      value={{
        draggedComponent,
        setDraggedComponent,
        dropTarget,
        setDropTarget,
        isDragging: draggedComponent !== null,
      }}
    >
      {children}
    </DragDropContext.Provider>
  )
}

export function useDragDrop() {
  const context = useContext(DragDropContext)
  if (context === undefined) {
    throw new Error("useDragDrop must be used within a DragDropProvider")
  }
  return context
}
