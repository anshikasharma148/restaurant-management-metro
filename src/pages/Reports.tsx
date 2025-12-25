import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { StatCard } from "@/components/dashboard/StatCard"
import { reportsAPI } from "@/lib/api"
import { toast } from "sonner"
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

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState<"today" | "week" | "month">("today")
  const [salesSummary, setSalesSummary] = useState<any>(null)
  const [topItems, setTopItems] = useState<any[]>([])
  const [categorySales, setCategorySales] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true)
        const today = new Date()
        let startDate: string | undefined
        let endDate: string | undefined

        if (dateRange === "today") {
          startDate = today.toISOString().split("T")[0]
          endDate = today.toISOString().split("T")[0]
        } else if (dateRange === "week") {
          const weekAgo = new Date(today)
          weekAgo.setDate(weekAgo.getDate() - 7)
          startDate = weekAgo.toISOString().split("T")[0]
          endDate = today.toISOString().split("T")[0]
        } else if (dateRange === "month") {
          const monthAgo = new Date(today)
          monthAgo.setMonth(monthAgo.getMonth() - 1)
          startDate = monthAgo.toISOString().split("T")[0]
          endDate = today.toISOString().split("T")[0]
        }

        const [sales, items, categories] = await Promise.all([
          reportsAPI.getSalesSummary({ startDate, endDate }),
          reportsAPI.getTopItems({ startDate, endDate, limit: 5 }),
          reportsAPI.getCategorySales({ startDate, endDate }),
        ])
        setSalesSummary(sales)
        setTopItems(items)
        setCategorySales(categories)
      } catch (error: any) {
        toast.error(error.message || "Failed to load reports")
      } finally {
        setLoading(false)
      }
    }
    fetchReports()
  }, [dateRange])

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
        {loading ? (
          <div className="text-center py-12 mb-6">Loading reports...</div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
            <StatCard
              title="Total Sales"
              value={`₹${salesSummary?.totalSales?.toFixed(2) || "0.00"}`}
              subtitle={`${salesSummary?.totalOrders || 0} orders`}
              icon={DollarSign}
            />
            <StatCard
              title="Avg Order"
              value={`₹${salesSummary?.averageOrderValue?.toFixed(2) || "0.00"}`}
              icon={TrendingUp}
            />
            <StatCard
              title="Orders"
              value={salesSummary?.totalOrders || 0}
              icon={ShoppingCart}
            />
            <StatCard
              title="Top Items"
              value={topItems.length}
              subtitle="Tracked"
              icon={Users}
            />
          </div>
        )}

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
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : topItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                      No data available
                    </TableCell>
                  </TableRow>
                ) : (
                  topItems.map((item, index) => (
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
                        ₹{item.revenue.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
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
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : categorySales.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                      No data available
                    </TableCell>
                  </TableRow>
                ) : (
                  categorySales.map((category) => (
                    <TableRow key={category.name}>
                      <TableCell className="font-medium text-sm">{category.name}</TableCell>
                      <TableCell className="text-right text-sm">{category.orders}</TableCell>
                      <TableCell className="text-right text-sm font-semibold text-primary">
                        ₹{category.revenue.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  )
}