"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { HelpCircle, Keyboard, Mouse, Zap } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

const shortcuts = [
  { keys: ["Ctrl", "Z"], description: "Undo last action" },
  { keys: ["Ctrl", "Shift", "Z"], description: "Redo last action" },
  { keys: ["Ctrl", "S"], description: "Save dashboard" },
  { keys: ["Ctrl", "D"], description: "Duplicate selected component" },
  { keys: ["Delete"], description: "Delete selected component" },
  { keys: ["P"], description: "Toggle preview mode" },
  { keys: ["Escape"], description: "Deselect component" },
]

const tips = [
  {
    title: "Grid Snapping",
    description: "Components automatically snap to the grid for perfect alignment.",
    icon: "🎯",
  },
  {
    title: "Live Preview",
    description: "See your changes in real-time as you build your dashboard.",
    icon: "👁️",
  },
  {
    title: "Template Gallery",
    description: "Start with pre-built templates to speed up your workflow.",
    icon: "🎨",
  },
  {
    title: "Export Options",
    description: "Export as HTML, JSON, or React components for easy integration.",
    icon: "📤",
  },
  {
    title: "Responsive Design",
    description: "Preview your dashboard on different screen sizes.",
    icon: "📱",
  },
]

export function HelpDialog() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <HelpCircle className="h-4 w-4" />
          Help
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Dashboard Builder Help</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[60vh]">
          <div className="space-y-6 p-1">
            {/* Getting Started */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Getting Started
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <h4 className="font-medium">1. Add Components</h4>
                  <p className="text-sm text-muted-foreground">
                    Browse the component library on the left and click to add charts, widgets, and other elements to
                    your dashboard.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">2. Customize Properties</h4>
                  <p className="text-sm text-muted-foreground">
                    Select any component to edit its content, styling, and layout properties in the right panel.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">3. Preview & Export</h4>
                  <p className="text-sm text-muted-foreground">
                    Use the preview mode to see your dashboard in action, then export as HTML, JSON, or React
                    components.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Keyboard Shortcuts */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Keyboard className="w-4 h-4" />
                  Keyboard Shortcuts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {shortcuts.map((shortcut, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{shortcut.description}</span>
                      <div className="flex gap-1">
                        {shortcut.keys.map((key, keyIndex) => (
                          <Badge key={keyIndex} variant="outline" className="text-xs">
                            {key}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tips & Tricks */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Mouse className="w-4 h-4" />
                  Tips & Tricks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tips.map((tip, index) => (
                    <div key={index} className="flex gap-3">
                      <span className="text-lg">{tip.icon}</span>
                      <div>
                        <h4 className="font-medium text-sm">{tip.title}</h4>
                        <p className="text-sm text-muted-foreground">{tip.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Component Types */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Component Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-medium mb-2">Charts</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Bar Charts</li>
                      <li>• Line Charts</li>
                      <li>• Pie Charts</li>
                      <li>• Area Charts</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Widgets</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Metric Cards</li>
                      <li>• Stat Cards</li>
                      <li>• Progress Cards</li>
                      <li>• User Cards</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Tables</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Data Tables</li>
                      <li>• Simple Tables</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Elements</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Text</li>
                      <li>• Buttons</li>
                      <li>• Images</li>
                      <li>• Containers</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>

        <Separator />

        <div className="flex justify-end">
          <Button onClick={() => setOpen(false)}>Got it!</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
