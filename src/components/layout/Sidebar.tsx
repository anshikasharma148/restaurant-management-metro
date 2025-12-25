import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import {
  LayoutDashboard,
  ShoppingCart,
  ChefHat,
  Receipt,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Utensils,
} from "lucide-react"
import { useAuth } from "@/hooks/useAuth"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["admin", "manager", "cashier", "kitchen"] },
  { name: "New Order", href: "/orders/new", icon: ShoppingCart, roles: ["admin", "manager", "cashier"] },
  { name: "Kitchen", href: "/kitchen", icon: ChefHat, roles: ["admin", "manager", "kitchen"] },
  { name: "Billing", href: "/billing", icon: Receipt, roles: ["admin", "manager", "cashier"] },
  { name: "Reports", href: "/reports", icon: BarChart3, roles: ["admin", "manager"] },
  { name: "Settings", href: "/settings", icon: Settings, roles: ["admin"] },
]

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const { user, logout } = useAuth()

  const filteredNavigation = navigation.filter(
    (item) => user && item.roles.includes(user.role)
  )

  return (
    <>
      {/* Mobile header with hamburger */}
      <header className="fixed top-0 left-0 right-0 z-40 lg:hidden bg-card border-b border-border h-14 flex items-center px-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(true)}
        >
          <Menu className="w-5 h-5" />
        </Button>
        <Link to="/dashboard" className="flex items-center gap-2 ml-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Utensils className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-foreground">Metro</span>
        </Link>
        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </header>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen bg-sidebar border-r border-sidebar-border transition-transform duration-300 flex flex-col w-64 lg:w-20",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-14 px-4 border-b border-sidebar-border lg:justify-center">
          <Link to="/dashboard" className="flex items-center gap-2 lg:gap-0">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Utensils className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-sidebar-foreground lg:hidden">Metro</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="lg:hidden"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-1 px-3">
            {filteredNavigation.map((item) => {
              const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + "/")
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-3 rounded-xl transition-colors text-sidebar-foreground",
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "hover:bg-sidebar-accent",
                      "lg:justify-center lg:px-0"
                    )}
                    title={item.name}
                  >
                    <item.icon className="w-5 h-5 shrink-0" />
                    <span className="font-medium lg:hidden">{item.name}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-sidebar-border">
          {/* Theme toggle - desktop only */}
          <div className="hidden lg:flex justify-center mb-3">
            <ThemeToggle />
          </div>
          
          {user && (
            <div className="flex items-center gap-3 mb-3 p-2 rounded-lg bg-sidebar-accent/50 lg:justify-center lg:p-0 lg:bg-transparent">
              <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center text-sm font-semibold text-primary border border-primary/20">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0 lg:hidden">
                <p className="text-sm font-medium text-sidebar-foreground truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 lg:justify-center"
            onClick={logout}
          >
            <LogOut className="w-5 h-5" />
            <span className="ml-3 lg:hidden">Logout</span>
          </Button>
        </div>
      </aside>
    </>
  )
}