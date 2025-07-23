"use client"

import { ComponentRenderer } from "./component-renderer"
import { useDashboard } from "./dashboard-context"

export function DashboardRenderer() {
  const { components, layout } = useDashboard()

  if (!components || components.length === 0) {
    return null
  }

  return (
    <div className="h-full">
      {/* Header */}
      {layout.header.enabled && (
        <header
          className={`bg-${layout.header.background || "white"} border-b`}
          style={{
            height: layout.header.height || "60px",
            padding: layout.header.padding || "16px",
          }}
        >
          {components
            .filter((c) => c.section === "header")
            .map((component) => (
              <ComponentRenderer key={component.id} component={component} />
            ))}
        </header>
      )}

      <div className="flex h-full">
        {/* Sidebar */}
        {layout.sidebar.enabled && (
          <aside
            className={`bg-${layout.sidebar.background || "white"} border-r ${
              layout.sidebar.position === "right" ? "order-2" : "order-1"
            }`}
            style={{
              width: layout.sidebar.width || "250px",
              padding: layout.sidebar.padding || "16px",
            }}
          >
            {components
              .filter((c) => c.section === "sidebar")
              .map((component) => (
                <ComponentRenderer key={component.id} component={component} />
              ))}
          </aside>
        )}

        {/* Main Content */}
        <main
          className={`flex-1 bg-${layout.content.background || "white"} ${
            layout.sidebar.position === "right" ? "order-1" : "order-2"
          }`}
          style={{
            padding: layout.content.padding || "16px",
          }}
        >
          <div
            className={`h-full ${
              layout.content.container === "fixed"
                ? "max-w-7xl mx-auto"
                : layout.content.container === "centered"
                  ? "max-w-4xl mx-auto"
                  : "w-full"
            }`}
          >
            {components
              .filter((c) => c.section === "content" || !c.section)
              .map((component) => (
                <ComponentRenderer key={component.id} component={component} />
              ))}
          </div>
        </main>
      </div>

      {/* Footer */}
      {layout.footer.enabled && (
        <footer
          className={`bg-${layout.footer.background || "white"} border-t`}
          style={{
            height: layout.footer.height || "60px",
            padding: layout.footer.padding || "16px",
          }}
        >
          {components
            .filter((c) => c.section === "footer")
            .map((component) => (
              <ComponentRenderer key={component.id} component={component} />
            ))}
        </footer>
      )}
    </div>
  )
}
