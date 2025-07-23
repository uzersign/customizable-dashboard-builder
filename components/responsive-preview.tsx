"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Monitor, Tablet, Smartphone } from "lucide-react"
import { useDashboard } from "./dashboard-context"
import { DashboardRenderer } from "./dashboard-renderer"

const viewports = [
  { name: "Desktop", icon: Monitor, width: "100%", height: "100%" },
  { name: "Tablet", icon: Tablet, width: "768px", height: "1024px" },
  { name: "Mobile", icon: Smartphone, width: "375px", height: "667px" },
]

export function ResponsivePreview() {
  const [currentViewport, setCurrentViewport] = useState(0)
  const { config } = useDashboard()

  return (
    <div className="h-full flex flex-col">
      <div className="border-b p-2 flex items-center justify-center gap-1">
        {viewports.map((viewport, index) => (
          <Button
            key={viewport.name}
            variant={currentViewport === index ? "default" : "ghost"}
            size="sm"
            onClick={() => setCurrentViewport(index)}
          >
            <viewport.icon className="w-4 h-4 mr-1" />
            {viewport.name}
          </Button>
        ))}
      </div>

      <div className="flex-1 p-4 bg-muted/30 flex items-center justify-center">
        <Card
          className="bg-white shadow-lg transition-all duration-300"
          style={{
            width: viewports[currentViewport].width,
            height: viewports[currentViewport].height,
            maxWidth: "100%",
            maxHeight: "100%",
          }}
        >
          <CardContent className="p-0 h-full overflow-auto">
            <div
              style={{
                backgroundColor: config.theme.backgroundColor,
                minHeight: "100%",
              }}
            >
              <DashboardRenderer />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
