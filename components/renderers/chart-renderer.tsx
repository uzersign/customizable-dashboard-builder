"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { TrendingUp, TrendingDown, Activity, BarChart3 } from "lucide-react"

interface ChartRendererProps {
  component: {
    id: string
    type: string
    props: {
      title?: string
      chartType?: "line" | "bar" | "pie" | "area"
      data?: any[]
      color?: string
      showLegend?: boolean
      showGrid?: boolean
      height?: number
    }
    style?: Record<string, any>
  }
}

const defaultData = [
  { name: "Jan", value: 400, sales: 240, revenue: 2400 },
  { name: "Feb", value: 300, sales: 139, revenue: 2210 },
  { name: "Mar", value: 200, sales: 980, revenue: 2290 },
  { name: "Apr", value: 278, sales: 390, revenue: 2000 },
  { name: "May", value: 189, sales: 480, revenue: 2181 },
  { name: "Jun", value: 239, sales: 380, revenue: 2500 },
]

const pieData = [
  { name: "Desktop", value: 400, color: "#3b82f6" },
  { name: "Mobile", value: 300, color: "#10b981" },
  { name: "Tablet", value: 200, color: "#f59e0b" },
  { name: "Other", value: 100, color: "#ef4444" },
]

export function ChartRenderer({ component }: ChartRendererProps) {
  const { props, style } = component
  const {
    title = "Chart",
    chartType = "line",
    data = defaultData,
    color = "#3b82f6",
    showLegend = true,
    showGrid = true,
    height = 300,
  } = props

  const renderChart = () => {
    const commonProps = {
      data: chartType === "pie" ? pieData : data,
      height,
    }

    switch (chartType) {
      case "line":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart {...commonProps}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              {showLegend && <Legend />}
              <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        )

      case "bar":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart {...commonProps}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              {showLegend && <Legend />}
              <Bar dataKey="value" fill={color} />
            </BarChart>
          </ResponsiveContainer>
        )

      case "area":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart {...commonProps}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              {showLegend && <Legend />}
              <Area type="monotone" dataKey="value" stroke={color} fill={`${color}20`} />
            </AreaChart>
          </ResponsiveContainer>
        )

      case "pie":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )

      default:
        return (
          <div className="flex items-center justify-center h-full text-gray-500">
            <BarChart3 className="w-8 h-8 mr-2" />
            <span>Chart type not supported</span>
          </div>
        )
    }
  }

  const getChartIcon = () => {
    switch (chartType) {
      case "line":
        return <TrendingUp className="w-4 h-4" />
      case "bar":
        return <BarChart3 className="w-4 h-4" />
      case "area":
        return <Activity className="w-4 h-4" />
      case "pie":
        return <TrendingDown className="w-4 h-4" />
      default:
        return <BarChart3 className="w-4 h-4" />
    }
  }

  return (
    <Card className="h-full" style={style}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            {getChartIcon()}
            {title}
          </CardTitle>
          <Badge variant="secondary" className="capitalize">
            {chartType}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="w-full">{renderChart()}</div>
      </CardContent>
    </Card>
  )
}
