"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useDashboard } from "./dashboard-context"
import { generateId } from "@/lib/utils"
import {
  Search,
  BarChart3,
  LineChart,
  PieChart,
  TrendingUp,
  Activity,
  Users,
  Star,
  Filter,
  Grid,
  List,
  Table,
  Layout,
  CreditCardIcon as CardIcon,
  Square,
  Type,
  Gauge,
  StepForwardIcon as Progress,
  AlertCircle,
} from "lucide-react"

interface ComponentItem {
  id: string
  name: string
  type: string
  category: "charts" | "widgets" | "data" | "elements"
  description: string
  icon: any
  props: Record<string, any>
  tags: string[]
  preview?: string
}

const componentLibrary: ComponentItem[] = [
  // Charts
  {
    id: "line-chart",
    name: "Line Chart",
    type: "line-chart",
    category: "charts",
    description: "Display trends over time with connected data points",
    icon: LineChart,
    props: {
      title: "Sales Trend",
      data: [
        { name: "Jan", value: 400 },
        { name: "Feb", value: 300 },
        { name: "Mar", value: 600 },
        { name: "Apr", value: 800 },
        { name: "May", value: 500 },
      ],
      color: "#3b82f6",
      showGrid: true,
      showLegend: true,
    },
    tags: ["chart", "line", "trend", "analytics"],
  },
  {
    id: "bar-chart",
    name: "Bar Chart",
    type: "bar-chart",
    category: "charts",
    description: "Compare values across categories with vertical bars",
    icon: BarChart3,
    props: {
      title: "Revenue by Quarter",
      data: [
        { name: "Q1", value: 2400 },
        { name: "Q2", value: 1398 },
        { name: "Q3", value: 9800 },
        { name: "Q4", value: 3908 },
      ],
      color: "#10b981",
      showGrid: true,
      showLegend: false,
    },
    tags: ["chart", "bar", "comparison", "analytics"],
  },
  {
    id: "pie-chart",
    name: "Pie Chart",
    type: "pie-chart",
    category: "charts",
    description: "Show proportions and percentages in a circular format",
    icon: PieChart,
    props: {
      title: "Market Share",
      data: [
        { name: "Product A", value: 35, color: "#3b82f6" },
        { name: "Product B", value: 25, color: "#10b981" },
        { name: "Product C", value: 20, color: "#f59e0b" },
        { name: "Product D", value: 20, color: "#ef4444" },
      ],
      showLegend: true,
      showLabels: true,
    },
    tags: ["chart", "pie", "percentage", "proportion"],
  },
  {
    id: "area-chart",
    name: "Area Chart",
    type: "area-chart",
    category: "charts",
    description: "Visualize cumulative data with filled areas",
    icon: TrendingUp,
    props: {
      title: "Website Traffic",
      data: [
        { name: "Mon", value: 1200 },
        { name: "Tue", value: 1900 },
        { name: "Wed", value: 3000 },
        { name: "Thu", value: 2800 },
        { name: "Fri", value: 3900 },
        { name: "Sat", value: 4300 },
        { name: "Sun", value: 3200 },
      ],
      color: "#8b5cf6",
      gradient: true,
      showGrid: true,
    },
    tags: ["chart", "area", "cumulative", "trend"],
  },

  // Widgets
  {
    id: "stat-card",
    name: "Stat Card",
    type: "stat-card",
    category: "widgets",
    description: "Display key metrics with optional trend indicators",
    icon: Activity,
    props: {
      title: "Total Revenue",
      value: "$45,231",
      change: "+20.1%",
      changeType: "positive",
      icon: "dollar-sign",
      color: "#10b981",
    },
    tags: ["metric", "kpi", "statistic", "card"],
  },
  {
    id: "progress-bar",
    name: "Progress Bar",
    type: "progress-bar",
    category: "widgets",
    description: "Show completion status with animated progress",
    icon: Progress,
    props: {
      title: "Project Progress",
      value: 68,
      max: 100,
      color: "#3b82f6",
      showPercentage: true,
      animated: true,
    },
    tags: ["progress", "completion", "status", "bar"],
  },
  {
    id: "gauge-chart",
    name: "Gauge Chart",
    type: "gauge-chart",
    category: "widgets",
    description: "Display values within a range using a gauge visualization",
    icon: Gauge,
    props: {
      title: "Performance Score",
      value: 85,
      min: 0,
      max: 100,
      color: "#10b981",
      showValue: true,
      thresholds: [
        { value: 30, color: "#ef4444" },
        { value: 70, color: "#f59e0b" },
        { value: 100, color: "#10b981" },
      ],
    },
    tags: ["gauge", "meter", "performance", "score"],
  },
  {
    id: "alert",
    name: "Alert",
    type: "alert",
    category: "widgets",
    description: "Display important messages and notifications",
    icon: AlertCircle,
    props: {
      title: "System Update",
      message: "A new version is available. Please update to continue.",
      type: "info",
      dismissible: true,
      icon: true,
    },
    tags: ["alert", "notification", "message", "warning"],
  },

  // Data Components
  {
    id: "data-table",
    name: "Data Table",
    type: "table",
    category: "data",
    description: "Display structured data with sorting and filtering",
    icon: Table,
    props: {
      title: "User Management",
      columns: [
        { key: "name", label: "Name", sortable: true },
        { key: "email", label: "Email", sortable: true },
        { key: "role", label: "Role", sortable: false },
        { key: "status", label: "Status", sortable: true },
      ],
      data: [
        { name: "John Doe", email: "john@example.com", role: "Admin", status: "Active" },
        { name: "Jane Smith", email: "jane@example.com", role: "User", status: "Active" },
        { name: "Bob Johnson", email: "bob@example.com", role: "User", status: "Inactive" },
      ],
      pagination: true,
      searchable: true,
    },
    tags: ["table", "data", "grid", "list"],
  },
  {
    id: "data-list",
    name: "Data List",
    type: "data-list",
    category: "data",
    description: "Display items in a clean, organized list format",
    icon: List,
    props: {
      title: "Recent Orders",
      items: [
        { id: 1, title: "Order #1234", subtitle: "John Doe - $299.99", status: "Completed" },
        { id: 2, title: "Order #1235", subtitle: "Jane Smith - $149.99", status: "Processing" },
        { id: 3, title: "Order #1236", subtitle: "Bob Johnson - $399.99", status: "Shipped" },
      ],
      showStatus: true,
      clickable: true,
    },
    tags: ["list", "items", "data", "feed"],
  },
  {
    id: "filter-panel",
    name: "Filter Panel",
    type: "filter-panel",
    category: "data",
    description: "Provide filtering controls for data views",
    icon: Filter,
    props: {
      title: "Filters",
      filters: [
        { type: "select", label: "Category", options: ["All", "Electronics", "Clothing", "Books"] },
        { type: "range", label: "Price", min: 0, max: 1000 },
        { type: "date", label: "Date Range" },
        { type: "checkbox", label: "In Stock", checked: true },
      ],
    },
    tags: ["filter", "search", "controls", "panel"],
  },

  // UI Elements
  {
    id: "button",
    name: "Button",
    type: "button",
    category: "elements",
    description: "Interactive button with various styles and states",
    icon: Square,
    props: {
      text: "Click Me",
      variant: "primary",
      size: "medium",
      disabled: false,
      loading: false,
      icon: null,
    },
    tags: ["button", "action", "click", "interactive"],
  },
  {
    id: "card",
    name: "Card",
    type: "card",
    category: "elements",
    description: "Container for grouping related content",
    icon: CardIcon,
    props: {
      title: "Card Title",
      content: "This is the card content. You can add any information here.",
      footer: "Card Footer",
      image: null,
      padding: "medium",
    },
    tags: ["card", "container", "content", "layout"],
  },
  {
    id: "badge",
    name: "Badge",
    type: "badge",
    category: "elements",
    description: "Small status indicators and labels",
    icon: Star,
    props: {
      text: "New",
      variant: "primary",
      size: "medium",
      removable: false,
    },
    tags: ["badge", "label", "status", "tag"],
  },
  {
    id: "avatar",
    name: "Avatar",
    type: "avatar",
    category: "elements",
    description: "User profile pictures and initials",
    icon: Users,
    props: {
      name: "John Doe",
      image: null,
      size: "medium",
      shape: "circle",
      showName: true,
    },
    tags: ["avatar", "profile", "user", "image"],
  },
  {
    id: "text",
    name: "Text",
    type: "text",
    category: "elements",
    description: "Formatted text with various typography options",
    icon: Type,
    props: {
      content: "This is sample text content.",
      variant: "body",
      color: "default",
      align: "left",
      weight: "normal",
    },
    tags: ["text", "typography", "content", "paragraph"],
  },
  {
    id: "divider",
    name: "Divider",
    type: "divider",
    category: "elements",
    description: "Visual separator between content sections",
    icon: Square,
    props: {
      orientation: "horizontal",
      variant: "solid",
      spacing: "medium",
      color: "default",
    },
    tags: ["divider", "separator", "line", "spacing"],
  },
]

