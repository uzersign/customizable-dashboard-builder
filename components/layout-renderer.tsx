"use client"

import type React from "react"

import { useDashboard } from "./dashboard-context"
import { ComponentRenderer } from "./component-renderer"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Plus, Settings } from "lucide-react"

export function LayoutRenderer() {
  const { config, previewMode, selectedSection, setSelectedSection, toggleSectionVisibility } = useDashboard()

  const visibleSections = config.layout.sections.filter((section) => section.visible)

  return (
    <div className="h-full flex flex-col">
      {/* Header Section */}
      {visibleSections.find((s) => s.type === "header") && (
        <HeaderSection
          section={visibleSections.find((s) => s.type === "header")!}
          isSelected={selectedSection === "header"}
          onSelect={() => setSelectedSection("header")}
          previewMode={previewMode}
        />
      )}

      <div className="flex-1 flex">
        {/* Sidebar Section */}
        {visibleSections.find((s) => s.type === "sidebar") && (
          <SidebarSection
            section={visibleSections.find((s) => s.type === "sidebar")!}
            isSelected={selectedSection === "sidebar"}
            onSelect={() => setSelectedSection("sidebar")}
            previewMode={previewMode}
          />
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Navbar Section */}
          {visibleSections.find((s) => s.type === "navbar") && (
            <NavbarSection
              section={visibleSections.find((s) => s.type === "navbar")!}
              isSelected={selectedSection === "navbar"}
              onSelect={() => setSelectedSection("navbar")}
              previewMode={previewMode}
            />
          )}

          {/* Content Section */}
          <ContentSection
            section={
              visibleSections.find((s) => s.type === "content") ||
              config.layout.sections.find((s) => s.type === "content")!
            }
            isSelected={selectedSection === "content"}
            onSelect={() => setSelectedSection("content")}
            previewMode={previewMode}
          />
        </div>
      </div>

      {/* Footer Section */}
      {visibleSections.find((s) => s.type === "footer") && (
        <FooterSection
          section={visibleSections.find((s) => s.type === "footer")!}
          isSelected={selectedSection === "footer"}
          onSelect={() => setSelectedSection("footer")}
          previewMode={previewMode}
        />
      )}
    </div>
  )
}

function SectionWrapper({
  section,
  isSelected,
  onSelect,
  previewMode,
  children,
  className,
}: {
  section: any
  isSelected: boolean
  onSelect: () => void
  previewMode: boolean
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "relative transition-all duration-200",
        !previewMode && "hover:ring-2 hover:ring-blue-300 cursor-pointer",
        isSelected && !previewMode && "ring-2 ring-blue-500",
        className,
      )}
      style={section.style}
      onClick={onSelect}
    >
      {children}

      {isSelected && !previewMode && (
        <div className="absolute -top-6 left-0 bg-blue-500 text-white px-2 py-1 text-xs rounded flex items-center gap-1">
          <span>{section.type}</span>
          <Button
            size="sm"
            variant="ghost"
            className="h-4 w-4 p-0 text-white hover:bg-white/20"
            onClick={(e) => {
              e.stopPropagation()
              // Toggle visibility or open settings
            }}
          >
            <Settings className="h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  )
}

function HeaderSection({ section, isSelected, onSelect, previewMode }: any) {
  return (
    <SectionWrapper
      section={section}
      isSelected={isSelected}
      onSelect={onSelect}
      previewMode={previewMode}
      className="border-b"
    >
      <div className="flex items-center justify-between px-6" style={{ height: section.height || "64px" }}>
        <div className="flex items-center gap-4">
          {section.components.map((component: any) => (
            <ComponentRenderer key={component.id} component={component} />
          ))}
          {section.components.length === 0 && !previewMode && (
            <div className="flex items-center gap-2 text-gray-400">
              <Plus className="w-4 h-4" />
              <span className="text-sm">Add header components</span>
            </div>
          )}
        </div>
      </div>
    </SectionWrapper>
  )
}

function SidebarSection({ section, isSelected, onSelect, previewMode }: any) {
  return (
    <SectionWrapper
      section={section}
      isSelected={isSelected}
      onSelect={onSelect}
      previewMode={previewMode}
      className="border-r"
    >
      <div className="h-full overflow-y-auto" style={{ width: section.width || "256px" }}>
        <div className="p-4 space-y-2">
          {section.components.map((component: any) => (
            <ComponentRenderer key={component.id} component={component} />
          ))}
          {section.components.length === 0 && !previewMode && (
            <div className="flex items-center gap-2 text-gray-400">
              <Plus className="w-4 h-4" />
              <span className="text-sm">Add sidebar items</span>
            </div>
          )}
        </div>
      </div>
    </SectionWrapper>
  )
}

function NavbarSection({ section, isSelected, onSelect, previewMode }: any) {
  return (
    <SectionWrapper
      section={section}
      isSelected={isSelected}
      onSelect={onSelect}
      previewMode={previewMode}
      className="border-b"
    >
      <div className="flex items-center px-6" style={{ height: section.height || "48px" }}>
        {section.components.map((component: any) => (
          <ComponentRenderer key={component.id} component={component} />
        ))}
        {section.components.length === 0 && !previewMode && (
          <div className="flex items-center gap-2 text-gray-400">
            <Plus className="w-4 h-4" />
            <span className="text-sm">Add navigation items</span>
          </div>
        )}
      </div>
    </SectionWrapper>
  )
}

function ContentSection({ section, isSelected, onSelect, previewMode }: any) {
  const { config } = useDashboard()

  return (
    <SectionWrapper
      section={section}
      isSelected={isSelected}
      onSelect={onSelect}
      previewMode={previewMode}
      className="flex-1"
    >
      <div className="h-full relative">
        <div
          className="h-full"
          style={{
            display: "grid",
            gridTemplateRows: `repeat(${config.layout.rows}, 1fr)`,
            gridTemplateColumns: `repeat(${config.layout.cols}, 1fr)`,
            gap: `${config.layout.gap}px`,
            padding: section.style?.padding || "24px",
          }}
        >
          {/* Render main dashboard components */}
          {config.components.map((component) => (
            <ComponentRenderer key={component.id} component={component} />
          ))}

          {/* Render section-specific components */}
          {section.components.map((component: any) => (
            <ComponentRenderer key={component.id} component={component} />
          ))}
        </div>

        {config.components.length === 0 && section.components.length === 0 && !previewMode && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-2">
              <Plus className="w-8 h-8 mx-auto text-gray-400" />
              <p className="text-gray-500">Drop components here</p>
            </div>
          </div>
        )}
      </div>
    </SectionWrapper>
  )
}

function FooterSection({ section, isSelected, onSelect, previewMode }: any) {
  return (
    <SectionWrapper
      section={section}
      isSelected={isSelected}
      onSelect={onSelect}
      previewMode={previewMode}
      className="border-t"
    >
      <div className="flex items-center justify-center px-6" style={{ height: section.height || "48px" }}>
        {section.components.map((component: any) => (
          <ComponentRenderer key={component.id} component={component} />
        ))}
        {section.components.length === 0 && !previewMode && (
          <div className="flex items-center gap-2 text-gray-400">
            <Plus className="w-4 h-4" />
            <span className="text-sm">Add footer content</span>
          </div>
        )}
      </div>
    </SectionWrapper>
  )
}
