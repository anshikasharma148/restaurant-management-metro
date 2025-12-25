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
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  const { user, logout } = useAuth()

  const filteredNavigation = navigation.filter(
    (item) => user && item.roles.includes(user.role)
  )

  return (
    <>
      {/* Mobile overlay */}
      {!collapsed && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          onClick={() => setCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col shadow-elevated",
          collapsed ? "w-0 lg:w-20" : "w-72"
        )}
      >
        {/* Header */}
        <div className={cn("flex items-center h-16 px-4 border-b border-sidebar-border", collapsed && "lg:justify-center")}>
          {!collapsed && (
            <Link to="/dashboard" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-glow transition-transform duration-300 group-hover:scale-105">
                <Utensils className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-sidebar-foreground">Metro</span>
            </Link>
          )}
          {collapsed && (
            <div className="hidden lg:flex w-10 h-10 rounded-xl bg-primary items-center justify-center shadow-glow">
              <Utensils className="w-5 h-5 text-primary-foreground" />
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className={cn("flex-1 py-4 overflow-y-auto", collapsed && "hidden lg:block")}>
          <ul className="space-y-1 px-3">
            {filteredNavigation.map((item, index) => {
              const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + "/")
              return (
                <li key={item.name} style={{ animationDelay: `${index * 0.05}s` }} className="animate-slide-up opacity-0 [animation-fill-mode:forwards]">
                  <Link
                    to={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 text-sidebar-foreground group",
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-glow"
                        : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover-lift",
                      collapsed && "lg:justify-center lg:px-0"
                    )}
                    title={collapsed ? item.name : undefined}
                  >
                    <item.icon className={cn(
                      "w-5 h-5 shrink-0 transition-transform duration-200",
                      !isActive && "group-hover:scale-110"
                    )} />
                    {!collapsed && <span className="font-medium">{item.name}</span>}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* User section */}
        <div className={cn("p-4 border-t border-sidebar-border", collapsed && "hidden lg:block")}>
          {/* Theme toggle */}
          <div className={cn("mb-3 flex items-center", collapsed ? "lg:justify-center" : "justify-between")}>
            {!collapsed && <span className="text-sm text-muted-foreground">Theme</span>}
            <ThemeToggle />
          </div>
          
          {user && (
            <div className={cn("flex items-center gap-3 mb-3 p-2 rounded-lg bg-sidebar-accent/50", collapsed && "lg:justify-center lg:p-0 lg:bg-transparent")}>
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold text-primary border-2 border-primary/30">
                {user.name.charAt(0).toUpperCase()}
              </div>
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-sidebar-foreground truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                </div>
              )}
            </div>
          )}
          <Button
            variant="ghost"
            className={cn("w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10", collapsed && "lg:justify-center")}
            onClick={logout}
          >
            <LogOut className="w-5 h-5" />
            {!collapsed && <span className="ml-3">Logout</span>}
          </Button>
        </div>
      </aside>

      {/* Toggle button */}
      <Button
        variant="outline"
        size="icon"
        className={cn(
          "fixed top-4 z-50 shadow-elevated transition-all duration-300",
          collapsed ? "left-4 lg:left-24" : "left-[17rem]"
        )}
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
      </Button>
    </>
  )
}