export function ComponentLibrary() {
  const { addComponent } = useDashboard()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [draggedComponent, setDraggedComponent] = useState<ComponentItem | null>(null)

  const filteredComponents = useMemo(() => {
    return componentLibrary.filter((component) => {
      const matchesSearch =
        component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        component.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        component.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesCategory = selectedCategory === "all" || component.category === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [searchTerm, selectedCategory])

  const handleAddComponent = (component: ComponentItem) => {
    const newComponent = {
      id: generateId(),
      type: component.type,
      name: component.name,
      props: { ...component.props },
      style: {
        minHeight: "120px",
        padding: "16px",
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        border: "1px solid #e5e7eb",
      },
      gridArea: {
        row: 1,
        col: 1,
        rowSpan: 2,
        colSpan: 3,
      },
    }

    addComponent(newComponent)
  }

  const handleDragStart = (e: React.DragEvent, component: ComponentItem) => {
    setDraggedComponent(component)
    e.dataTransfer.setData("application/json", JSON.stringify(component))
    e.dataTransfer.effectAllowed = "copy"
  }

  const handleDragEnd = () => {
    setDraggedComponent(null)
  }

  const categoryIcons = {
    charts: BarChart3,
    widgets: Activity,
    data: Table,
    elements: Layout,
  }

  const categories = [
    { id: "all", name: "All Components", count: componentLibrary.length },
    { id: "charts", name: "Charts", count: componentLibrary.filter((c) => c.category === "charts").length },
    { id: "widgets", name: "Widgets", count: componentLibrary.filter((c) => c.category === "widgets").length },
    { id: "data", name: "Data", count: componentLibrary.filter((c) => c.category === "data").length },
    { id: "elements", name: "Elements", count: componentLibrary.filter((c) => c.category === "elements").length },
  ]

  return (
    <div className="h-full flex flex-col">
      {/* Search */}
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search components..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="flex-1 flex flex-col">
        <div className="border-b">
          <TabsList className="w-full justify-start h-auto p-1">
            {categories.map((category) => {
              const Icon = category.id === "all" ? Grid : categoryIcons[category.id as keyof typeof categoryIcons]
              return (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <Icon className="h-4 w-4" />
                  <span>{category.name}</span>
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {category.count}
                  </Badge>
                </TabsTrigger>
              )
            })}
          </TabsList>
        </div>

        {/* Component Grid */}
        <div className="flex-1">
          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="h-full m-0">
              <ScrollArea className="h-full">
                <div className="p-4">
                  {filteredComponents.length === 0 ? (
                    <div className="text-center py-12">
                      <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No components found</h3>
                      <p className="text-muted-foreground">Try adjusting your search or category filter</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-3">
                      {filteredComponents.map((component) => {
                        const Icon = component.icon
                        return (
                          <Card
                            key={component.id}
                            className={`group cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary/50 ${
                              draggedComponent?.id === component.id ? "opacity-50" : ""
                            }`}
                            draggable
                            onDragStart={(e) => handleDragStart(e, component)}
                            onDragEnd={handleDragEnd}
                          >
                            <CardHeader className="pb-2">
                              <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="p-2 bg-primary/10 rounded-lg">
                                    <Icon className="h-5 w-5 text-primary" />
                                  </div>
                                  <div>
                                    <CardTitle className="text-sm font-medium">{component.name}</CardTitle>
                                    <CardDescription className="text-xs line-clamp-2">
                                      {component.description}
                                    </CardDescription>
                                  </div>
                                </div>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleAddComponent(component)}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  Add
                                </Button>
                              </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                              <div className="flex flex-wrap gap-1">
                                {component.tags.slice(0, 3).map((tag, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                                {component.tags.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{component.tags.length - 3}
                                  </Badge>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  )
}
