import { useAuth } from "@/hooks/useAuth"
import { StatCard } from "@/components/dashboard/StatCard"
import { OrderCard } from "@/components/orders/OrderCard"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { mockOrders } from "@/lib/mockData"
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
  const pendingOrders = mockOrders.filter((o) => o.status === "pending").length
  const preparingOrders = mockOrders.filter((o) => o.status === "preparing").length

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <StatCard
          title="Today's Sales"
          value="$2,847"
          subtitle="142 orders"
          icon={DollarSign}
          trend={{ value: 12.5, isPositive: true }}
        />
        <StatCard
          title="Active Orders"
          value={pendingOrders + preparingOrders}
          subtitle={`${pendingOrders} pending`}
          icon={ShoppingCart}
        />
        <StatCard
          title="Customers"
          value="89"
          subtitle="vs 76 yesterday"
          icon={Users}
          trend={{ value: 17.1, isPositive: true }}
        />
        <StatCard
          title="Low Stock"
          value="3"
          subtitle="Need restock"
          icon={AlertTriangle}
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
          {mockOrders.slice(0, 3).map((order) => (
            <OrderCard key={order.id} order={order} showActions={false} />
          ))}
        </div>
      </div>
    </div>
  )
}

function ManagerDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <StatCard
          title="Today's Sales"
          value="$2,847"
          subtitle="142 orders"
          icon={DollarSign}
          trend={{ value: 12.5, isPositive: true }}
        />
        <StatCard
          title="Avg Order"
          value="$20.05"
          icon={Receipt}
          trend={{ value: 5.2, isPositive: true }}
        />
        <StatCard
          title="Peak Hour"
          value="12-1 PM"
          subtitle="38 orders"
          icon={TrendingUp}
        />
        <StatCard
          title="Staff Active"
          value="6"
          subtitle="2 cashiers, 4 kitchen"
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
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          title="My Orders"
          value="28"
          subtitle="$562 in sales"
          icon={ShoppingCart}
        />
        <StatCard
          title="Pending"
          value="2"
          subtitle="Tables 6 & 9"
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
        <h2 className="text-lg font-semibold mb-4">My Recent Orders</h2>
        <div className="space-y-3">
          {mockOrders.slice(0, 2).map((order) => (
            <OrderCard key={order.id} order={order} showActions={false} />
          ))}
        </div>
      </div>
    </div>
  )
}

function KitchenDashboard() {
  const pendingOrders = mockOrders.filter((o) => o.status === "pending" || o.status === "preparing")

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          title="Pending"
          value={pendingOrders.filter((o) => o.status === "pending").length}
          icon={AlertTriangle}
        />
        <StatCard
          title="Preparing"
          value={pendingOrders.filter((o) => o.status === "preparing").length}
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