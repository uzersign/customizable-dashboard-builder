"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Download,
  Globe,
  Folder,
  Code,
  ImageIcon,
  FileText,
  Smartphone,
  Monitor,
  Tablet,
  Cloud,
  Github,
  Figma,
  Zap,
} from "lucide-react"
import { useDashboard } from "./dashboard-context"
import { toast } from "sonner"
import JSZip from "jszip"

interface AdvancedExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AdvancedExportDialog({ open, onOpenChange }: AdvancedExportDialogProps) {
  const { config } = useDashboard()
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)
  const [exportOptions, setExportOptions] = useState({
    format: "html",
    includeAssets: true,
    minifyCode: true,
    responsiveBreakpoints: true,
    darkModeSupport: false,
    printOptimization: true,
    seoOptimization: true,
    pwaSupport: false,
    analyticsCode: "",
    customDomain: "",
    compressionLevel: "standard",
  })

  const exportFormats = [
    {
      id: "html",
      name: "Complete HTML Project",
      description: "Standalone HTML, CSS, and JavaScript files",
      icon: Globe,
      size: "~2-5 MB",
      features: ["Responsive Design", "Interactive Charts", "Cross-browser Compatible"],
    },
    {
      id: "react",
      name: "React Components",
      description: "Reusable React components with TypeScript",
      icon: Code,
      size: "~1-3 MB",
      features: ["TypeScript Support", "Component Library", "Modern React Hooks"],
    },
    {
      id: "figma",
      name: "Figma Design System",
      description: "Design tokens and component library for Figma",
      icon: Figma,
      size: "~500 KB",
      features: ["Design Tokens", "Component Variants", "Auto Layout"],
    },
    {
      id: "pdf",
      name: "PDF Report",
      description: "Static PDF report with all dashboard data",
      icon: FileText,
      size: "~2-10 MB",
      features: ["High Resolution", "Print Ready", "Data Tables"],
    },
    {
      id: "images",
      name: "Image Assets",
      description: "PNG/SVG exports of all dashboard components",
      icon: ImageIcon,
      size: "~5-20 MB",
      features: ["High Resolution", "Multiple Formats", "Transparent Backgrounds"],
    },
  ]

  const deploymentOptions = [
    {
      id: "vercel",
      name: "Deploy to Vercel",
      description: "One-click deployment to Vercel platform",
      icon: Zap,
      features: ["Automatic SSL", "Global CDN", "Custom Domain"],
    },
    {
      id: "github",
      name: "Push to GitHub",
      description: "Create repository and push code",
      icon: Github,
      features: ["Version Control", "Collaboration", "GitHub Pages"],
    },
    {
      id: "netlify",
      name: "Deploy to Netlify",
      description: "Deploy to Netlify with form handling",
      icon: Cloud,
      features: ["Form Handling", "Edge Functions", "Analytics"],
    },
  ]

  const handleExport = async () => {
    setIsExporting(true)
    setExportProgress(0)

    try {
      // Simulate export process
      for (let i = 0; i <= 100; i += 10) {
        setExportProgress(i)
        await new Promise((resolve) => setTimeout(resolve, 200))
      }

      // Generate and download based on format
      switch (exportOptions.format) {
        case "html":
          await exportHTML()
          break
        case "react":
          await exportReact()
          break
        case "pdf":
          await exportPDF()
          break
        case "images":
          await exportImages()
          break
        default:
          await exportHTML()
      }

      toast.success("Export completed successfully!")
      onOpenChange(false)
    } catch (error) {
      toast.error("Export failed. Please try again.")
    } finally {
      setIsExporting(false)
      setExportProgress(0)
    }
  }

  const exportHTML = async () => {
    const zip = new JSZip()

    // Add HTML file
    zip.file("index.html", generateAdvancedHTML())

    // Add CSS files
    const cssFolder = zip.folder("css")
    cssFolder?.file("styles.css", generateAdvancedCSS())
    cssFolder?.file("responsive.css", generateResponsiveCSS())

    // Add JavaScript files
    const jsFolder = zip.folder("js")
    jsFolder?.file("dashboard.js", generateAdvancedJS())
    jsFolder?.file("charts.js", generateChartsJS())

    // Add assets
    const assetsFolder = zip.folder("assets")
    assetsFolder?.file("favicon.ico", generateFavicon())

    if (exportOptions.pwaSupport) {
      zip.file("manifest.json", generateManifest())
      zip.file("sw.js", generateServiceWorker())
    }

    // Generate and download
    const content = await zip.generateAsync({ type: "blob" })
    downloadFile(content, `${config.metadata.title.replace(/\s+/g, "-").toLowerCase()}.zip`)
  }

  const exportReact = async () => {
    const zip = new JSZip()

    // Add React components
    const componentsFolder = zip.folder("components")
    componentsFolder?.file("Dashboard.tsx", generateReactDashboard())
    componentsFolder?.file("ChartComponent.tsx", generateReactChart())

    // Add package.json
    zip.file("package.json", generatePackageJson())

    // Add TypeScript config
    zip.file("tsconfig.json", generateTSConfig())

    const content = await zip.generateAsync({ type: "blob" })
    downloadFile(content, `${config.metadata.title.replace(/\s+/g, "-").toLowerCase()}-react.zip`)
  }

  const exportPDF = async () => {
    // Simulate PDF generation
    const pdfBlob = new Blob(["PDF content"], { type: "application/pdf" })
    downloadFile(pdfBlob, `${config.metadata.title.replace(/\s+/g, "-").toLowerCase()}.pdf`)
  }

  const exportImages = async () => {
    const zip = new JSZip()

    // Add component images (simulated)
    config.components.forEach((component, index) => {
      const imageBlob = new Blob(["image data"], { type: "image/png" })
      zip.file(`component-${index + 1}-${component.type}.png`, imageBlob)
    })

    const content = await zip.generateAsync({ type: "blob" })
    downloadFile(content, `${config.metadata.title.replace(/\s+/g, "-").toLowerCase()}-images.zip`)
  }

  const downloadFile = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Generate functions (simplified for brevity)
  const generateAdvancedHTML = () => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${config.metadata.title}</title>
    <link rel="stylesheet" href="css/styles.css">
    ${exportOptions.responsiveBreakpoints ? '<link rel="stylesheet" href="css/responsive.css">' : ""}
    ${exportOptions.pwaSupport ? '<link rel="manifest" href="manifest.json">' : ""}
