"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Users,
  DollarSign,
  ShoppingCart,
  Eye,
  AlertCircle,
  CheckCircle,
  Info,
  AlertTriangle,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface WidgetRendererProps {
  component: {
    id: string
    type: string
    props: {
      title?: string
      value?: string | number
      change?: string
      trend?: "up" | "down" | "neutral"
      icon?: string
      color?: string
      progress?: number
      variant?: string
      description?: string
      status?: "success" | "warning" | "error" | "info"
    }
    style?: Record<string, any>
  }
}

const iconMap = {
  users: Users,
  dollar: DollarSign,
  cart: ShoppingCart,
  eye: Eye,
  activity: Activity,
  trending: TrendingUp,
}

export function WidgetRenderer({ component }: WidgetRendererProps) {
  const { props, style, type } = component

  if (type === "stat-card" || type === "metric-card") {
    return <StatCard props={props} style={style} />
  }

  if (type === "progress-bar") {
    return <ProgressWidget props={props} style={style} />
  }

  if (type === "badge") {
    return <BadgeWidget props={props} style={style} />
  }

  if (type === "alert") {
    return <AlertWidget props={props} style={style} />
  }

  return (
    <Card style={style}>
      <CardContent className="p-4">
        <div className="text-center text-gray-500">
          <Activity className="w-8 h-8 mx-auto mb-2" />
          <p>Widget: {type}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function StatCard({ props, style }: { props: any; style?: Record<string, any> }) {
  const {
    title = "Metric",
    value = "0",
    change = "+0%",
    trend = "neutral",
    icon = "activity",
    color = "#3b82f6",
  } = props

  const IconComponent = iconMap[icon as keyof typeof iconMap] || Activity
  const isPositive = trend === "up" || (change && change.startsWith("+"))
  const isNegative = trend === "down" || (change && change.startsWith("-"))

  return (
    <Card className="h-full" style={style}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
              {change && (
                <div
                  className={cn(
                    "flex items-center text-sm font-medium",
                    isPositive && "text-green-600",
                    isNegative && "text-red-600",
                    !isPositive && !isNegative && "text-gray-600",
                  )}
                >
                  {isPositive && <TrendingUp className="w-3 h-3 mr-1" />}
                  {isNegative && <TrendingDown className="w-3 h-3 mr-1" />}
                  {change}
                </div>
              )}
            </div>
          </div>
          <div className="p-3 rounded-full" style={{ backgroundColor: `${color}20` }}>
            <IconComponent className="w-6 h-6" style={{ color }} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ProgressWidget({ props, style }: { props: any; style?: Record<string, any> }) {
  const { title = "Progress", progress = 50, color = "#3b82f6", description = "" } = props

  return (
    <Card className="h-full" style={style}>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-900">{title}</h4>
            <span className="text-sm font-medium text-gray-600">{progress}%</span>
          </div>
          <Progress
            value={progress}
            className="h-2"
            style={{
              backgroundColor: `${color}20`,
            }}
          />
          {description && <p className="text-xs text-gray-500">{description}</p>}
        </div>
      </CardContent>
    </Card>
  )
}

function BadgeWidget({ props, style }: { props: any; style?: Record<string, any> }) {
  const { title = "Badge", variant = "default", color = "#3b82f6" } = props

  return (
    <div className="inline-flex" style={style}>
      <Badge
        variant={variant as any}
        className="text-sm px-3 py-1"
        style={{
          backgroundColor: variant === "default" ? color : undefined,
          borderColor: variant === "outline" ? color : undefined,
          color: variant === "outline" ? color : undefined,
        }}
      >
        {title}
      </Badge>
    </div>
  )
}

function AlertWidget({ props, style }: { props: any; style?: Record<string, any> }) {
  const { title = "Alert", description = "This is an alert message", status = "info" } = props

  const getIcon = () => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-4 h-4" />
      case "warning":
        return <AlertTriangle className="w-4 h-4" />
      case "error":
        return <AlertCircle className="w-4 h-4" />
      default:
        return <Info className="w-4 h-4" />
    }
  }

  const getVariant = () => {
    switch (status) {
      case "error":
        return "destructive"
      default:
        return "default"
    }
  }

  return (
    <Alert variant={getVariant() as any} style={style}>
      {getIcon()}
      <AlertDescription>
        <div className="font-medium">{title}</div>
        <div className="text-sm mt-1">{description}</div>
      </AlertDescription>
    </Alert>
  )
}
