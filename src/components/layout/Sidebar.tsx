import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
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
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col",
          collapsed ? "w-0 lg:w-20" : "w-72"
        )}
      >
        {/* Header */}
        <div className={cn("flex items-center h-16 px-4 border-b border-sidebar-border", collapsed && "lg:justify-center")}>
          {!collapsed && (
            <Link to="/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <Utensils className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-sidebar-foreground">Metro</span>
            </Link>
          )}
          {collapsed && (
            <div className="hidden lg:flex w-10 h-10 rounded-lg bg-primary items-center justify-center">
              <Utensils className="w-5 h-5 text-primary-foreground" />
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className={cn("flex-1 py-4 overflow-y-auto", collapsed && "hidden lg:block")}>
          <ul className="space-y-1 px-3">
            {filteredNavigation.map((item) => {
              const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + "/")
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-3 rounded-lg transition-colors text-sidebar-foreground",
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      collapsed && "lg:justify-center lg:px-0"
                    )}
                    title={collapsed ? item.name : undefined}
                  >
                    <item.icon className="w-5 h-5 shrink-0" />
                    {!collapsed && <span className="font-medium">{item.name}</span>}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* User section */}
        <div className={cn("p-4 border-t border-sidebar-border", collapsed && "hidden lg:block")}>
          {user && (
            <div className={cn("flex items-center gap-3 mb-3", collapsed && "lg:justify-center")}>
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-semibold">
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
            className={cn("w-full justify-start text-muted-foreground hover:text-destructive", collapsed && "lg:justify-center")}
            onClick={logout}
          >
            <LogOut className="w-5 h-5" />
            {!collapsed && <span className="ml-3">Logout</span>}
          </Button>
        </div>
      </aside>

      {/* Toggle button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:left-auto lg:ml-4"
        onClick={() => setCollapsed(!collapsed)}
        style={{ left: collapsed ? "1rem" : "17rem" }}
      >
        {collapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5 lg:hidden" />}
        {!collapsed && <X className="w-5 h-5 hidden lg:block" />}
      </Button>
    </>
  )
}
