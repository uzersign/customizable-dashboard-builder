"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { useDashboard } from "./dashboard-context"
import { Layout, RotateCcw } from "lucide-react"
import { Separator } from "@/components/ui/separator"

const gridPresets = [
  { name: "Small (8x8)", rows: 8, cols: 8 },
  { name: "Medium (12x12)", rows: 12, cols: 12 },
  { name: "Large (16x16)", rows: 16, cols: 16 },
  { name: "Wide (12x24)", rows: 12, cols: 24 },
  { name: "Tall (24x12)", rows: 24, cols: 12 },
]

export function LayoutSettings() {
  const { config, updateConfig } = useDashboard()
  const [open, setOpen] = useState(false)

  const updateLayout = (updates: Partial<typeof config.layout>) => {
    updateConfig({
      layout: { ...config.layout, ...updates },
    })
  }

  const applyGridPreset = (preset: (typeof gridPresets)[0]) => {
    updateLayout({ rows: preset.rows, cols: preset.cols })
  }

  const resetLayout = () => {
    updateConfig({
      layout: {
        rows: 12,
        cols: 12,
        gap: 16,
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Layout className="h-4 w-4" />
          Layout
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Layout Settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Grid Presets */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Grid Presets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {gridPresets.map((preset) => (
                  <Button
                    key={preset.name}
                    variant="outline"
                    className="w-full justify-between bg-transparent"
                    onClick={() => applyGridPreset(preset)}
                  >
                    <span>{preset.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {preset.rows}×{preset.cols}
                    </span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Custom Grid Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Custom Grid</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs">Rows: {config.layout.rows}</Label>
                <Slider
                  value={[config.layout.rows]}
                  onValueChange={([value]) => updateLayout({ rows: value })}
                  min={4}
                  max={32}
                  step={1}
                  className="mt-2"
                />
              </div>
              <div>
                <Label className="text-xs">Columns: {config.layout.cols}</Label>
                <Slider
                  value={[config.layout.cols]}
                  onValueChange={([value]) => updateLayout({ cols: value })}
                  min={4}
                  max={32}
                  step={1}
                  className="mt-2"
                />
              </div>
              <div>
                <Label className="text-xs">Gap: {config.layout.gap}px</Label>
                <Slider
                  value={[config.layout.gap]}
                  onValueChange={([value]) => updateLayout({ gap: value })}
                  min={0}
                  max={40}
                  step={4}
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>

          {/* Grid Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="w-full h-32 border rounded-lg p-2"
                style={{
                  display: "grid",
                  gridTemplateRows: `repeat(${Math.min(config.layout.rows, 8)}, 1fr)`,
                  gridTemplateColumns: `repeat(${Math.min(config.layout.cols, 8)}, 1fr)`,
                  gap: `${Math.max(1, config.layout.gap / 4)}px`,
                }}
              >
                {Array.from({
                  length: Math.min(config.layout.rows, 8) * Math.min(config.layout.cols, 8),
                }).map((_, index) => (
                  <div key={index} className="bg-muted rounded-sm opacity-50" />
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                {config.layout.rows}×{config.layout.cols} grid with {config.layout.gap}px gap
              </p>
            </CardContent>
          </Card>

          <Separator />

          <div className="flex justify-between">
            <Button variant="outline" onClick={resetLayout}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset Layout
            </Button>
            <Button onClick={() => setOpen(false)}>Apply Changes</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
