"use client"

import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { ColorPicker } from "./color-picker"
import { useDashboard } from "./dashboard-context"
import { Settings, Palette, Layout, Type, BracketsIcon as Spacing, Code } from "lucide-react"

export function PropertyPanel() {
  const { selectedComponent, updateComponent } = useDashboard()
  const [activeTab, setActiveTab] = useState("properties")

  if (!selectedComponent) {
    return (
      <div className="h-full bg-white border-l border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Properties</h2>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <Settings className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Select a component to edit its properties</p>
          </div>
        </div>
      </div>
    )
  }

  const handlePropertyChange = (property: string, value: any) => {
    updateComponent(selectedComponent.id, {
      ...selectedComponent,
      props: {
        ...selectedComponent.props,
        [property]: value,
      },
    })
  }

  const handleStyleChange = (property: string, value: any) => {
    updateComponent(selectedComponent.id, {
      ...selectedComponent,
      style: {
        ...selectedComponent.style,
        [property]: value,
      },
    })
  }

  const renderPropertiesTab = () => {
    const componentType = selectedComponent.type
    const props = selectedComponent.props || {}

    return (
      <div className="space-y-6">
        {/* Basic Properties */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Basic Properties</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="component-name">Name</Label>
              <Input
                id="component-name"
                value={selectedComponent.name || ""}
                onChange={(e) =>
                  updateComponent(selectedComponent.id, {
                    ...selectedComponent,
                    name: e.target.value,
                  })
                }
              />
            </div>

            {/* Text Content */}
            {["heading", "paragraph", "button"].includes(componentType) && (
              <div>
                <Label htmlFor="text-content">Text</Label>
                <Input
                  id="text-content"
                  value={props.text || ""}
                  onChange={(e) => handlePropertyChange("text", e.target.value)}
                  placeholder="Enter text content"
                />
              </div>
            )}

            {/* Image Source */}
            {componentType === "image" && (
              <div>
                <Label htmlFor="image-src">Image URL</Label>
                <Input
                  id="image-src"
                  value={props.src || ""}
                  onChange={(e) => handlePropertyChange("src", e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            )}

            {/* Chart Data */}
            {["line-chart", "bar-chart", "pie-chart", "area-chart"].includes(componentType) && (
              <div>
                <Label htmlFor="chart-title">Chart Title</Label>
                <Input
                  id="chart-title"
                  value={props.title || ""}
                  onChange={(e) => handlePropertyChange("title", e.target.value)}
                  placeholder="Chart Title"
                />
              </div>
            )}

            {/* Button Variant */}
            {componentType === "button" && (
              <div>
                <Label htmlFor="button-variant">Variant</Label>
                <Select
                  value={props.variant || "default"}
                  onValueChange={(value) => handlePropertyChange("variant", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="destructive">Destructive</SelectItem>
                    <SelectItem value="outline">Outline</SelectItem>
                    <SelectItem value="secondary">Secondary</SelectItem>
                    <SelectItem value="ghost">Ghost</SelectItem>
                    <SelectItem value="link">Link</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Size */}
            {["button", "input"].includes(componentType) && (
              <div>
                <Label htmlFor="component-size">Size</Label>
                <Select value={props.size || "default"} onValueChange={(value) => handlePropertyChange("size", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sm">Small</SelectItem>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="lg">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Advanced Properties */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Advanced</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="disabled">Disabled</Label>
              <Switch
                id="disabled"
                checked={props.disabled || false}
                onCheckedChange={(checked) => handlePropertyChange("disabled", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="required">Required</Label>
              <Switch
                id="required"
                checked={props.required || false}
                onCheckedChange={(checked) => handlePropertyChange("required", checked)}
              />
            </div>

            {componentType === "input" && (
              <div>
                <Label htmlFor="placeholder">Placeholder</Label>
                <Input
                  id="placeholder"
                  value={props.placeholder || ""}
                  onChange={(e) => handlePropertyChange("placeholder", e.target.value)}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  const renderStyleTab = () => {
    const style = selectedComponent.style || {}

    return (
      <div className="space-y-6">
        {/* Layout */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Layout className="h-4 w-4" />
              Layout
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="width">Width</Label>
                <Input
                  id="width"
                  value={style.width || ""}
                  onChange={(e) => handleStyleChange("width", e.target.value)}
                  placeholder="auto"
                />
              </div>
              <div>
                <Label htmlFor="height">Height</Label>
                <Input
                  id="height"
                  value={style.height || ""}
                  onChange={(e) => handleStyleChange("height", e.target.value)}
                  placeholder="auto"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="display">Display</Label>
              <Select value={style.display || "block"} onValueChange={(value) => handleStyleChange("display", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="block">Block</SelectItem>
                  <SelectItem value="inline">Inline</SelectItem>
                  <SelectItem value="inline-block">Inline Block</SelectItem>
                  <SelectItem value="flex">Flex</SelectItem>
                  <SelectItem value="grid">Grid</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="position">Position</Label>
              <Select
                value={style.position || "static"}
                onValueChange={(value) => handleStyleChange("position", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="static">Static</SelectItem>
                  <SelectItem value="relative">Relative</SelectItem>
                  <SelectItem value="absolute">Absolute</SelectItem>
                  <SelectItem value="fixed">Fixed</SelectItem>
                  <SelectItem value="sticky">Sticky</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Spacing */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Spacing className="h-4 w-4" />
              Spacing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Margin</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Input
                  placeholder="Top"
                  value={style.marginTop || ""}
                  onChange={(e) => handleStyleChange("marginTop", e.target.value)}
                />
                <Input
                  placeholder="Right"
                  value={style.marginRight || ""}
                  onChange={(e) => handleStyleChange("marginRight", e.target.value)}
                />
                <Input
                  placeholder="Bottom"
                  value={style.marginBottom || ""}
                  onChange={(e) => handleStyleChange("marginBottom", e.target.value)}
                />
                <Input
                  placeholder="Left"
                  value={style.marginLeft || ""}
                  onChange={(e) => handleStyleChange("marginLeft", e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label>Padding</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Input
                  placeholder="Top"
                  value={style.paddingTop || ""}
                  onChange={(e) => handleStyleChange("paddingTop", e.target.value)}
                />
                <Input
                  placeholder="Right"
                  value={style.paddingRight || ""}
                  onChange={(e) => handleStyleChange("paddingRight", e.target.value)}
                />
                <Input
                  placeholder="Bottom"
                  value={style.paddingBottom || ""}
                  onChange={(e) => handleStyleChange("paddingBottom", e.target.value)}
                />
                <Input
                  placeholder="Left"
                  value={style.paddingLeft || ""}
                  onChange={(e) => handleStyleChange("paddingLeft", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Colors */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Colors
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Background Color</Label>
              <ColorPicker
                value={style.backgroundColor || "#ffffff"}
                onChange={(color) => handleStyleChange("backgroundColor", color)}
              />
            </div>

            <div>
              <Label>Text Color</Label>
              <ColorPicker value={style.color || "#000000"} onChange={(color) => handleStyleChange("color", color)} />
            </div>

            <div>
              <Label>Border Color</Label>
              <ColorPicker
                value={style.borderColor || "#e5e7eb"}
                onChange={(color) => handleStyleChange("borderColor", color)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Typography */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Type className="h-4 w-4" />
              Typography
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="font-family">Font Family</Label>
              <Select
                value={style.fontFamily || "inherit"}
                onValueChange={(value) => handleStyleChange("fontFamily", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inherit">Inherit</SelectItem>
                  <SelectItem value="Inter">Inter</SelectItem>
                  <SelectItem value="Arial">Arial</SelectItem>
                  <SelectItem value="Helvetica">Helvetica</SelectItem>
                  <SelectItem value="Georgia">Georgia</SelectItem>
                  <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Font Size</Label>
              <div className="flex items-center gap-2 mt-2">
                <Slider
                  value={[Number.parseInt(style.fontSize?.replace("px", "") || "16")]}
                  onValueChange={([value]) => handleStyleChange("fontSize", `${value}px`)}
                  max={72}
                  min={8}
                  step={1}
                  className="flex-1"
                />
                <span className="text-sm text-gray-500 min-w-[3rem]">{style.fontSize || "16px"}</span>
              </div>
            </div>

            <div>
              <Label htmlFor="font-weight">Font Weight</Label>
              <Select
                value={style.fontWeight || "normal"}
                onValueChange={(value) => handleStyleChange("fontWeight", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="bold">Bold</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                  <SelectItem value="200">200</SelectItem>
                  <SelectItem value="300">300</SelectItem>
                  <SelectItem value="400">400</SelectItem>
                  <SelectItem value="500">500</SelectItem>
                  <SelectItem value="600">600</SelectItem>
                  <SelectItem value="700">700</SelectItem>
                  <SelectItem value="800">800</SelectItem>
                  <SelectItem value="900">900</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="text-align">Text Align</Label>
              <Select
                value={style.textAlign || "left"}
                onValueChange={(value) => handleStyleChange("textAlign", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                  <SelectItem value="justify">Justify</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="h-full bg-white border-l border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-900">Properties</h2>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <Settings className="h-4 w-4" />
          </Button>
        </div>

        <div className="text-sm text-gray-600">
          {selectedComponent.name} ({selectedComponent.type})
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3 mx-4 mt-4">
          <TabsTrigger value="properties" className="text-xs">
            <Settings className="h-3 w-3 mr-1" />
            Props
          </TabsTrigger>
          <TabsTrigger value="style" className="text-xs">
            <Palette className="h-3 w-3 mr-1" />
            Style
          </TabsTrigger>
          <TabsTrigger value="advanced" className="text-xs">
            <Code className="h-3 w-3 mr-1" />
            Code
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1">
          <div className="p-4">
            <TabsContent value="properties" className="mt-0">
              {renderPropertiesTab()}
            </TabsContent>

            <TabsContent value="style" className="mt-0">
              {renderStyleTab()}
            </TabsContent>

            <TabsContent value="advanced" className="mt-0">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Code className="h-4 w-4" />
                    Custom CSS
                  </CardTitle>
                  <CardDescription>Add custom CSS styles for advanced customization</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="/* Custom CSS */&#10;.my-component {&#10;  /* Your styles here */&#10;}"
                    className="font-mono text-sm"
                    rows={10}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </ScrollArea>
      </Tabs>
    </div>
  )
}
