"use client"

import { useDashboard } from "./dashboard-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { ColorPicker } from "./color-picker"
import { Trash2, Copy, Move, RotateCcw } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

export function AdvancedPropertyPanel() {
  const { config, selectedComponent, updateComponent, removeComponent, duplicateComponent, updateConfig } =
    useDashboard()

  const component = config.components.find((c) => c.id === selectedComponent)

  if (!selectedComponent || !component) {
    return (
      <div className="h-full border-l bg-muted/30 p-4">
        <div className="text-center text-muted-foreground space-y-4">
          <div className="w-16 h-16 mx-auto bg-muted rounded-lg flex items-center justify-center">
            <Move className="w-8 h-8" />
          </div>
          <div>
            <p className="font-medium">No Component Selected</p>
            <p className="text-sm">Select a component to edit its properties</p>
          </div>
        </div>
      </div>
    )
  }

  const updateComponentProp = (key: string, value: any) => {
    updateComponent(selectedComponent, {
      props: { ...component.props, [key]: value },
    })
  }

  const updateComponentStyle = (key: string, value: any) => {
    updateComponent(selectedComponent, {
      style: { ...component.style, [key]: value },
    })
  }

  const updateGridArea = (key: string, value: number) => {
    updateComponent(selectedComponent, {
      gridArea: { ...component.gridArea!, [key]: value },
    })
  }

  return (
    <div className="h-full border-l bg-muted/30">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold">Properties</h2>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => duplicateComponent(selectedComponent)}
              title="Duplicate component"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeComponent(selectedComponent)}
              title="Delete component"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="capitalize">
            {component.type.replace("-", " ")}
          </Badge>
          <Badge variant="outline" className="text-xs">
            ID: {component.id.slice(0, 8)}
          </Badge>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Layout Properties */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Move className="w-4 h-4" />
                Layout & Position
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Row Start</Label>
                  <Input
                    type="number"
                    value={component.gridArea?.row || 1}
                    onChange={(e) => updateGridArea("row", Math.max(1, Number.parseInt(e.target.value)))}
                    min={1}
                    max={config.layout.rows}
                  />
                </div>
                <div>
                  <Label className="text-xs">Column Start</Label>
                  <Input
                    type="number"
                    value={component.gridArea?.col || 1}
                    onChange={(e) => updateGridArea("col", Math.max(1, Number.parseInt(e.target.value)))}
                    min={1}
                    max={config.layout.cols}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Row Span</Label>
                  <Input
                    type="number"
                    value={component.gridArea?.rowSpan || 1}
                    onChange={(e) => updateGridArea("rowSpan", Math.max(1, Number.parseInt(e.target.value)))}
                    min={1}
                    max={config.layout.rows}
                  />
                </div>
                <div>
                  <Label className="text-xs">Column Span</Label>
                  <Input
                    type="number"
                    value={component.gridArea?.colSpan || 1}
                    onChange={(e) => updateGridArea("colSpan", Math.max(1, Number.parseInt(e.target.value)))}
                    min={1}
                    max={config.layout.cols}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label className="text-xs">Quick Size Presets</Label>
                <div className="grid grid-cols-3 gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      updateGridArea("rowSpan", 2)
                      updateGridArea("colSpan", 3)
                    }}
                  >
                    Small
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      updateGridArea("rowSpan", 4)
                      updateGridArea("colSpan", 6)
                    }}
                  >
                    Medium
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      updateGridArea("rowSpan", 6)
                      updateGridArea("colSpan", 12)
                    }}
                  >
                    Large
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content Properties */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Content & Data</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {component.props.title !== undefined && (
                <div>
                  <Label className="text-xs">Title</Label>
                  <Input
                    value={component.props.title}
                    onChange={(e) => updateComponentProp("title", e.target.value)}
                    placeholder="Enter title..."
                  />
                </div>
              )}

              {component.props.content !== undefined && (
                <div>
                  <Label className="text-xs">Content</Label>
                  <Textarea
                    value={component.props.content}
                    onChange={(e) => updateComponentProp("content", e.target.value)}
                    placeholder="Enter content..."
                    rows={3}
                  />
                </div>
              )}

              {component.props.text !== undefined && (
                <div>
                  <Label className="text-xs">Button Text</Label>
                  <Input
                    value={component.props.text}
                    onChange={(e) => updateComponentProp("text", e.target.value)}
                    placeholder="Button text..."
                  />
                </div>
              )}

              {component.props.value !== undefined && (
                <div>
                  <Label className="text-xs">Value</Label>
                  <Input
                    value={component.props.value}
                    onChange={(e) => updateComponentProp("value", e.target.value)}
                    placeholder="Enter value..."
                  />
                </div>
              )}

              {component.props.variant !== undefined && (
                <div>
                  <Label className="text-xs">Variant</Label>
                  <Select
                    value={component.props.variant}
                    onValueChange={(value) => updateComponentProp("variant", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {component.type === "button" ? (
                        <>
                          <SelectItem value="default">Default</SelectItem>
                          <SelectItem value="destructive">Destructive</SelectItem>
                          <SelectItem value="outline">Outline</SelectItem>
                          <SelectItem value="secondary">Secondary</SelectItem>
                          <SelectItem value="ghost">Ghost</SelectItem>
                          <SelectItem value="link">Link</SelectItem>
                        </>
                      ) : (
                        <>
                          <SelectItem value="body">Body Text</SelectItem>
                          <SelectItem value="heading">Heading</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Style Properties */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Appearance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs">Background Color</Label>
                <ColorPicker
                  value={component.style?.backgroundColor || "#ffffff"}
                  onChange={(color) => updateComponentStyle("backgroundColor", color)}
                />
              </div>

              <div>
                <Label className="text-xs">Text Color</Label>
                <ColorPicker
                  value={component.style?.color || "#000000"}
                  onChange={(color) => updateComponentStyle("color", color)}
                />
              </div>

              <div>
                <Label className="text-xs">Border Radius ({component.style?.borderRadius || "8px"})</Label>
                <Slider
                  value={[Number.parseInt(component.style?.borderRadius?.replace("px", "") || "8")]}
                  onValueChange={([value]) => updateComponentStyle("borderRadius", `${value}px`)}
                  max={50}
                  step={1}
                  className="mt-2"
                />
              </div>

              <div>
                <Label className="text-xs">Padding ({component.style?.padding || "16px"})</Label>
                <Slider
                  value={[Number.parseInt(component.style?.padding?.replace("px", "") || "16")]}
                  onValueChange={([value]) => updateComponentStyle("padding", `${value}px`)}
                  max={60}
                  step={4}
                  className="mt-2"
                />
              </div>

              <div>
                <Label className="text-xs">Border Width</Label>
                <Slider
                  value={[Number.parseInt(component.style?.borderWidth?.replace("px", "") || "1")]}
                  onValueChange={([value]) => updateComponentStyle("borderWidth", `${value}px`)}
                  max={10}
                  step={1}
                  className="mt-2"
                />
              </div>

              <div>
                <Label className="text-xs">Border Color</Label>
                <ColorPicker
                  value={component.style?.borderColor || "#e5e7eb"}
                  onChange={(color) => updateComponentStyle("borderColor", color)}
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label className="text-xs">Shadow</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={component.style?.boxShadow !== "none"}
                    onCheckedChange={(checked) =>
                      updateComponentStyle("boxShadow", checked ? "0 4px 6px -1px rgba(0, 0, 0, 0.1)" : "none")
                    }
                  />
                  <span className="text-xs">Enable shadow</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Animation Properties */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Animation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs">Hover Effect</Label>
                <Select
                  value={component.style?.transition || "none"}
                  onValueChange={(value) => updateComponentStyle("transition", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="all 0.2s ease">Smooth</SelectItem>
                    <SelectItem value="transform 0.2s ease">Transform</SelectItem>
                    <SelectItem value="opacity 0.2s ease">Fade</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Reset Button */}
          <Button
            variant="outline"
            className="w-full bg-transparent"
            onClick={() => {
              updateComponent(selectedComponent, {
                style: {
                  padding: "16px",
                  borderRadius: "8px",
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                },
              })
            }}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset Styles
          </Button>
        </div>
      </ScrollArea>
    </div>
  )
}
