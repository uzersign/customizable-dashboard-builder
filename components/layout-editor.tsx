"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Layout, Sidebar, HeadingIcon as Header, FootprintsIcon as Footer, Grid } from "lucide-react"
import { useDashboard } from "./dashboard-context"

interface LayoutEditorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LayoutEditor({ open, onOpenChange }: LayoutEditorProps) {
  const { config, updateConfig } = useDashboard()
  const [selectedSection, setSelectedSection] = useState<string>("header")

  // Safe access to layout with defaults
  const layout = config?.layout || {
    header: { enabled: true, height: "64px", background: "white", padding: "16px 24px" },
    sidebar: {
      enabled: true,
      width: "256px",
      position: "left",
      collapsible: false,
      background: "gray-50",
      padding: "16px",
    },
    content: { container: "fluid", gridColumns: 12, gap: "md", background: "white", padding: "24px" },
    footer: { enabled: false, height: "48px", background: "gray-50", padding: "16px 24px" },
  }

  const layoutSections = [
    { id: "header", name: "Header", icon: Header, enabled: layout.header?.enabled || false },
    { id: "sidebar", name: "Sidebar", icon: Sidebar, enabled: layout.sidebar?.enabled || false },
    { id: "content", name: "Content", icon: Grid, enabled: true },
    { id: "footer", name: "Footer", icon: Footer, enabled: layout.footer?.enabled || false },
  ]

  const handleSectionToggle = (sectionId: string, enabled: boolean) => {
    const newLayout = {
      ...layout,
      [sectionId]: {
        ...layout[sectionId as keyof typeof layout],
        enabled,
      },
    }
    updateConfig({
      ...config,
      layout: {
        ...config.layout,
        ...newLayout,
      },
    })
  }

  const handleSectionUpdate = (sectionId: string, updates: any) => {
    const newLayout = {
      ...layout,
      [sectionId]: {
        ...layout[sectionId as keyof typeof layout],
        ...updates,
      },
    }
    updateConfig({
      ...config,
      layout: {
        ...config.layout,
        ...newLayout,
      },
    })
  }

