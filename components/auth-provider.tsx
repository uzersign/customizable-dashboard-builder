"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { LoginDialog } from "./login-dialog"
import { toast } from "sonner"

interface User {
  id: string
  email: string
  name: string
  avatar?: string
  plan: "free" | "pro" | "enterprise"
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showLogin, setShowLogin] = useState(false)

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem("dashboard-user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    } else {
      setShowLogin(true)
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockUser: User = {
        id: "1",
        email,
        name: email.split("@")[0],
        plan: "pro",
      }

      setUser(mockUser)
      localStorage.setItem("dashboard-user", JSON.stringify(mockUser))
      setShowLogin(false)
      toast.success("Welcome back!")
    } catch (error) {
      toast.error("Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockUser: User = {
        id: "1",
        email,
        name,
        plan: "free",
      }

      setUser(mockUser)
      localStorage.setItem("dashboard-user", JSON.stringify(mockUser))
      setShowLogin(false)
      toast.success("Account created successfully!")
    } catch (error) {
      toast.error("Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("dashboard-user")
    setShowLogin(true)
    toast.success("Logged out successfully")
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
      <LoginDialog open={showLogin} onOpenChange={setShowLogin} />
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
