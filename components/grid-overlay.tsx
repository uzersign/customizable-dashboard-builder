"use client"

import { useDashboard } from "./dashboard-context"

export function GridOverlay() {
  const { layout } = useDashboard()
  const gridColumns = layout.content.gridColumns || 12
  const gap = layout.content.gap || "md"

  const getGapSize = () => {
    switch (gap) {
      case "none":
        return 0
      case "sm":
        return 8
      case "md":
        return 16
      case "lg":
        return 24
      case "xl":
        return 32
      default:
        return 16
    }
  }

  return (
    <div
      className="absolute inset-0 pointer-events-none z-0 opacity-20"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
        gap: `${getGapSize()}px`,
        padding: "16px",
      }}
    >
      {Array.from({ length: gridColumns }).map((_, index) => (
        <div key={index} className="bg-blue-200 border border-blue-300 rounded-sm min-h-[20px]" />
      ))}
    </div>
  )
}