  const renderSectionSettings = () => {
    const section = layout[selectedSection as keyof typeof layout]
    if (!section) return null

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Label htmlFor={`${selectedSection}-enabled`}>Enable {selectedSection}</Label>
          <Switch
            id={`${selectedSection}-enabled`}
            checked={section.enabled || false}
            onCheckedChange={(enabled) => handleSectionToggle(selectedSection, enabled)}
          />
        </div>

        {section.enabled && (
          <>
            <Separator />

            {/* Height Settings */}
            <div className="space-y-3">
              <Label>Height</Label>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Auto</span>
                  <span className="text-sm text-gray-600">{section.height || "auto"}</span>
                </div>
                {selectedSection !== "content" && (
                  <Slider
                    value={[Number.parseInt(section.height?.replace("px", "") || "60")]}
                    onValueChange={([value]) => handleSectionUpdate(selectedSection, { height: `${value}px` })}
                    max={200}
                    min={40}
                    step={10}
                    className="w-full"
                  />
                )}
              </div>
            </div>

            {/* Background Settings */}
            <div className="space-y-3">
              <Label>Background</Label>
              <Select
                value={section.background || "white"}
                onValueChange={(value) => handleSectionUpdate(selectedSection, { background: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="white">White</SelectItem>
                  <SelectItem value="gray-50">Light Gray</SelectItem>
                  <SelectItem value="gray-100">Gray</SelectItem>
                  <SelectItem value="blue-50">Light Blue</SelectItem>
                  <SelectItem value="blue-600">Blue</SelectItem>
                  <SelectItem value="gray-900">Dark</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Padding Settings */}
            <div className="space-y-3">
              <Label>Padding</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs">Horizontal</Label>
                  <Slider
                    value={[Number.parseInt(section.padding?.split(" ")[1]?.replace("px", "") || "16")]}
                    onValueChange={([value]) => {
                      const vertical = section.padding?.split(" ")[0] || "16px"
                      handleSectionUpdate(selectedSection, { padding: `${vertical} ${value}px` })
                    }}
                    max={64}
                    min={0}
                    step={4}
                  />
                </div>
                <div>
                  <Label className="text-xs">Vertical</Label>
                  <Slider
                    value={[Number.parseInt(section.padding?.split(" ")[0]?.replace("px", "") || "16")]}
                    onValueChange={([value]) => {
                      const horizontal = section.padding?.split(" ")[1] || "16px"
                      handleSectionUpdate(selectedSection, { padding: `${value}px ${horizontal}` })
                    }}
                    max={64}
                    min={0}
                    step={4}
                  />
                </div>
              </div>
            </div>

            {/* Sidebar specific settings */}
            {selectedSection === "sidebar" && (
              <>
                <Separator />
                <div className="space-y-3">
                  <Label>Position</Label>
                  <Select
                    value={section.position || "left"}
                    onValueChange={(value) => handleSectionUpdate(selectedSection, { position: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>Width</Label>
                  <Slider
                    value={[Number.parseInt(section.width?.replace("px", "") || "250")]}
                    onValueChange={([value]) => handleSectionUpdate(selectedSection, { width: `${value}px` })}
                    max={400}
                    min={200}
                    step={10}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="sidebar-collapsible">Collapsible</Label>
                  <Switch
                    id="sidebar-collapsible"
                    checked={section.collapsible || false}
                    onCheckedChange={(collapsible) => handleSectionUpdate(selectedSection, { collapsible })}
                  />
                </div>
              </>
            )}

            {/* Content specific settings */}
            {selectedSection === "content" && (
              <>
                <Separator />
                <div className="space-y-3">
                  <Label>Container</Label>
                  <Select
                    value={section.container || "fluid"}
                    onValueChange={(value) => handleSectionUpdate(selectedSection, { container: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fluid">Fluid</SelectItem>
                      <SelectItem value="fixed">Fixed Width</SelectItem>
                      <SelectItem value="centered">Centered</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>Grid Columns</Label>
                  <Slider
                    value={[section.gridColumns || 12]}
                    onValueChange={([value]) => handleSectionUpdate(selectedSection, { gridColumns: value })}
                    max={24}
                    min={6}
                    step={1}
                  />
                  <div className="text-sm text-gray-600">{section.gridColumns || 12} columns</div>
                </div>

                <div className="space-y-3">
                  <Label>Gap</Label>
                  <Select
                    value={section.gap || "md"}
                    onValueChange={(value) => handleSectionUpdate(selectedSection, { gap: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="sm">Small</SelectItem>
                      <SelectItem value="md">Medium</SelectItem>
                      <SelectItem value="lg">Large</SelectItem>
                      <SelectItem value="xl">Extra Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </>
        )}
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Layout className="h-5 w-5" />
            Layout Editor
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="structure" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="structure">Structure</TabsTrigger>
            <TabsTrigger value="responsive">Responsive</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="structure" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Layout Preview */}
              <Card>
                <CardHeader>
                  <CardTitle>Layout Preview</CardTitle>
                  <CardDescription>Visual representation of your layout structure</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg p-4 bg-gray-50 min-h-[300px]">
                    {/* Header */}
                    {layout.header?.enabled && (
                      <div
                        className={`bg-blue-100 border border-blue-200 rounded mb-2 p-2 text-center text-sm cursor-pointer ${
                          selectedSection === "header" ? "ring-2 ring-blue-500" : ""
                        }`}
                        onClick={() => setSelectedSection("header")}
                        style={{ height: layout.header.height || "60px" }}
                      >
                        Header
                      </div>
                    )}

                    <div className="flex gap-2 flex-1">
                      {/* Sidebar */}
                      {layout.sidebar?.enabled && (
                        <div
                          className={`bg-green-100 border border-green-200 rounded p-2 text-center text-sm cursor-pointer ${
                            selectedSection === "sidebar" ? "ring-2 ring-blue-500" : ""
                          }`}
                          onClick={() => setSelectedSection("sidebar")}
                          style={{
                            width: layout.sidebar.width || "250px",
                            minHeight: "200px",
                          }}
                        >
                          Sidebar
                        </div>
                      )}

                      {/* Content */}
                      <div
                        className={`bg-yellow-100 border border-yellow-200 rounded p-2 text-center text-sm flex-1 cursor-pointer ${
                          selectedSection === "content" ? "ring-2 ring-blue-500" : ""
                        }`}
                        onClick={() => setSelectedSection("content")}
                        style={{ minHeight: "200px" }}
                      >
                        Content Area
                      </div>
                    </div>

                    {/* Footer */}
                    {layout.footer?.enabled && (
                      <div
                        className={`bg-purple-100 border border-purple-200 rounded mt-2 p-2 text-center text-sm cursor-pointer ${
                          selectedSection === "footer" ? "ring-2 ring-blue-500" : ""
                        }`}
                        onClick={() => setSelectedSection("footer")}
                        style={{ height: layout.footer.height || "60px" }}
                      >
                        Footer
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Section Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Section Settings</CardTitle>
                  <CardDescription>Configure the selected section</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Section Selector */}
                    <div className="grid grid-cols-2 gap-2">
                      {layoutSections.map((section) => {
                        const Icon = section.icon
                        return (
                          <Button
                            key={section.id}
                            variant={selectedSection === section.id ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedSection(section.id)}
                            className="flex items-center gap-2"
                          >
                            <Icon className="h-4 w-4" />
                            {section.name}
                          </Button>
                        )
                      })}
                    </div>

                    <Separator />

                    {/* Section Configuration */}
                    {renderSectionSettings()}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="responsive" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Responsive Settings</CardTitle>
                <CardDescription>Configure how your layout adapts to different screen sizes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Mobile</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-xs">Hide Sidebar</Label>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="text-xs">Stack Layout</Label>
                          <Switch defaultChecked />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Tablet</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-xs">Collapse Sidebar</Label>
                          <Switch />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="text-xs">Reduce Padding</Label>
                          <Switch defaultChecked />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Desktop</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-xs">Full Layout</Label>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="text-xs">Fixed Sidebar</Label>
                          <Switch defaultChecked />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Layout Options</CardTitle>
                <CardDescription>Fine-tune your layout with advanced settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label>Layout Type</Label>
                    <Select defaultValue="standard">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="boxed">Boxed</SelectItem>
                        <SelectItem value="full-width">Full Width</SelectItem>
                        <SelectItem value="centered">Centered</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label>Animation</Label>
                    <Select defaultValue="none">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="fade">Fade</SelectItem>
                        <SelectItem value="slide">Slide</SelectItem>
                        <SelectItem value="scale">Scale</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Sticky Header</Label>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Sticky Sidebar</Label>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Smooth Scrolling</Label>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => onOpenChange(false)}>Apply Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
