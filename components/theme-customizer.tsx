"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ColorPicker } from "./color-picker"
import { useDashboard } from "./dashboard-context"
import { Palette, RotateCcw } from "lucide-react"
import { Separator } from "@/components/ui/separator"

const fontFamilies = [
  { value: "Inter", label: "Inter" },
  { value: "Roboto", label: "Roboto" },
  { value: "Open Sans", label: "Open Sans" },
  { value: "Lato", label: "Lato" },
  { value: "Montserrat", label: "Montserrat" },
  { value: "Poppins", label: "Poppins" },
  { value: "Source Sans Pro", label: "Source Sans Pro" },
]

const presetThemes = [
  {
    name: "Default",
    theme: {
      primaryColor: "#3b82f6",
      secondaryColor: "#64748b",
      backgroundColor: "#ffffff",
      textColor: "#1f2937",
      fontFamily: "Inter",
      fontSize: "14px",
    },
  },
  {
    name: "Dark",
    theme: {
      primaryColor: "#60a5fa",
      secondaryColor: "#94a3b8",
      backgroundColor: "#111827",
      textColor: "#f9fafb",
      fontFamily: "Inter",
      fontSize: "14px",
    },
  },
  {
    name: "Corporate",
    theme: {
      primaryColor: "#1e40af",
      secondaryColor: "#475569",
      backgroundColor: "#f8fafc",
      textColor: "#0f172a",
      fontFamily: "Roboto",
      fontSize: "14px",
    },
  },
  {
    name: "Vibrant",
    theme: {
      primaryColor: "#7c3aed",
      secondaryColor: "#f59e0b",
      backgroundColor: "#fefefe",
      textColor: "#374151",
      fontFamily: "Poppins",
      fontSize: "15px",
    },
  },
]

export function ThemeCustomizer() {
  const { config, updateConfig } = useDashboard()
  const [open, setOpen] = useState(false)

  const updateTheme = (updates: Partial<typeof config.theme>) => {
    updateConfig({
      theme: { ...config.theme, ...updates },
    })
  }

  const applyPresetTheme = (preset: (typeof presetThemes)[0]) => {
    updateConfig({ theme: preset.theme })
  }

  const resetTheme = () => {
    updateConfig({
      theme: {
        primaryColor: "#3b82f6",
        secondaryColor: "#64748b",
        backgroundColor: "#ffffff",
        textColor: "#1f2937",
        fontFamily: "Inter",
        fontSize: "14px",
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Palette className="h-4 w-4" />
          Theme
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Theme Customization</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Preset Themes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Preset Themes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {presetThemes.map((preset) => (
                  <Button
                    key={preset.name}
                    variant="outline"
                    className="h-auto p-3 flex flex-col items-start bg-transparent"
                    onClick={() => applyPresetTheme(preset)}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: preset.theme.primaryColor }}
                      />
                      <span className="font-medium">{preset.name}</span>
                    </div>
                    <div className="flex gap-1">
                      <div className="w-3 h-3 rounded" style={{ backgroundColor: preset.theme.primaryColor }} />
                      <div className="w-3 h-3 rounded" style={{ backgroundColor: preset.theme.secondaryColor }} />
                      <div
                        className="w-3 h-3 rounded border"
                        style={{ backgroundColor: preset.theme.backgroundColor }}
                      />
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Color Customization */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Colors</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs">Primary Color</Label>
                  <ColorPicker
                    value={config.theme.primaryColor}
                    onChange={(color) => updateTheme({ primaryColor: color })}
                  />
                </div>
                <div>
                  <Label className="text-xs">Secondary Color</Label>
                  <ColorPicker
                    value={config.theme.secondaryColor}
                    onChange={(color) => updateTheme({ secondaryColor: color })}
                  />
                </div>
                <div>
                  <Label className="text-xs">Background Color</Label>
                  <ColorPicker
                    value={config.theme.backgroundColor}
                    onChange={(color) => updateTheme({ backgroundColor: color })}
                  />
                </div>
                <div>
                  <Label className="text-xs">Text Color</Label>
                  <ColorPicker value={config.theme.textColor} onChange={(color) => updateTheme({ textColor: color })} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Typography */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Typography</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs">Font Family</Label>
                <Select value={config.theme.fontFamily} onValueChange={(value) => updateTheme({ fontFamily: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fontFamilies.map((font) => (
                      <SelectItem key={font.value} value={font.value}>
                        <span style={{ fontFamily: font.value }}>{font.label}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Base Font Size</Label>
                <Input
                  value={config.theme.fontSize}
                  onChange={(e) => updateTheme({ fontSize: e.target.value })}
                  placeholder="14px"
                />
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="p-4 rounded-lg border"
                style={{
                  backgroundColor: config.theme.backgroundColor,
                  color: config.theme.textColor,
                  fontFamily: config.theme.fontFamily,
                  fontSize: config.theme.fontSize,
                }}
              >
                <h3 className="font-semibold mb-2" style={{ color: config.theme.primaryColor }}>
                  Sample Dashboard Component
                </h3>
                <p className="mb-3">This is how your dashboard will look with the current theme settings.</p>
                <div className="flex gap-2">
                  <div
                    className="px-3 py-1 rounded text-white text-sm"
                    style={{ backgroundColor: config.theme.primaryColor }}
                  >
                    Primary Button
                  </div>
                  <div
                    className="px-3 py-1 rounded text-white text-sm"
                    style={{ backgroundColor: config.theme.secondaryColor }}
                  >
                    Secondary Button
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator />

          <div className="flex justify-between">
            <Button variant="outline" onClick={resetTheme}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset to Default
            </Button>
            <Button onClick={() => setOpen(false)}>Apply Changes</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
