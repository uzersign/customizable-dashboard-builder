"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
  className?: string
}

const presetColors = [
  "#000000",
  "#ffffff",
  "#f3f4f6",
  "#e5e7eb",
  "#d1d5db",
  "#9ca3af",
  "#6b7280",
  "#374151",
  "#1f2937",
  "#111827",
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#eab308",
  "#84cc16",
  "#22c55e",
  "#10b981",
  "#14b8a6",
  "#06b6d4",
  "#0ea5e9",
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#a855f7",
  "#d946ef",
  "#ec4899",
  "#f43f5e",
  "#fbbf24",
  "#34d399",
  "#60a5fa",
]

export function ColorPicker({ value, onChange, className }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState(value)

  const handleColorChange = (color: string) => {
    setInputValue(color)
    onChange(color)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
    if (newValue.match(/^#[0-9A-F]{6}$/i)) {
      onChange(newValue)
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className={cn("w-full justify-start text-left font-normal", className)}>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded border border-gray-300" style={{ backgroundColor: value }} />
            <span>{value}</span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium">Color</label>
            <Input value={inputValue} onChange={handleInputChange} placeholder="#000000" className="mt-1" />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Presets</label>
            <div className="grid grid-cols-6 gap-2">
              {presetColors.map((color) => (
                <button
                  key={color}
                  className={cn(
                    "h-8 w-8 rounded border-2 border-transparent hover:scale-110 transition-transform",
                    value === color && "border-gray-400",
                  )}
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorChange(color)}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Custom</label>
            <input
              type="color"
              value={value}
              onChange={(e) => handleColorChange(e.target.value)}
              className="w-full h-10 rounded border border-gray-300 cursor-pointer"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
