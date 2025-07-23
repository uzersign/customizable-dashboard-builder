"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Download, Code, Globe, FileText, Package, Settings, CheckCircle, Copy } from "lucide-react"
import { useDashboard } from "./dashboard-context"
import { toast } from "sonner"

interface ExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ExportDialog({ open, onOpenChange }: ExportDialogProps) {
  const { config } = useDashboard()
  const [exportType, setExportType] = useState<"html" | "react" | "vue" | "angular">("html")
  const [exportFormat, setExportFormat] = useState<"zip" | "folder" | "cdn">("zip")
  const [includeAssets, setIncludeAssets] = useState(true)
  const [minifyCode, setMinifyCode] = useState(true)
  const [includeComments, setIncludeComments] = useState(false)
  const [responsive, setResponsive] = useState(true)
  const [darkMode, setDarkMode] = useState(true)
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)
  const [exportComplete, setExportComplete] = useState(false)

  // Toast queue management - completely isolated from render cycle
  const toastQueueRef = useRef<Array<{ message: string; type: "success" | "error" }>>([])
  const isProcessingRef = useRef(false)
  const mountedRef = useRef(true)

  // Safe toast function that ensures complete isolation from render cycle
  const safeToast = useCallback((message: string, type: "success" | "error" = "success") => {
    if (!mountedRef.current) return

    toastQueueRef.current.push({ message, type })

    if (isProcessingRef.current) return
    isProcessingRef.current = true

    // Multiple async boundaries to ensure complete isolation
    setTimeout(() => {
      if (!mountedRef.current) {
        isProcessingRef.current = false
        return
      }

      requestAnimationFrame(() => {
        if (!mountedRef.current) {
          isProcessingRef.current = false
          return
        }

        setTimeout(() => {
          if (!mountedRef.current) {
            isProcessingRef.current = false
            return
          }

          try {
            const toastsToProcess = [...toastQueueRef.current]
            toastQueueRef.current = []

            toastsToProcess.forEach(({ message, type }) => {
              if (mountedRef.current) {
                if (type === "success") {
                  toast.success(message)
                } else {
                  toast.error(message)
                }
              }
            })
          } catch (error) {
            console.error("Toast error:", error)
          } finally {
            isProcessingRef.current = false
          }
        }, 100)
      })
    }, 0)
  }, [])

  // Component lifecycle management
  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      isProcessingRef.current = false
      toastQueueRef.current = []
    }
  }, [])

  // Safe access to config properties with defaults
  const projectName = config?.name?.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase() || "dashboard-project"
  const theme = config?.theme || { mode: "light", primaryColor: "#3b82f6" }
  const layout = config?.layout || { type: "grid", rows: 12, cols: 12 }
  const metadata = config?.metadata || { version: "1.0.0", tags: [] }

  const handleExport = useCallback(async () => {
    setIsExporting(true)
    setExportProgress(0)
    setExportComplete(false)

    try {
      // Simulate export progress
      const steps = [
        "Analyzing dashboard structure...",
        "Generating HTML markup...",
        "Processing CSS styles...",
        "Bundling JavaScript...",
        "Optimizing assets...",
        "Creating package...",
      ]

      for (let i = 0; i < steps.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 800))
        setExportProgress(((i + 1) / steps.length) * 100)
      }

      // Generate export content
      const exportContent = generateExportContent()

      // Create and download file
      const blob = new Blob([exportContent], { type: "application/zip" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${projectName}.${exportFormat === "zip" ? "zip" : "html"}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setExportComplete(true)
      safeToast("Dashboard exported successfully!")
    } catch (error) {
      safeToast("Export failed. Please try again.", "error")
    } finally {
      setIsExporting(false)
    }
  }, [exportFormat, projectName, safeToast])

  const generateExportContent = useCallback(() => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${config?.name || "Dashboard"}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        :root {
            --primary-color: ${theme.primaryColor};
            --background-color: ${theme.backgroundColor || "#ffffff"};
            --text-color: ${theme.textColor || "#1f2937"};
        }
        ${minifyCode ? "" : "/* Generated styles */"}
        .dashboard-grid {
            display: grid;
            grid-template-columns: repeat(${layout.cols}, 1fr);
            grid-template-rows: repeat(${layout.rows}, minmax(60px, auto));
            gap: ${layout.gap || 16}px;
        }
        ${
          responsive
            ? `
        @media (max-width: 768px) {
            .dashboard-grid {
                grid-template-columns: 1fr;
            }
        }
        `
            : ""
        }
    </style>
</head>
<body class="bg-gray-50">
    <div class="min-h-screen">
        ${generateDashboardHTML()}
    </div>
    <script>
        ${generateDashboardJS()}
    </script>
</body>
</html>`

    return htmlContent
  }, [config?.name, theme, layout, minifyCode, responsive])

  const generateDashboardHTML = useCallback(() => {
    return `
    <div class="dashboard-container">
        <header class="bg-white shadow-sm border-b px-6 py-4">
            <h1 class="text-2xl font-bold text-gray-900">${config?.name || "Dashboard"}</h1>
        </header>
        <main class="p-6">
            <div class="dashboard-grid">
                ${(config?.components || [])
                  .map(
                    (component) => `
                    <div class="dashboard-component bg-white rounded-lg shadow p-4" 
                         style="grid-area: ${component.gridArea?.row || 1} / ${component.gridArea?.col || 1} / span ${component.gridArea?.rowSpan || 1} / span ${component.gridArea?.colSpan || 1}">
                        ${generateComponentHTML(component)}
                    </div>
                `,
                  )
                  .join("")}
            </div>
        </main>
    </div>`
  }, [config?.name, config?.components])

  const generateComponentHTML = useCallback((component: any) => {
    switch (component.type) {
      case "card":
        return `<div class="card">
                    <h3 class="text-lg font-semibold mb-2">${component.props?.title || "Card Title"}</h3>
                    <p class="text-gray-600">${component.props?.content || "Card content goes here."}</p>
                </div>`
      case "chart":
        return `<div class="chart-container">
                    <canvas id="chart-${component.id}" width="400" height="200"></canvas>
                </div>`
      case "table":
        return `<div class="table-container">
                    <table class="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr class="bg-gray-50">
                                <th class="border border-gray-300 px-4 py-2">Column 1</th>
                                <th class="border border-gray-300 px-4 py-2">Column 2</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="border border-gray-300 px-4 py-2">Data 1</td>
                                <td class="border border-gray-300 px-4 py-2">Data 2</td>
                            </tr>
                        </tbody>
                    </table>
                </div>`
      default:
        return `<div class="component-${component.type}">
                    <p>Component: ${component.type}</p>
                </div>`
    }
  }, [])

  const generateDashboardJS = useCallback(() => {
    const chartComponents = (config?.components || []).filter((c) => c.type === "chart")

    return `
    // Initialize charts
    ${chartComponents
      .map(
        (component) => `
    const ctx${component.id} = document.getElementById('chart-${component.id}');
    if (ctx${component.id}) {
        new Chart(ctx${component.id}, {
            type: '${component.props?.chartType || "line"}',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: '${component.props?.title || "Dataset"}',
                    data: [12, 19, 3, 5, 2, 3],
                    borderColor: '${theme.primaryColor}',
                    backgroundColor: '${theme.primaryColor}20'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }
    `,
      )
      .join("")}
    
    // Add interactivity
    console.log('Dashboard loaded successfully');
    `
  }, [config?.components, theme.primaryColor])

  const copyToClipboard = useCallback(
    (text: string) => {
      navigator.clipboard.writeText(text)
      safeToast("Copied to clipboard!")
    },
    [safeToast],
  )

  const exportOptions = [
    { value: "html", label: "HTML + CSS + JS", icon: Code, description: "Static HTML with inline styles" },
    { value: "react", label: "React Components", icon: Code, description: "JSX components with hooks" },
    { value: "vue", label: "Vue Components", icon: Code, description: "Vue 3 composition API" },
    { value: "angular", label: "Angular Components", icon: Code, description: "Angular 15+ components" },
  ]

  const formatOptions = [
    { value: "zip", label: "ZIP Archive", icon: Package, description: "Complete project in ZIP file" },
    { value: "folder", label: "Folder Structure", icon: FileText, description: "Organized file structure" },
    { value: "cdn", label: "CDN Ready", icon: Globe, description: "Single HTML with CDN links" },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Dashboard
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="settings" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="settings">Export Settings</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Project Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Project Information</CardTitle>
                  <CardDescription>Basic details about your dashboard</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="project-name">Project Name</Label>
                    <Input id="project-name" value={config?.name || ""} placeholder="My Dashboard" readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="project-description">Description</Label>
                    <Textarea
                      id="project-description"
                      value={config?.description || ""}
                      placeholder="Dashboard description..."
                      readOnly
                      rows={3}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(metadata.tags || []).map((tag: string, index: number) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Export Type */}
              <Card>
                <CardHeader>
                  <CardTitle>Export Format</CardTitle>
                  <CardDescription>Choose your preferred output format</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {exportOptions.map((option) => {
                      const Icon = option.icon
                      return (
                        <div
                          key={option.value}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            exportType === option.value
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => setExportType(option.value as any)}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="h-5 w-5" />
                            <div>
                              <div className="font-medium">{option.label}</div>
                              <div className="text-sm text-gray-500">{option.description}</div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Package Format */}
              <Card>
                <CardHeader>
                  <CardTitle>Package Format</CardTitle>
                  <CardDescription>How to package your exported files</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {formatOptions.map((option) => {
                      const Icon = option.icon
                      return (
                        <div
                          key={option.value}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            exportFormat === option.value
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => setExportFormat(option.value as any)}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="h-5 w-5" />
                            <div>
                              <div className="font-medium">{option.label}</div>
                              <div className="text-sm text-gray-500">{option.description}</div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Export Options */}
              <Card>
                <CardHeader>
                  <CardTitle>Export Options</CardTitle>
                  <CardDescription>Customize your export settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Include Assets</Label>
                      <p className="text-sm text-gray-500">Include images and other assets</p>
                    </div>
                    <Switch checked={includeAssets} onCheckedChange={setIncludeAssets} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Minify Code</Label>
                      <p className="text-sm text-gray-500">Compress CSS and JavaScript</p>
                    </div>
                    <Switch checked={minifyCode} onCheckedChange={setMinifyCode} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Include Comments</Label>
                      <p className="text-sm text-gray-500">Add helpful code comments</p>
                    </div>
                    <Switch checked={includeComments} onCheckedChange={setIncludeComments} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Responsive Design</Label>
                      <p className="text-sm text-gray-500">Include mobile breakpoints</p>
                    </div>
                    <Switch checked={responsive} onCheckedChange={setResponsive} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Dark Mode Support</Label>
                      <p className="text-sm text-gray-500">Include dark theme styles</p>
                    </div>
                    <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Export Preview</CardTitle>
                <CardDescription>Preview of your exported dashboard structure</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* File Structure */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium mb-3">File Structure</h4>
                    <div className="font-mono text-sm space-y-1">
                      <div>📁 {projectName}/</div>
                      <div className="ml-4">📄 index.html</div>
                      <div className="ml-4">📁 assets/</div>
                      <div className="ml-8">📄 styles.css</div>
                      <div className="ml-8">📄 script.js</div>
                      {includeAssets && (
                        <>
                          <div className="ml-8">📁 images/</div>
                          <div className="ml-8">📁 fonts/</div>
                        </>
                      )}
                      <div className="ml-4">📄 README.md</div>
                    </div>
                  </div>

                  {/* Code Preview */}
                  <div className="space-y-3">
                    <h4 className="font-medium">Code Preview</h4>
                    <div className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-sm">
                        <code>{`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${config?.name || "Dashboard"}</title>
    <link rel="stylesheet" href="assets/styles.css">
</head>
<body>
    <div class="dashboard-container">
        <!-- Dashboard content -->
    </div>
    <script src="assets/script.js"></script>
</body>
</html>`}</code>
                      </pre>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(generateExportContent())}
                      className="flex items-center gap-2"
                    >
                      <Copy className="h-4 w-4" />
                      Copy Code
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Build Configuration</CardTitle>
                  <CardDescription>Advanced build and optimization settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>CSS Framework</Label>
                    <Select defaultValue="tailwind">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tailwind">Tailwind CSS</SelectItem>
                        <SelectItem value="bootstrap">Bootstrap</SelectItem>
                        <SelectItem value="bulma">Bulma</SelectItem>
                        <SelectItem value="custom">Custom CSS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>JavaScript Library</Label>
                    <Select defaultValue="vanilla">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vanilla">Vanilla JS</SelectItem>
                        <SelectItem value="jquery">jQuery</SelectItem>
                        <SelectItem value="alpine">Alpine.js</SelectItem>
                        <SelectItem value="htmx">HTMX</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Chart Library</Label>
                    <Select defaultValue="chartjs">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="chartjs">Chart.js</SelectItem>
                        <SelectItem value="d3">D3.js</SelectItem>
                        <SelectItem value="recharts">Recharts</SelectItem>
                        <SelectItem value="apexcharts">ApexCharts</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Deployment</CardTitle>
                  <CardDescription>Ready-to-deploy configurations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Globe className="h-4 w-4 mr-2" />
                      Deploy to Vercel
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Globe className="h-4 w-4 mr-2" />
                      Deploy to Netlify
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Globe className="h-4 w-4 mr-2" />
                      Deploy to GitHub Pages
                    </Button>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label>Environment</Label>
                    <Select defaultValue="production">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="development">Development</SelectItem>
                        <SelectItem value="staging">Staging</SelectItem>
                        <SelectItem value="production">Production</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Export Progress */}
        {isExporting && (
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Exporting...</span>
                  <span className="text-sm text-gray-500">{Math.round(exportProgress)}%</span>
                </div>
                <Progress value={exportProgress} className="w-full" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Export Complete */}
        {exportComplete && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">Export Complete!</p>
                  <p className="text-sm text-green-700">Your dashboard has been exported successfully.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-between pt-4 border-t">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Settings className="h-4 w-4" />
            {(config?.components || []).length} components • {metadata.version}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleExport} disabled={isExporting} className="flex items-center gap-2">
              {isExporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Export Dashboard
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
