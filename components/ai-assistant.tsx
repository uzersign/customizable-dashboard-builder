"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Send, Bot, User, Lightbulb, Zap, TrendingUp, Palette } from "lucide-react"
import { useDashboard } from "./dashboard-context"
import { generateId } from "@/lib/utils"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  suggestions?: string[]
  components?: any[]
}

const aiSuggestions = [
  {
    icon: TrendingUp,
    title: "Improve Performance",
    description: "Add performance metrics and KPI tracking",
    prompt: "Add performance metrics and KPI cards to track business growth",
  },
  {
    icon: Palette,
    title: "Enhance Design",
    description: "Suggest color schemes and layout improvements",
    prompt: "Suggest a modern color scheme and improve the visual hierarchy",
  },
  {
    icon: Zap,
    title: "Add Interactivity",
    description: "Make dashboard more interactive and engaging",
    prompt: "Add interactive elements and hover effects to make it more engaging",
  },
  {
    icon: Lightbulb,
    title: "Smart Insights",
    description: "Generate insights based on current data",
    prompt: "Analyze my current dashboard and provide actionable insights",
  },
]

export function AIAssistant() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "assistant",
      content:
        "Hi! I'm your AI dashboard assistant. I can help you create better dashboards, suggest improvements, and add components based on your needs. What would you like to work on?",
      suggestions: [
        "Create a sales dashboard",
        "Add more charts to my dashboard",
        "Improve my dashboard design",
        "Suggest KPIs for my business",
      ],
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { addComponent, config, updateConfig } = useDashboard()

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return

    const userMessage: Message = {
      id: generateId(),
      type: "user",
      content: message,
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const response = generateAIResponse(message)
      setMessages((prev) => [...prev, response])
      setIsLoading(false)
    }, 1500)
  }

  const generateAIResponse = (userMessage: string): Message => {
    const lowerMessage = userMessage.toLowerCase()

    if (lowerMessage.includes("sales") || lowerMessage.includes("revenue")) {
      return {
        id: generateId(),
        type: "assistant",
        content: "I'll help you create a comprehensive sales dashboard! Here are some components I recommend:",
        components: [
          {
            type: "metric-card",
            props: { title: "Total Revenue", value: "$125,430", change: "+12.5%", trend: "up" },
            gridArea: { row: 1, col: 1, rowSpan: 2, colSpan: 3 },
          },
          {
            type: "line-chart",
            props: {
              title: "Sales Trend",
              data: [
                { name: "Jan", value: 45000 },
                { name: "Feb", value: 52000 },
                { name: "Mar", value: 48000 },
                { name: "Apr", value: 61000 },
              ],
            },
            gridArea: { row: 3, col: 1, rowSpan: 4, colSpan: 6 },
          },
        ],
        suggestions: ["Add customer acquisition metrics", "Include conversion funnel", "Add regional sales breakdown"],
      }
    }

    if (lowerMessage.includes("chart") || lowerMessage.includes("visualization")) {
      return {
        id: generateId(),
        type: "assistant",
        content:
          "Great! I can add various charts to enhance your data visualization. What type of data would you like to visualize?",
        suggestions: [
          "Bar chart for comparisons",
          "Line chart for trends",
          "Pie chart for distributions",
          "Area chart for cumulative data",
        ],
      }
    }

    if (lowerMessage.includes("design") || lowerMessage.includes("color") || lowerMessage.includes("theme")) {
      return {
        id: generateId(),
        type: "assistant",
        content: "I can help improve your dashboard design! Here are some suggestions based on current design trends:",
        suggestions: [
          "Use a modern blue and white theme",
          "Add subtle shadows and rounded corners",
          "Implement a dark mode option",
          "Use consistent spacing and typography",
        ],
      }
    }

    if (lowerMessage.includes("kpi") || lowerMessage.includes("metric")) {
      return {
        id: generateId(),
        type: "assistant",
        content: "Here are some essential KPIs I recommend based on your dashboard type:",
        components: [
          {
            type: "metric-card",
            props: { title: "Conversion Rate", value: "3.24%", change: "+0.8%", trend: "up" },
            gridArea: { row: 1, col: 1, rowSpan: 2, colSpan: 3 },
          },
          {
            type: "metric-card",
            props: { title: "Customer Satisfaction", value: "4.8/5", change: "+0.2", trend: "up" },
            gridArea: { row: 1, col: 4, rowSpan: 2, colSpan: 3 },
          },
        ],
        suggestions: ["Add growth rate metrics", "Include customer lifetime value", "Track operational efficiency"],
      }
    }

    // Default response
    return {
      id: generateId(),
      type: "assistant",
      content:
        "I understand you want to improve your dashboard. Could you be more specific about what you'd like to achieve? I can help with adding components, improving design, or suggesting best practices.",
      suggestions: [
        "Add specific chart types",
        "Improve visual design",
        "Suggest relevant KPIs",
        "Optimize layout structure",
      ],
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion)
  }

  const handleAddComponent = (component: any) => {
    const newComponent = {
      id: generateId(),
      ...component,
      style: {
        backgroundColor: "white",
        borderRadius: "8px",
        padding: "16px",
        border: "1px solid #e5e7eb",
        ...component.style,
      },
    }
    addComponent(newComponent)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          AI Assistant
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-purple-500" />
            AI Dashboard Assistant
            <Badge variant="secondary" className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700">
              Beta
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-4 h-[60vh]">
          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            <ScrollArea className="flex-1 p-4 border rounded-lg">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`flex gap-3 max-w-[80%] ${message.type === "user" ? "flex-row-reverse" : "flex-row"}`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          message.type === "user"
                            ? "bg-blue-500 text-white"
                            : "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                        }`}
                      >
                        {message.type === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                      </div>
                      <div
                        className={`rounded-lg p-3 ${
                          message.type === "user" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>

                        {message.components && (
                          <div className="mt-3 space-y-2">
                            <p className="text-xs font-medium opacity-75">Suggested Components:</p>
                            {message.components.map((component, index) => (
                              <div key={index} className="bg-white/10 rounded p-2 flex items-center justify-between">
                                <span className="text-xs capitalize">{component.type.replace("-", " ")}</span>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 text-xs"
                                  onClick={() => handleAddComponent(component)}
                                >
                                  Add
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}

                        {message.suggestions && (
                          <div className="mt-3 flex flex-wrap gap-1">
                            {message.suggestions.map((suggestion, index) => (
                              <Button
                                key={index}
                                variant="ghost"
                                size="sm"
                                className="h-6 text-xs bg-white/10 hover:bg-white/20"
                                onClick={() => handleSuggestionClick(suggestion)}
                              >
                                {suggestion}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center justify-center">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="bg-gray-100 rounded-lg p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="flex gap-2 mt-4">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me anything about your dashboard..."
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage(inputValue)}
                disabled={isLoading}
              />
              <Button
                onClick={() => handleSendMessage(inputValue)}
                disabled={isLoading || !inputValue.trim()}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Quick Actions Sidebar */}
          <div className="w-80 border-l pl-4">
            <h3 className="font-medium mb-4">Quick Actions</h3>
            <div className="space-y-3">
              {aiSuggestions.map((suggestion, index) => (
                <Card
                  key={index}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleSendMessage(suggestion.prompt)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center">
                        <suggestion.icon className="w-4 h-4 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{suggestion.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{suggestion.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-6 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
              <h4 className="font-medium text-sm mb-2">💡 Pro Tip</h4>
              <p className="text-xs text-muted-foreground">
                Be specific about your goals! Instead of "make it better", try "add sales metrics for Q4 performance
                tracking"
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
