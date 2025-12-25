import { useState } from "react"
import { Button } from "@/components/ui/button"
import { StatCard } from "@/components/dashboard/StatCard"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DollarSign,
  TrendingUp,
  ShoppingCart,
  Users,
  Download,
  Calendar,
} from "lucide-react"

const topItems = [
  { name: "Classic Burger", quantity: 45, revenue: 539.55 },
  { name: "Pepperoni Pizza", quantity: 38, revenue: 568.62 },
  { name: "Pasta Carbonara", quantity: 32, revenue: 447.68 },
  { name: "Caesar Salad", quantity: 28, revenue: 251.72 },
  { name: "Steak Frites", quantity: 22, revenue: 549.78 },
]

const categorySales = [
  { name: "Main Course", orders: 124, revenue: 2156.80 },
  { name: "Burgers", orders: 89, revenue: 1067.11 },
  { name: "Pizza", orders: 76, revenue: 1215.24 },
  { name: "Starters", orders: 65, revenue: 421.35 },
  { name: "Beverages", orders: 142, revenue: 497.58 },
  { name: "Desserts", orders: 48, revenue: 335.52 },
]

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState<"today" | "week" | "month">("today")

  return (
    <div className="min-h-screen p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 lg:mb-6">
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-foreground">Reports</h1>
            <p className="text-sm text-muted-foreground">Track performance</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Date range selector */}
            <div className="flex bg-muted rounded-lg p-1">
              {(["today", "week", "month"] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setDateRange(range)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors capitalize ${
                    dateRange === range
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>

            <Button variant="outline" size="sm" className="hidden sm:flex">
              <Calendar className="w-4 h-4 mr-2" />
              Custom
            </Button>

            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
          <StatCard
            title="Total Sales"
            value="$5,693"
            subtitle="544 orders"
            icon={DollarSign}
            trend={{ value: 12.5, isPositive: true }}
          />
          <StatCard
            title="Avg Order"
            value="$10.47"
            icon={TrendingUp}
            trend={{ value: 3.2, isPositive: true }}
          />
          <StatCard
            title="Orders"
            value="544"
            subtitle="432 dine-in"
            icon={ShoppingCart}
            trend={{ value: 8.4, isPositive: true }}
          />
          <StatCard
            title="Customers"
            value="387"
            icon={Users}
            trend={{ value: 15.2, isPositive: true }}
          />
        </div>

        {/* Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {/* Top Selling Items */}
          <div className="bg-card border border-border rounded-xl p-4 lg:p-6">
            <h2 className="font-semibold mb-4">Top Selling Items</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topItems.map((item, index) => (
                  <TableRow key={item.name}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </span>
                        <span className="text-sm">{item.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-sm">{item.quantity}</TableCell>
                    <TableCell className="text-right text-sm font-semibold text-primary">
                      ${item.revenue.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Category Sales */}
          <div className="bg-card border border-border rounded-xl p-4 lg:p-6">
            <h2 className="font-semibold mb-4">Sales by Category</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Orders</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categorySales.map((category) => (
                  <TableRow key={category.name}>
                    <TableCell className="font-medium text-sm">{category.name}</TableCell>
                    <TableCell className="text-right text-sm">{category.orders}</TableCell>
                    <TableCell className="text-right text-sm font-semibold text-primary">
                      ${category.revenue.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  )
}