"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { JSX } from "react"

interface ElementRendererProps {
  component: {
    id: string
    type: string
    props: {
      title?: string
      content?: string
      text?: string
      placeholder?: string
      variant?: string
      size?: string
      href?: string
      src?: string
      alt?: string
      level?: number
      className?: string
    }
    style?: Record<string, any>
  }
}

export function ElementRenderer({ component }: ElementRendererProps) {
  const { type, props, style } = component

  switch (type) {
    case "card":
      return <CardElement props={props} style={style} />
    case "button":
      return <ButtonElement props={props} style={style} />
    case "input":
      return <InputElement props={props} style={style} />
    case "textarea":
      return <TextareaElement props={props} style={style} />
    case "text":
      return <TextElement props={props} style={style} />
    case "heading":
      return <HeadingElement props={props} style={style} />
    case "image":
      return <ImageElement props={props} style={style} />
    case "separator":
      return <SeparatorElement props={props} style={style} />
    case "avatar":
      return <AvatarElement props={props} style={style} />
    case "badge":
      return <BadgeElement props={props} style={style} />
    case "container":
      return <ContainerElement props={props} style={style} />
    default:
      return <DefaultElement type={type} props={props} style={style} />
  }
}

function CardElement({ props, style }: { props: any; style?: Record<string, any> }) {
  const { title = "Card Title", content = "Card content goes here." } = props

  return (
    <Card className="h-full" style={style}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">{content}</p>
      </CardContent>
    </Card>
  )
}

function ButtonElement({ props, style }: { props: any; style?: Record<string, any> }) {
  const { text = "Button", variant = "default", size = "default" } = props

  return (
    <Button variant={variant as any} size={size as any} style={style} className="w-fit">
      {text}
    </Button>
  )
}

function InputElement({ props, style }: { props: any; style?: Record<string, any> }) {
  const { placeholder = "Enter text...", title } = props

  return (
    <div className="space-y-2" style={style}>
      {title && <Label>{title}</Label>}
      <Input placeholder={placeholder} />
    </div>
  )
}

function TextareaElement({ props, style }: { props: any; style?: Record<string, any> }) {
  const { placeholder = "Enter text...", title } = props

  return (
    <div className="space-y-2" style={style}>
      {title && <Label>{title}</Label>}
      <Textarea placeholder={placeholder} rows={4} />
    </div>
  )
}

function TextElement({ props, style }: { props: any; style?: Record<string, any> }) {
  const { content = "Sample text content", variant = "body" } = props

  const className = cn(
    variant === "body" && "text-gray-700",
    variant === "muted" && "text-gray-500 text-sm",
    variant === "small" && "text-xs text-gray-600",
    variant === "large" && "text-lg text-gray-800",
  )

  return (
    <p className={className} style={style}>
      {content}
    </p>
  )
}

function HeadingElement({ props, style }: { props: any; style?: Record<string, any> }) {
  const { content = "Heading", level = 2 } = props

  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements

  const className = cn(
    "font-bold text-gray-900",
    level === 1 && "text-3xl",
    level === 2 && "text-2xl",
    level === 3 && "text-xl",
    level === 4 && "text-lg",
    level === 5 && "text-base",
    level === 6 && "text-sm",
  )

  return (
    <HeadingTag className={className} style={style}>
      {content}
    </HeadingTag>
  )
}

function ImageElement({ props, style }: { props: any; style?: Record<string, any> }) {
  const { src = "/placeholder.svg?height=200&width=300&text=Image", alt = "Image", title } = props

  return (
    <div className="space-y-2" style={style}>
      {title && <Label>{title}</Label>}
      <img
        src={src || "/placeholder.svg"}
        alt={alt}
        className="rounded-lg border max-w-full h-auto"
        style={{ maxHeight: "300px", objectFit: "cover" }}
      />
    </div>
  )
}

function SeparatorElement({ props, style }: { props: any; style?: Record<string, any> }) {
  return <Separator style={style} />
}

function AvatarElement({ props, style }: { props: any; style?: Record<string, any> }) {
  const { src = "/placeholder.svg?height=40&width=40&text=Avatar", alt = "Avatar", fallback = "U" } = props

  return (
    <Avatar style={style}>
      <AvatarImage src={src || "/placeholder.svg"} alt={alt} />
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  )
}

function BadgeElement({ props, style }: { props: any; style?: Record<string, any> }) {
  const { text = "Badge", variant = "default" } = props

  return (
    <Badge variant={variant as any} style={style}>
      {text}
    </Badge>
  )
}

function ContainerElement({ props, style }: { props: any; style?: Record<string, any> }) {
  const { title, content = "Container content" } = props

  return (
    <div className="p-4 border rounded-lg bg-white" style={style}>
      {title && <h3 className="font-medium mb-2">{title}</h3>}
      <div className="text-gray-600">{content}</div>
    </div>
  )
}

function DefaultElement({ type, props, style }: { type: string; props: any; style?: Record<string, any> }) {
  return (
    <Card style={style}>
      <CardContent className="p-4">
        <div className="text-center text-gray-500">
          <div className="w-8 h-8 bg-gray-200 rounded mx-auto mb-2" />
          <p className="text-sm">Element: {type}</p>
          {props.title && <p className="text-xs text-gray-400 mt-1">{props.title}</p>}
        </div>
      </CardContent>
    </Card>
  )
}
