"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Activity, Zap, Clock, HardDrive, Wifi, AlertTriangle, CheckCircle, TrendingUp } from "lucide-react"

interface PerformanceMetrics {
  loadTime: number
  renderTime: number
  memoryUsage: number
  componentCount: number
  bundleSize: number
  score: number
}

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    renderTime: 0,
    memoryUsage: 0,
    componentCount: 0,
    bundleSize: 0,
    score: 0,
  })
  const [isMonitoring, setIsMonitoring] = useState(false)

  useEffect(() => {
    if (isMonitoring) {
      const interval = setInterval(() => {
        // Simulate performance monitoring
        setMetrics({
          loadTime: Math.random() * 2000 + 500,
          renderTime: Math.random() * 100 + 50,
          memoryUsage: Math.random() * 50 + 20,
          componentCount: Math.floor(Math.random() * 20) + 10,
          bundleSize: Math.random() * 500 + 200,
          score: Math.floor(Math.random() * 30) + 70,
        })
      }, 2000)

      return () => clearInterval(interval)
    }
  }, [isMonitoring])

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreIcon = (score: number) => {
    if (score >= 90) return CheckCircle
    if (score >= 70) return AlertTriangle
    return AlertTriangle
  }

  return (
    <Card className="w-80">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Performance Monitor
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setIsMonitoring(!isMonitoring)}>
            {isMonitoring ? "Stop" : "Start"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Performance Score */}
        <div className="text-center">
          <div className={`text-3xl font-bold ${getScoreColor(metrics.score)}`}>{Math.round(metrics.score)}</div>
          <div className="text-sm text-muted-foreground">Performance Score</div>
          <Progress value={metrics.score} className="mt-2" />
        </div>

        {/* Metrics */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" />
              <span className="text-sm">Load Time</span>
            </div>
            <Badge variant="outline">{Math.round(metrics.loadTime)}ms</Badge>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span className="text-sm">Render Time</span>
            </div>
            <Badge variant="outline">{Math.round(metrics.renderTime)}ms</Badge>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-purple-500" />
              <span className="text-sm">Memory Usage</span>
            </div>
            <Badge variant="outline">{Math.round(metrics.memoryUsage)}MB</Badge>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm">Components</span>
            </div>
            <Badge variant="outline">{metrics.componentCount}</Badge>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wifi className="w-4 h-4 text-orange-500" />
              <span className="text-sm">Bundle Size</span>
            </div>
            <Badge variant="outline">{Math.round(metrics.bundleSize)}KB</Badge>
          </div>
        </div>

        {/* Recommendations */}
        {metrics.score < 80 && (
          <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-800">Optimization Tips</span>
            </div>
            <ul className="text-xs text-yellow-700 space-y-1">
              <li>• Reduce the number of components</li>
              <li>• Optimize chart rendering</li>
              <li>• Enable code minification</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
