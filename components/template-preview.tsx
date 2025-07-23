"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, Download, Palette, Layout, BarChart3, Settings, Zap, Star, CheckCircle } from "lucide-react"

interface TemplatePreviewProps {
  template: any
  open: boolean
  onOpenChange: (open: boolean) => void
  onApply: (template: any) => void
}

export function TemplatePreview({ template, open, onOpenChange, onApply }: TemplatePreviewProps) {
  const [selectedView, setSelectedView] = useState("overview")

  if (!template) return null

  const features = [
    "Responsive Design",
    "Interactive Charts",
    "Real-time Data",
    "Export Functionality",
    "Custom Themes",
    "Mobile Optimized",
    "Print Ready",
    "Accessibility Compliant",
  ]

  const specifications = [
    { label: "Components", value: template.components?.length || 0 },
    { label: "Pages/Views", value: template.pages || 1 },
    { label: "Chart Types", value: "5+" },
    { label: "Color Themes", value: "4" },
    { label: "Export Formats", value: "3" },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl">{template.name}</DialogTitle>
              <p className="text-muted-foreground mt-1">{template.description}</p>
            </div>
            <Badge variant="secondary" className="text-sm">
              {template.category}
            </Badge>
          </div>
        </DialogHeader>

        <Tabs value={selectedView} onValueChange={setSelectedView} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="components">Components</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="customization">Customization</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[60vh] mt-4">
            <TabsContent value="overview" className="space-y-6">
              {/* Template Preview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Template Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Interactive Preview</p>
                      <p className="text-sm text-gray-400">Full preview available after applying template</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Specifications */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {specifications.map((spec, index) => (
                  <Card key={index}>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-primary">{spec.value}</div>
                      <div className="text-sm text-muted-foreground">{spec.label}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="components" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Included Components</CardTitle>
                  <CardDescription>
                    This template includes {template.components?.length || 0} pre-configured components
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {template.components?.slice(0, 9).map((component: any, index: number) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-3 h-3 bg-primary rounded-full"></div>
                          <span className="font-medium capitalize">{component.type.replace("-", " ")}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{component.props?.title || "Component"}</p>
                      </div>
                    )) || []}
                  </div>
                  {template.components?.length > 9 && (
                    <p className="text-center text-muted-foreground mt-4">
                      +{template.components.length - 9} more components...
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="features" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Template Features
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>What You Get</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Layout className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="font-medium">Professional Layout</p>
                      <p className="text-sm text-muted-foreground">
                        Carefully designed grid system with optimal spacing
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <BarChart3 className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="font-medium">Interactive Charts</p>
                      <p className="text-sm text-muted-foreground">
                        Dynamic data visualization with Chart.js integration
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Palette className="w-5 h-5 text-purple-500" />
                    <div>
                      <p className="font-medium">Custom Styling</p>
                      <p className="text-sm text-muted-foreground">
                        Branded colors and typography that match your needs
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Download className="w-5 h-5 text-orange-500" />
                    <div>
                      <p className="font-medium">Export Ready</p>
                      <p className="text-sm text-muted-foreground">
                        Generate standalone HTML, CSS, and JavaScript files
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="customization" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Customization Options
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Colors & Branding</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Easily customize colors, fonts, and branding to match your organization
                    </p>
                    <div className="flex gap-2">
                      <div className="w-8 h-8 bg-blue-500 rounded"></div>
                      <div className="w-8 h-8 bg-green-500 rounded"></div>
                      <div className="w-8 h-8 bg-purple-500 rounded"></div>
                      <div className="w-8 h-8 bg-orange-500 rounded"></div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Layout Flexibility</h4>
                    <p className="text-sm text-muted-foreground">
                      Drag and drop components, resize elements, and create custom layouts
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Data Integration</h4>
                    <p className="text-sm text-muted-foreground">
                      Connect to your data sources or use sample data to get started quickly
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Export Options</h4>
                    <p className="text-sm text-muted-foreground">
                      Export as complete HTML project, PDF reports, or individual components
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-sm text-muted-foreground">Professional Template</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={() => onApply(template)} className="bg-primary">
              <Download className="w-4 h-4 mr-2" />
              Use This Template
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
