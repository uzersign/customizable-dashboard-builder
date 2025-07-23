"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useDashboard } from "./dashboard-context"
import { generateId } from "@/lib/utils"
import { BarChart3, ShoppingCart, Heart, TrendingUp, Star, Search, Filter } from "lucide-react"

interface TemplateGalleryProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const templates = {
  analytics: [
    {
      id: "web-analytics-pro",
      name: "Web Analytics Pro",
      description: "Complete web analytics dashboard with traffic, conversions, and user behavior tracking",
      category: "Analytics",
      icon: BarChart3,
      pages: 5,
      components: 24,
      premium: true,
      rating: 4.9,
      downloads: 15420,
      preview: "/placeholder.svg?height=200&width=300&text=Web+Analytics",
      components: [
        {
          id: generateId(),
          type: "metric-card",
          props: { title: "Total Visitors", value: "2,847,392", change: "+12.5%", trend: "up" },
          gridArea: { row: 1, col: 1, rowSpan: 2, colSpan: 3 },
          style: {
            backgroundColor: "#ffffff",
            borderLeft: "4px solid #3b82f6",
            boxShadow: "0 4px 12px rgba(59, 130, 246, 0.15)",
          },
        },
        {
          id: generateId(),
          type: "metric-card",
          props: { title: "Page Views", value: "8,234,567", change: "+8.2%", trend: "up" },
          gridArea: { row: 1, col: 4, rowSpan: 2, colSpan: 3 },
          style: {
            backgroundColor: "#ffffff",
            borderLeft: "4px solid #10b981",
            boxShadow: "0 4px 12px rgba(16, 185, 129, 0.15)",
          },
        },
        {
          id: generateId(),
          type: "line-chart",
          props: {
            title: "Traffic Overview - Last 30 Days",
            data: [
              { name: "Week 1", value: 45000 },
              { name: "Week 2", value: 52000 },
              { name: "Week 3", value: 48000 },
              { name: "Week 4", value: 61000 },
            ],
          },
          gridArea: { row: 3, col: 1, rowSpan: 4, colSpan: 8 },
          style: { backgroundColor: "#ffffff", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)", borderRadius: "12px" },
        },
      ],
    },
    {
      id: "social-media-analytics",
      name: "Social Media Analytics",
      description: "Track social media performance across all platforms with engagement metrics",
      category: "Analytics",
      icon: TrendingUp,
      pages: 4,
      components: 18,
      premium: false,
      rating: 4.7,
      downloads: 8930,
      preview: "/placeholder.svg?height=200&width=300&text=Social+Media",
      components: [
        {
          id: generateId(),
          type: "metric-card",
          props: { title: "Total Followers", value: "847K", change: "+5.2%", trend: "up" },
          gridArea: { row: 1, col: 1, rowSpan: 2, colSpan: 3 },
          style: { backgroundColor: "#1da1f2", color: "white", borderRadius: "12px" },
        },
      ],
    },
  ],
  ecommerce: [
    {
      id: "ecommerce-complete",
      name: "E-commerce Complete",
      description: "Full e-commerce dashboard with sales, inventory, customer analytics, and order management",
      category: "E-commerce",
      icon: ShoppingCart,
      pages: 6,
      components: 28,
      premium: true,
      rating: 4.8,
      downloads: 12340,
      preview: "/placeholder.svg?height=200&width=300&text=E-commerce",
      components: [
        {
          id: generateId(),
          type: "metric-card",
          props: { title: "Total Revenue", value: "$2,847,392", change: "+18.2%", trend: "up" },
          gridArea: { row: 1, col: 1, rowSpan: 2, colSpan: 3 },
          style: {
            backgroundColor: "#ffffff",
            borderLeft: "4px solid #059669",
            boxShadow: "0 4px 12px rgba(5, 150, 105, 0.15)",
          },
        },
      ],
    },
  ],
  healthcare: [
    {
      id: "hospital-management",
      name: "Hospital Management",
      description: "Comprehensive hospital dashboard with patient care, staff management, and operations",
      category: "Healthcare",
      icon: Heart,
      pages: 7,
      components: 32,
      premium: true,
      rating: 4.9,
      downloads: 5670,
      preview: "/placeholder.svg?height=200&width=300&text=Hospital+Management",
      components: [
        {
          id: generateId(),
          type: "metric-card",
          props: { title: "Total Patients", value: "2,847", change: "+5.2%", trend: "up" },
          gridArea: { row: 1, col: 1, rowSpan: 2, colSpan: 3 },
          style: { backgroundColor: "#ffffff", borderLeft: "4px solid #ef4444" },
        },
      ],
    },
  ],
}