</head>
<body>
    <div id="dashboard-container">
        <!-- Dashboard content -->
    </div>
    <script src="js/dashboard.js"></script>
    ${exportOptions.analyticsCode ? `<script>${exportOptions.analyticsCode}</script>` : ""}
</body>
</html>`

  const generateAdvancedCSS = () => `/* Advanced Dashboard Styles */
:root {
  --primary-color: ${config.theme.primaryColor};
  --secondary-color: ${config.theme.secondaryColor};
  --background-color: ${config.theme.backgroundColor};
  --text-color: ${config.theme.textColor};
}

${
  exportOptions.darkModeSupport
    ? `
@media (prefers-color-scheme: dark) {
  :root {
    --background-color: #1a1a1a;
    --text-color: #ffffff;
  }
}
`
    : ""
}

${
  exportOptions.printOptimization
    ? `
@media print {
  .no-print { display: none !important; }
  .dashboard-grid { break-inside: avoid; }
}
`
    : ""
}`

  const generateResponsiveCSS = () => `/* Responsive Styles */
@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr !important;
  }
}

@media (max-width: 480px) {
  .component {
    padding: 12px !important;
  }
}`

  const generateAdvancedJS = () => `// Advanced Dashboard JavaScript
class AdvancedDashboard {
  constructor() {
    this.init();
  }
  
  init() {
    this.setupInteractions();
    ${exportOptions.pwaSupport ? "this.registerServiceWorker();" : ""}
  }
  
  setupInteractions() {
    // Interactive functionality
  }
  
  ${
    exportOptions.pwaSupport
      ? `
  registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js');
    }
  }
  `
      : ""
  }
}

