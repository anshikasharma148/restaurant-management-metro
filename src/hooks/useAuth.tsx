import { createContext, useContext, useState, useCallback, ReactNode } from "react"
import { useNavigate } from "react-router-dom"
import type { User, UserRole } from "@/lib/types"

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string, role: UserRole) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users for demo
const mockUsers: Record<UserRole, User> = {
  admin: { id: "1", name: "Admin User", email: "admin@metro.com", role: "admin" },
  manager: { id: "2", name: "Manager User", email: "manager@metro.com", role: "manager" },
  cashier: { id: "3", name: "Cashier User", email: "cashier@metro.com", role: "cashier" },
  kitchen: { id: "4", name: "Kitchen Staff", email: "kitchen@metro.com", role: "kitchen" },
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("metro_user")
    return stored ? JSON.parse(stored) : null
  })
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const login = useCallback(async (email: string, password: string, role: UserRole) => {
    setIsLoading(true)
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800))
    
    const mockUser = mockUsers[role]
    setUser(mockUser)
    localStorage.setItem("metro_user", JSON.stringify(mockUser))
    setIsLoading(false)
    
    // Navigate based on role
    switch (role) {
      case "kitchen":
        navigate("/kitchen")
        break
      case "cashier":
        navigate("/orders/new")
        break
      default:
        navigate("/dashboard")
    }
  }, [navigate])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem("metro_user")
    navigate("/login")
  }, [navigate])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
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