export function TemplateGallery({ open, onOpenChange }: TemplateGalleryProps) {
  const { updateConfig } = useDashboard()
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("popular")
  const [filterBy, setFilterBy] = useState("all")

  const applyTemplate = (template: any) => {
    updateConfig({
      components: template.components,
      metadata: {
        title: template.name,
        description: template.description,
      },
      theme: template.theme || {
        primaryColor: "#3b82f6",
        secondaryColor: "#64748b",
        backgroundColor: "#f8fafc",
        textColor: "#1f2937",
        fontFamily: "Inter",
        fontSize: "14px",
      },
    })
    onOpenChange(false)
  }

  const allTemplates = Object.values(templates).flat()

  const filteredTemplates = allTemplates
    .filter((template) => {
      const matchesSearch =
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesFilter =
        filterBy === "all" ||
        (filterBy === "premium" && template.premium) ||
        (filterBy === "free" && !template.premium) ||
        template.category.toLowerCase() === filterBy.toLowerCase()
      return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return b.downloads - a.downloads
        case "rating":
          return b.rating - a.rating
        case "name":
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

  const categories = Object.keys(templates)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Professional Dashboard Templates
            <Badge variant="secondary" className="ml-2">
              {allTemplates.length} Templates
            </Badge>
          </DialogTitle>
        </DialogHeader>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 p-4 bg-muted/30 rounded-lg">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="name">Name A-Z</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterBy} onValueChange={setFilterBy}>
            <SelectTrigger className="w-[180px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Templates</SelectItem>
              <SelectItem value="premium">Premium Only</SelectItem>
              <SelectItem value="free">Free Only</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="ecommerce">E-commerce</TabsTrigger>
            <TabsTrigger value="healthcare">Healthcare</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[60vh] mt-4">
            <TabsContent value="all" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                {filteredTemplates.map((template) => (
                  <TemplateCard key={template.id} template={template} onApply={applyTemplate} />
                ))}
              </div>
            </TabsContent>

            {categories.map((category) => (
              <TabsContent key={category} value={category} className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                  {templates[category as keyof typeof templates].map((template) => (
                    <TemplateCard key={template.id} template={template} onApply={applyTemplate} />
                  ))}
                </div>
              </TabsContent>
            ))}
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

function TemplateCard({ template, onApply }: { template: any; onApply: (template: any) => void }) {
  const IconComponent = template.icon

  return (
    <Card className="cursor-pointer hover:shadow-xl transition-all duration-300 group border-0 bg-gradient-to-br from-white to-gray-50">
      <CardHeader className="p-0">
        <div className="aspect-video bg-gradient-to-br from-blue-50 to-indigo-100 rounded-t-lg flex items-center justify-center relative overflow-hidden">
          <IconComponent className="w-16 h-16 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
          <div className="absolute top-2 right-2 flex flex-col gap-1">
            {template.premium && (
              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">Pro</Badge>
            )}
            <Badge variant="secondary" className="text-xs">
              {template.pages} Pages
            </Badge>
          </div>
          <div className="absolute bottom-2 left-2 flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-500 fill-current" />
            <span className="text-xs font-medium">{template.rating}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <CardTitle className="text-lg group-\
