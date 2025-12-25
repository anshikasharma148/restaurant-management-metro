import { useAuth } from "@/hooks/useAuth"
import { StatCard } from "@/components/dashboard/StatCard"
import { OrderCard } from "@/components/orders/OrderCard"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { reportsAPI, ordersAPI } from "@/lib/api"
import { useEffect, useState } from "react"
import {
  DollarSign,
  ShoppingCart,
  Users,
  AlertTriangle,
  ChefHat,
  Receipt,
  ArrowRight,
  TrendingUp,
} from "lucide-react"

export default function DashboardPage() {
  const { user } = useAuth()

  const renderDashboard = () => {
    switch (user?.role) {
      case "kitchen":
        return <KitchenDashboard />
      case "cashier":
        return <CashierDashboard />
      case "manager":
        return <ManagerDashboard />
      case "admin":
      default:
        return <AdminDashboard />
    }
  }

  return (
    <div className="p-4 lg:p-6 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
          Welcome back, {user?.name || "User"}
        </h1>
        <p className="text-muted-foreground mt-1">
          Here's what's happening at Metro today
        </p>
      </div>

      {renderDashboard()}
    </div>
  )
}

function AdminDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashboardStats, orders] = await Promise.all([
          reportsAPI.getDashboardStats(),
          ordersAPI.getOrders(),
        ])
        setStats(dashboardStats)
        setRecentOrders(orders.slice(0, 3))
      } catch (error) {
        console.error("Failed to load dashboard data", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading || !stats) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <StatCard
          title="Today's Sales"
          value={`$${stats.todaySales?.toFixed(2) || "0.00"}`}
          subtitle={`${stats.todayOrders || 0} orders`}
          icon={DollarSign}
          trend={stats.salesTrend ? { value: Math.abs(stats.salesTrend), isPositive: stats.salesTrend > 0 } : undefined}
        />
        <StatCard
          title="Active Orders"
          value={stats.activeOrders || 0}
          subtitle={`${stats.pendingOrders || 0} pending`}
          icon={ShoppingCart}
        />
        <StatCard
          title="Preparing"
          value={stats.preparingOrders || 0}
          subtitle="In kitchen"
          icon={ChefHat}
        />
        <StatCard
          title="Ready"
          value={(stats.activeOrders || 0) - (stats.pendingOrders || 0) - (stats.preparingOrders || 0)}
          subtitle="Ready for pickup"
          icon={Receipt}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { to: "/orders/new", icon: ShoppingCart, title: "New Order", subtitle: "Create order" },
          { to: "/kitchen", icon: ChefHat, title: "Kitchen", subtitle: "View queue" },
          { to: "/reports", icon: TrendingUp, title: "Reports", subtitle: "Analytics" },
        ].map((action) => (
          <Link key={action.to} to={action.to}>
            <Button variant="outline" className="w-full h-16 justify-between text-left hover-lift">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <action.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{action.title}</p>
                  <p className="text-xs text-muted-foreground">{action.subtitle}</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
            </Button>
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Orders</h2>
          <Link to="/kitchen">
            <Button variant="ghost" size="sm">
              View all <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {recentOrders.map((order) => {
            const orderId = order._id || order.id
            return (
              <OrderCard key={orderId} order={order} showActions={false} />
            )
          })}
        </div>
      </div>
    </div>
  )
}

function ManagerDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dashboardStats = await reportsAPI.getDashboardStats()
        setStats(dashboardStats)
      } catch (error) {
        console.error("Failed to load dashboard data", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading || !stats) {
    return <div className="text-center py-12">Loading...</div>
  }

  const avgOrder = stats.todayOrders > 0 ? (stats.todaySales / stats.todayOrders) : 0

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <StatCard
          title="Today's Sales"
          value={`$${stats.todaySales?.toFixed(2) || "0.00"}`}
          subtitle={`${stats.todayOrders || 0} orders`}
          icon={DollarSign}
          trend={stats.salesTrend ? { value: Math.abs(stats.salesTrend), isPositive: stats.salesTrend > 0 } : undefined}
        />
        <StatCard
          title="Avg Order"
          value={`$${avgOrder.toFixed(2)}`}
          icon={Receipt}
        />
        <StatCard
          title="Active Orders"
          value={stats.activeOrders || 0}
          subtitle={`${stats.pendingOrders || 0} pending`}
          icon={TrendingUp}
        />
        <StatCard
          title="Preparing"
          value={stats.preparingOrders || 0}
          subtitle="In kitchen"
          icon={Users}
        />
      </div>

      <Link to="/reports">
        <Button size="lg" className="w-full sm:w-auto">
          View Full Reports <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </Link>
    </div>
  )
}

function CashierDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dashboardStats = await reportsAPI.getDashboardStats()
        setStats(dashboardStats)
      } catch (error) {
        console.error("Failed to load dashboard data", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading || !stats) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          title="Today's Orders"
          value={stats.todayOrders || 0}
          subtitle={`$${stats.todaySales?.toFixed(2) || "0.00"} in sales`}
          icon={ShoppingCart}
        />
        <StatCard
          title="Pending"
          value={stats.pendingOrders || 0}
          subtitle="Awaiting payment"
          icon={Receipt}
        />
      </div>

      <Link to="/orders/new">
        <Button size="lg" className="w-full h-16 text-lg font-bold">
          <ShoppingCart className="w-6 h-6 mr-3" />
          Start New Order
        </Button>
      </Link>

      <div>
        <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
        <div className="space-y-3">
          {stats.recentOrders?.slice(0, 2).map((order: any) => {
            const orderId = order._id || order.id
            return (
              <OrderCard key={orderId} order={order} showActions={false} />
            )
          }) || <p className="text-muted-foreground text-sm">No recent orders</p>}
        </div>
      </div>
    </div>
  )
}

function KitchenDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dashboardStats = await reportsAPI.getDashboardStats()
        setStats(dashboardStats)
      } catch (error) {
        console.error("Failed to load dashboard data", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading || !stats) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          title="Pending"
          value={stats.pendingOrders || 0}
          icon={AlertTriangle}
        />
        <StatCard
          title="Preparing"
          value={stats.preparingOrders || 0}
          icon={ChefHat}
        />
      </div>

      <Link to="/kitchen">
        <Button size="lg" className="w-full h-16 text-lg font-bold">
          <ChefHat className="w-6 h-6 mr-3" />
          Open Kitchen Display
        </Button>
      </Link>
    </div>
  )
}