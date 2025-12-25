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

  // Role-specific dashboard content
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
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">
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
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
          subtitle={`${pendingOrders} pending, ${preparingOrders} preparing`}
          icon={ShoppingCart}
        />
        <StatCard
          title="Customers Today"
          value="89"
          subtitle="vs 76 yesterday"
          icon={Users}
          trend={{ value: 17.1, isPositive: true }}
        />
        <StatCard
          title="Low Stock Items"
          value="3"
          subtitle="Need restock"
          icon={AlertTriangle}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/orders/new" className="block">
          <Button variant="outline" className="w-full h-20 justify-between text-left">
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-6 h-6 text-primary" />
              <div>
                <p className="font-semibold">New Order</p>
                <p className="text-sm text-muted-foreground">Create dine-in or takeaway</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5" />
          </Button>
        </Link>
        <Link to="/kitchen" className="block">
          <Button variant="outline" className="w-full h-20 justify-between text-left">
            <div className="flex items-center gap-3">
              <ChefHat className="w-6 h-6 text-primary" />
              <div>
                <p className="font-semibold">Kitchen Display</p>
                <p className="text-sm text-muted-foreground">View order queue</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5" />
          </Button>
        </Link>
        <Link to="/reports" className="block">
          <Button variant="outline" className="w-full h-20 justify-between text-left">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-primary" />
              <div>
                <p className="font-semibold">View Reports</p>
                <p className="text-sm text-muted-foreground">Sales & analytics</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5" />
          </Button>
        </Link>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Today's Sales"
          value="$2,847"
          subtitle="142 orders"
          icon={DollarSign}
          trend={{ value: 12.5, isPositive: true }}
        />
        <StatCard
          title="Average Order Value"
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

      <Link to="/reports" className="block">
        <Button size="lg" className="w-full md:w-auto">
          View Full Reports <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </Link>
    </div>
  )
}

function CashierDashboard() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard
          title="My Orders Today"
          value="28"
          subtitle="$562 in sales"
          icon={ShoppingCart}
        />
        <StatCard
          title="Pending Payments"
          value="2"
          subtitle="Tables 6 & 9"
          icon={Receipt}
        />
      </div>

      <Link to="/orders/new">
        <Button size="xl" className="w-full animate-pulse-glow">
          <ShoppingCart className="w-6 h-6 mr-2" />
          Start New Order
        </Button>
      </Link>

      <div>
        <h2 className="text-lg font-semibold mb-4">My Recent Orders</h2>
        <div className="space-y-4">
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
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          title="Pending Orders"
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
        <Button size="xl" className="w-full">
          <ChefHat className="w-6 h-6 mr-2" />
          Open Kitchen Display
        </Button>
      </Link>
    </div>
  )
}
