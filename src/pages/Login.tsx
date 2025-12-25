import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Utensils, User, ChefHat, Receipt, ShieldCheck, Loader2 } from "lucide-react"
import type { UserRole } from "@/lib/types"
import { cn } from "@/lib/utils"

const roles: { value: UserRole; label: string; icon: typeof User; description: string }[] = [
  { value: "admin", label: "Admin", icon: ShieldCheck, description: "Full system access" },
  { value: "manager", label: "Manager", icon: User, description: "Reports & operations" },
  { value: "cashier", label: "Cashier", icon: Receipt, description: "Orders & billing" },
  { value: "kitchen", label: "Kitchen", icon: ChefHat, description: "Order queue" },
]

export default function LoginPage() {
  const { login, isLoading } = useAuth()
  const [selectedRole, setSelectedRole] = useState<UserRole>("cashier")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await login(email, password, selectedRole)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      {/* Theme toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md space-y-8 animate-fade-in">
        {/* Logo */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary mb-6">
            <Utensils className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Metro</h1>
          <p className="text-muted-foreground mt-2">Restaurant Management System</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Role Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Select Role</Label>
            <div className="grid grid-cols-2 gap-3">
              {roles.map((role) => (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => setSelectedRole(role.value)}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-xl border transition-colors",
                    selectedRole === role.value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-card text-card-foreground hover:border-primary/50"
                  )}
                >
                  <role.icon className="w-5 h-5" />
                  <span className="font-medium text-sm">{role.label}</span>
                  <span className="text-xs text-muted-foreground">{role.description}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12"
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12"
            />
          </div>

          {/* Submit */}
          <Button 
            type="submit" 
            size="lg" 
            className="w-full h-12 text-base font-semibold" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>

          {/* Demo hint */}
          <p className="text-center text-sm text-muted-foreground">
            Demo mode: Select any role and click Sign In
          </p>
        </form>
      </div>
    </div>
  )
}