new AdvancedDashboard();`

  const generateChartsJS = () => `// Chart configurations and interactions`
  const generateFavicon = () => new Blob(["favicon data"])
  const generateManifest = () =>
    JSON.stringify({
      name: config.metadata.title,
      short_name: config.metadata.title,
      description: config.metadata.description,
      start_url: "/",
      display: "standalone",
      theme_color: config.theme.primaryColor,
    })
  const generateServiceWorker = () => `// Service Worker for PWA`
  const generateReactDashboard = () => `// React Dashboard Component`
  const generateReactChart = () => `// React Chart Component`
  const generatePackageJson = () =>
    JSON.stringify({
      name: config.metadata.title.toLowerCase().replace(/\s+/g, "-"),
      version: "1.0.0",
      dependencies: {
        react: "^18.0.0",
        "react-dom": "^18.0.0",
      },
    })
  const generateTSConfig = () =>
    JSON.stringify({
      compilerOptions: {
        target: "es5",
        lib: ["dom", "dom.iterable", "es6"],
        allowJs: true,
        skipLibCheck: true,
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        strict: true,
        forceConsistentCasingInFileNames: true,
        moduleResolution: "node",
        resolveJsonModule: true,
        isolatedModules: true,
        noEmit: true,
        jsx: "react-jsx",
      },
    })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Advanced Export Options
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="format" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="format">Export Format</TabsTrigger>
            <TabsTrigger value="options">Options</TabsTrigger>
            <TabsTrigger value="deployment">Deployment</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <div className="mt-4 h-[60vh] overflow-y-auto">
            <TabsContent value="format" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {exportFormats.map((format) => (
                  <Card
                    key={format.id}
                    className={`cursor-pointer transition-all ${
                      exportOptions.format === format.id ? "ring-2 ring-primary bg-primary/5" : "hover:shadow-md"
                    }`}
                    onClick={() => setExportOptions({ ...exportOptions, format: format.id })}
                  >
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <format.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-base">{format.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">{format.description}</p>
                        </div>
                        <Badge variant="outline">{format.size}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex flex-wrap gap-1">
                        {format.features.map((feature, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="options" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Code Optimization</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="minify">Minify Code</Label>
                      <Switch
                        id="minify"
                        checked={exportOptions.minifyCode}
                        onCheckedChange={(checked) => setExportOptions({ ...exportOptions, minifyCode: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="responsive">Responsive Breakpoints</Label>
                      <Switch
                        id="responsive"
                        checked={exportOptions.responsiveBreakpoints}
                        onCheckedChange={(checked) =>
                          setExportOptions({ ...exportOptions, responsiveBreakpoints: checked })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="compression">Compression Level</Label>
                      <Select
                        value={exportOptions.compressionLevel}
                        onValueChange={(value) => setExportOptions({ ...exportOptions, compressionLevel: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No Compression</SelectItem>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="maximum">Maximum</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Features</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="darkmode">Dark Mode Support</Label>
                      <Switch
                        id="darkmode"
                        checked={exportOptions.darkModeSupport}
                        onCheckedChange={(checked) => setExportOptions({ ...exportOptions, darkModeSupport: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="print">Print Optimization</Label>
                      <Switch
                        id="print"
                        checked={exportOptions.printOptimization}
                        onCheckedChange={(checked) =>
                          setExportOptions({ ...exportOptions, printOptimization: checked })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="pwa">PWA Support</Label>
                      <Switch
                        id="pwa"
                        checked={exportOptions.pwaSupport}
                        onCheckedChange={(checked) => setExportOptions({ ...exportOptions, pwaSupport: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="seo">SEO Optimization</Label>
                      <Switch
                        id="seo"
                        checked={exportOptions.seoOptimization}
                        onCheckedChange={(checked) => setExportOptions({ ...exportOptions, seoOptimization: checked })}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Custom Code</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="analytics">Analytics Code (Google Analytics, etc.)</Label>
                    <Input
                      id="analytics"
                      placeholder="GA_MEASUREMENT_ID or custom tracking code"
                      value={exportOptions.analyticsCode}
                      onChange={(e) => setExportOptions({ ...exportOptions, analyticsCode: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="domain">Custom Domain (for deployment)</Label>
                    <Input
                      id="domain"
                      placeholder="dashboard.yourcompany.com"
                      value={exportOptions.customDomain}
                      onChange={(e) => setExportOptions({ ...exportOptions, customDomain: e.target.value })}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="deployment" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {deploymentOptions.map((option) => (
                  <Card key={option.id} className="cursor-pointer hover:shadow-md transition-all">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <option.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{option.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">{option.description}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        {option.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                            <span className="text-xs">{feature}</span>
                          </div>
                        ))}
                      </div>
                      <Button className="w-full mt-4 bg-transparent" variant="outline">
                        Deploy Now
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="preview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Export Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <Folder className="w-5 h-5 text-muted-foreground" />
                        <span className="font-medium">Project Structure</span>
                      </div>
                      <Badge variant="outline">{config.components.length} components</Badge>
                    </div>

                    <div className="pl-4 space-y-2 text-sm font-mono">
                      <div>📁 {config.metadata.title.toLowerCase().replace(/\s+/g, "-")}/</div>
                      <div className="pl-4">📄 index.html</div>
                      <div className="pl-4">📁 css/</div>
                      <div className="pl-8">📄 styles.css</div>
                      {exportOptions.responsiveBreakpoints && <div className="pl-8">📄 responsive.css</div>}
                      <div className="pl-4">📁 js/</div>
                      <div className="pl-8">📄 dashboard.js</div>
                      <div className="pl-8">📄 charts.js</div>
                      <div className="pl-4">📁 assets/</div>
                      <div className="pl-8">📄 favicon.ico</div>
                      {exportOptions.pwaSupport && (
                        <>
                          <div className="pl-4">📄 manifest.json</div>
                          <div className="pl-4">📄 sw.js</div>
                        </>
                      )}
                      <div className="pl-4">📄 README.md</div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-6">
                      <div className="text-center">
                        <Monitor className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm font-medium">Desktop Ready</p>
                        <p className="text-xs text-muted-foreground">1920x1080+</p>
                      </div>
                      <div className="text-center">
                        <Tablet className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm font-medium">Tablet Optimized</p>
                        <p className="text-xs text-muted-foreground">768x1024</p>
                      </div>
                      <div className="text-center">
                        <Smartphone className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm font-medium">Mobile Friendly</p>
                        <p className="text-xs text-muted-foreground">375x667</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>

          {/* Export Progress */}
          {isExporting && (
            <Card className="mt-4">
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Generating {exportFormats.find((f) => f.id === exportOptions.format)?.name}...</span>
                    <span>{exportProgress}%</span>
                  </div>
                  <Progress value={exportProgress} className="w-full" />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              Export will include {config.components.length} components
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleExport} disabled={isExporting}>
                <Download className="w-4 h-4 mr-2" />
                {isExporting ? "Exporting..." : "Export Dashboard"}
              </Button>
            </div>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
