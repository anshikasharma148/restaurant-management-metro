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
    <div className="p-6 lg:p-8 min-h-screen">
      {/* Header */}
      <div className="mb-8 animate-slide-down opacity-0 [animation-fill-mode:forwards]">
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back, <span className="text-gradient">{user?.name || "User"}</span>
        </h1>
        <p className="text-muted-foreground mt-2">
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
          delay={100}
        />
        <StatCard
          title="Active Orders"
          value={pendingOrders + preparingOrders}
          subtitle={`${pendingOrders} pending, ${preparingOrders} preparing`}
          icon={ShoppingCart}
          delay={150}
        />
        <StatCard
          title="Customers Today"
          value="89"
          subtitle="vs 76 yesterday"
          icon={Users}
          trend={{ value: 17.1, isPositive: true }}
          delay={200}
        />
        <StatCard
          title="Low Stock Items"
          value="3"
          subtitle="Need restock"
          icon={AlertTriangle}
          delay={250}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { to: "/orders/new", icon: ShoppingCart, title: "New Order", subtitle: "Create dine-in or takeaway", delay: 300 },
          { to: "/kitchen", icon: ChefHat, title: "Kitchen Display", subtitle: "View order queue", delay: 350 },
          { to: "/reports", icon: TrendingUp, title: "View Reports", subtitle: "Sales & analytics", delay: 400 },
        ].map((action) => (
          <Link key={action.to} to={action.to} className="block animate-slide-up opacity-0 [animation-fill-mode:forwards]" style={{ animationDelay: `${action.delay}ms` }}>
            <Button variant="outline" className="w-full h-20 justify-between text-left hover-lift group">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-105">
                  <action.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">{action.title}</p>
                  <p className="text-sm text-muted-foreground">{action.subtitle}</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="animate-slide-up opacity-0 [animation-fill-mode:forwards]" style={{ animationDelay: "450ms" }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recent Orders</h2>
          <Link to="/kitchen">
            <Button variant="ghost" size="sm" className="group">
              View all <ArrowRight className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockOrders.slice(0, 3).map((order, index) => (
            <div 
              key={order.id} 
              className="animate-scale-in opacity-0 [animation-fill-mode:forwards]"
              style={{ animationDelay: `${500 + index * 50}ms` }}
            >
              <OrderCard order={order} showActions={false} />
            </div>
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
          delay={100}
        />
        <StatCard
          title="Average Order Value"
          value="$20.05"
          icon={Receipt}
          trend={{ value: 5.2, isPositive: true }}
          delay={150}
        />
        <StatCard
          title="Peak Hour"
          value="12-1 PM"
          subtitle="38 orders"
          icon={TrendingUp}
          delay={200}
        />
        <StatCard
          title="Staff Active"
          value="6"
          subtitle="2 cashiers, 4 kitchen"
          icon={Users}
          delay={250}
        />
      </div>

      <div className="animate-slide-up opacity-0 [animation-fill-mode:forwards]" style={{ animationDelay: "300ms" }}>
        <Link to="/reports">
          <Button size="lg" className="w-full md:w-auto hover:shadow-glow transition-all duration-300">
            View Full Reports <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
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
          delay={100}
        />
        <StatCard
          title="Pending Payments"
          value="2"
          subtitle="Tables 6 & 9"
          icon={Receipt}
          delay={150}
        />
      </div>

      <div className="animate-scale-in opacity-0 [animation-fill-mode:forwards]" style={{ animationDelay: "200ms" }}>
        <Link to="/orders/new">
          <Button size="lg" className="w-full h-20 text-xl font-bold animate-pulse-glow">
            <ShoppingCart className="w-7 h-7 mr-3" />
            Start New Order
          </Button>
        </Link>
      </div>

      <div className="animate-slide-up opacity-0 [animation-fill-mode:forwards]" style={{ animationDelay: "250ms" }}>
        <h2 className="text-lg font-semibold mb-4">My Recent Orders</h2>
        <div className="space-y-4">
          {mockOrders.slice(0, 2).map((order, index) => (
            <div 
              key={order.id}
              className="animate-slide-in-right opacity-0 [animation-fill-mode:forwards]"
              style={{ animationDelay: `${300 + index * 100}ms` }}
            >
              <OrderCard order={order} showActions={false} />
            </div>
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
          delay={100}
        />
        <StatCard
          title="Preparing"
          value={pendingOrders.filter((o) => o.status === "preparing").length}
          icon={ChefHat}
          delay={150}
        />
      </div>

      <div className="animate-scale-in opacity-0 [animation-fill-mode:forwards]" style={{ animationDelay: "200ms" }}>
        <Link to="/kitchen">
          <Button size="lg" className="w-full h-20 text-xl font-bold hover:shadow-glow transition-all duration-300">
            <ChefHat className="w-7 h-7 mr-3" />
            Open Kitchen Display
          </Button>
        </Link>
      </div>
    </div>
  )
}
