import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Utensils, User, ChefHat, Receipt, ShieldCheck, Loader2 } from "lucide-react"
import type { UserRole } from "@/lib/types"

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
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        {/* Logo */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary mb-4">
            <Utensils className="w-10 h-10 text-primary-foreground" />
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
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg border transition-all ${
                    selectedRole === role.value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-card text-card-foreground hover:border-primary/50"
                  }`}
                >
                  <role.icon className="w-6 h-6" />
                  <span className="font-medium">{role.label}</span>
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
          <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
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
