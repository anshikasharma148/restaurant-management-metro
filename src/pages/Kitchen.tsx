import { useState, useCallback, useEffect } from "react"
import { OrderCard } from "@/components/orders/OrderCard"
import { StatusBadge } from "@/components/ui/status-badge"
import { Button } from "@/components/ui/button"
import { ordersAPI } from "@/lib/api"
import { toast } from "sonner"
import { RefreshCw, Volume2, VolumeX } from "lucide-react"
import type { Order, OrderStatus } from "@/lib/types"

export default function KitchenPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [loading, setLoading] = useState(true)

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true)
      const data = await ordersAPI.getOrders({ status: "pending,preparing,ready" })
      setOrders(data)
    } catch (error: any) {
      toast.error(error.message || "Failed to load orders")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOrders()
    const interval = setInterval(fetchOrders, 5000) // Refresh every 5 seconds
    return () => clearInterval(interval)
  }, [fetchOrders])

  const handleStatusChange = useCallback(async (orderId: string, newStatus: OrderStatus) => {
    try {
      await ordersAPI.updateOrderStatus(orderId, newStatus)
      await fetchOrders()
      toast.success("Order status updated")
    } catch (error: any) {
      toast.error(error.message || "Failed to update order status")
    }
  }, [fetchOrders])

  const pendingOrders = orders.filter((o) => o.status === "pending")
  const preparingOrders = orders.filter((o) => o.status === "preparing")
  const readyOrders = orders.filter((o) => o.status === "ready")

  const hasOverdue = [...pendingOrders, ...preparingOrders].some((order) => {
    const elapsed = Date.now() - new Date(order.createdAt).getTime()
    return elapsed > 15 * 60 * 1000
  })

  return (
    <div className="min-h-screen p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-foreground">Kitchen Display</h1>
          <p className="text-sm text-muted-foreground">
            {pendingOrders.length + preparingOrders.length} active orders
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSoundEnabled(!soundEnabled)}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </Button>
          <Button variant="outline" size="icon" onClick={fetchOrders} disabled={loading}>
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Status summary */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        <div className="flex items-center gap-2 px-3 py-2 bg-card rounded-lg border border-border shrink-0">
          <StatusBadge status="pending" size="sm" />
          <span className="font-bold">{pendingOrders.length}</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-card rounded-lg border border-border shrink-0">
          <StatusBadge status="preparing" size="sm" />
          <span className="font-bold">{preparingOrders.length}</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-card rounded-lg border border-border shrink-0">
          <StatusBadge status="ready" size="sm" />
          <span className="font-bold">{readyOrders.length}</span>
        </div>
        {hasOverdue && (
          <div className="flex items-center gap-2 px-3 py-2 bg-status-overdue/10 rounded-lg border border-status-overdue/20 text-status-overdue shrink-0">
            <span className="font-semibold text-sm">⚠️ Overdue</span>
          </div>
        )}
      </div>

      {/* Orders grid */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-base">Loading orders...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
          {/* Pending Column */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <StatusBadge status="pending" />
              <span className="text-sm text-muted-foreground">New orders</span>
            </div>
            {pendingOrders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground border border-dashed border-border rounded-lg">
                <p className="text-sm">No pending orders</p>
              </div>
            ) : (
              pendingOrders.map((order) => {
                const orderId = order._id || order.id
                return (
                  <OrderCard key={orderId} order={order} onStatusChange={handleStatusChange} />
                )
              })
            )}
          </div>

          {/* Preparing Column */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <StatusBadge status="preparing" />
              <span className="text-sm text-muted-foreground">In progress</span>
            </div>
            {preparingOrders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground border border-dashed border-border rounded-lg">
                <p className="text-sm">No orders in progress</p>
              </div>
            ) : (
              preparingOrders.map((order) => {
                const orderId = order._id || order.id
                return (
                  <OrderCard key={orderId} order={order} onStatusChange={handleStatusChange} />
                )
              })
            )}
          </div>

          {/* Ready Column */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <StatusBadge status="ready" />
              <span className="text-sm text-muted-foreground">Ready for pickup</span>
            </div>
            {readyOrders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground border border-dashed border-border rounded-lg">
                <p className="text-sm">No orders ready</p>
              </div>
            ) : (
              readyOrders.map((order) => {
                const orderId = order._id || order.id
                return (
                  <OrderCard key={orderId} order={order} onStatusChange={handleStatusChange} />
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}