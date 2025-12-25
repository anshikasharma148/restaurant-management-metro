import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import type { User, UserRole } from "@/lib/types"
import { authAPI } from "@/lib/api"

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string, role: UserRole) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("metro_user")
    return stored ? JSON.parse(stored) : null
  })
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("metro_token")
      if (token && !user) {
        try {
          const userData = await authAPI.getMe()
          setUser({
            id: userData.id || userData._id,
            name: userData.name,
            email: userData.email,
            role: userData.role,
          })
          localStorage.setItem("metro_user", JSON.stringify({
            id: userData.id || userData._id,
            name: userData.name,
            email: userData.email,
            role: userData.role,
          }))
        } catch (error) {
          // Token invalid, clear storage
          localStorage.removeItem("metro_token")
          localStorage.removeItem("metro_user")
        }
      }
    }
    checkAuth()
  }, [])

  const login = useCallback(async (email: string, password: string, role: UserRole) => {
    setIsLoading(true)
    try {
      const response = await authAPI.login(email, password, role)
      const userData = response.user
      setUser({
        id: userData.id || userData._id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
      })
      localStorage.setItem("metro_user", JSON.stringify({
        id: userData.id || userData._id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
      }))
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
    } catch (error: any) {
      setIsLoading(false)
      throw new Error(error.message || "Login failed")
    }
  }, [navigate])

  const logout = useCallback(async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      // Continue with logout even if API call fails
    }
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
