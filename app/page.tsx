import { DashboardProvider } from "@/components/dashboard-context"
import { DashboardBuilder } from "@/components/dashboard-builder"
import { AuthProvider } from "@/components/auth-provider"
import { Toaster } from "sonner"

export default function Home() {
  return (
    <AuthProvider>
      <DashboardProvider>
        <div className="h-screen overflow-hidden">
          <DashboardBuilder />
          <Toaster position="top-right" />
        </div>
      </DashboardProvider>
    </AuthProvider>
  )
}
