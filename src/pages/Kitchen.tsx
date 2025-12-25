import { useState, useCallback } from "react"
import { OrderCard } from "@/components/orders/OrderCard"
import { StatusBadge } from "@/components/ui/status-badge"
import { Button } from "@/components/ui/button"
import { mockOrders } from "@/lib/mockData"
import { RefreshCw, Volume2, VolumeX } from "lucide-react"
import type { Order, OrderStatus } from "@/lib/types"

export default function KitchenPage() {
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [soundEnabled, setSoundEnabled] = useState(true)

  const handleStatusChange = useCallback((orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
          : order
      )
    )
  }, [])

  // Filter and group orders
  const pendingOrders = orders.filter((o) => o.status === "pending")
  const preparingOrders = orders.filter((o) => o.status === "preparing")
  const readyOrders = orders.filter((o) => o.status === "ready")

  // Check for overdue orders (>15 minutes)
  const hasOverdue = [...pendingOrders, ...preparingOrders].some((order) => {
    const elapsed = Date.now() - new Date(order.createdAt).getTime()
    return elapsed > 15 * 60 * 1000
  })

  return (
    <div className="min-h-screen p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Kitchen Display</h1>
          <p className="text-muted-foreground">
            {pendingOrders.length + preparingOrders.length} active orders
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? "Mute notifications" : "Enable notifications"}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </Button>
          <Button variant="outline" size="icon" title="Refresh">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Status summary */}
      <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
        <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg border border-border shrink-0">
          <StatusBadge status="pending" size="sm" />
          <span className="font-bold text-lg">{pendingOrders.length}</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg border border-border shrink-0">
          <StatusBadge status="preparing" size="sm" />
          <span className="font-bold text-lg">{preparingOrders.length}</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg border border-border shrink-0">
          <StatusBadge status="ready" size="sm" />
          <span className="font-bold text-lg">{readyOrders.length}</span>
        </div>
        {hasOverdue && (
          <div className="flex items-center gap-2 px-4 py-2 bg-destructive/10 rounded-lg border border-destructive/30 text-destructive shrink-0 animate-pulse">
            <span className="font-semibold">⚠️ Overdue orders!</span>
          </div>
        )}
      </div>

      {/* Orders grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Pending Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <StatusBadge status="pending" />
            <span className="text-sm text-muted-foreground">New orders</span>
          </div>
          {pendingOrders.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-lg">
              <p>No pending orders</p>
            </div>
          ) : (
            pendingOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onStatusChange={handleStatusChange}
              />
            ))
          )}
        </div>

        {/* Preparing Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <StatusBadge status="preparing" />
            <span className="text-sm text-muted-foreground">In progress</span>
          </div>
          {preparingOrders.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-lg">
              <p>No orders in progress</p>
            </div>
          ) : (
            preparingOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onStatusChange={handleStatusChange}
              />
            ))
          )}
        </div>

        {/* Ready Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <StatusBadge status="ready" />
            <span className="text-sm text-muted-foreground">Ready for pickup</span>
          </div>
          {readyOrders.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-lg">
              <p>No orders ready</p>
            </div>
          ) : (
            readyOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onStatusChange={handleStatusChange}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
