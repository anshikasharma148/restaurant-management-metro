import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ThemeToggle } from "@/components/ui/theme-toggle"
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
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />
      </div>

      {/* Theme toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md space-y-8 animate-scale-in relative">
        {/* Logo */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary mb-6 shadow-glow animate-bounce-in">
            <Utensils className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-foreground animate-slide-up opacity-0 [animation-fill-mode:forwards]" style={{ animationDelay: "0.1s" }}>
            Metro
          </h1>
          <p className="text-muted-foreground mt-2 animate-slide-up opacity-0 [animation-fill-mode:forwards]" style={{ animationDelay: "0.2s" }}>
            Restaurant Management System
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Role Selection */}
          <div className="space-y-3 animate-slide-up opacity-0 [animation-fill-mode:forwards]" style={{ animationDelay: "0.3s" }}>
            <Label className="text-sm font-medium">Select Role</Label>
            <div className="grid grid-cols-2 gap-3">
              {roles.map((role, index) => (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => setSelectedRole(role.value)}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-300 hover-lift",
                    selectedRole === role.value
                      ? "border-primary bg-primary/10 text-primary shadow-glow"
                      : "border-border bg-card text-card-foreground hover:border-primary/50"
                  )}
                  style={{ animationDelay: `${0.4 + index * 0.05}s` }}
                >
                  <role.icon className={cn(
                    "w-6 h-6 transition-transform duration-300",
                    selectedRole === role.value && "scale-110"
                  )} />
                  <span className="font-medium">{role.label}</span>
                  <span className="text-xs text-muted-foreground">{role.description}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2 animate-slide-up opacity-0 [animation-fill-mode:forwards]" style={{ animationDelay: "0.5s" }}>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 transition-all duration-300 focus:shadow-glow"
            />
          </div>

          {/* Password */}
          <div className="space-y-2 animate-slide-up opacity-0 [animation-fill-mode:forwards]" style={{ animationDelay: "0.6s" }}>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 transition-all duration-300 focus:shadow-glow"
            />
          </div>

          {/* Submit */}
          <div className="animate-slide-up opacity-0 [animation-fill-mode:forwards]" style={{ animationDelay: "0.7s" }}>
            <Button 
              type="submit" 
              size="lg" 
              className="w-full h-14 text-lg font-semibold transition-all duration-300 hover:shadow-glow" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </div>

          {/* Demo hint */}
          <p className="text-center text-sm text-muted-foreground animate-fade-in opacity-0 [animation-fill-mode:forwards]" style={{ animationDelay: "0.8s" }}>
            Demo mode: Select any role and click Sign In
          </p>
        </form>
      </div>
    </div>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}
