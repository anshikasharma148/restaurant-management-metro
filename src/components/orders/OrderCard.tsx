import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/ui/status-badge"
import { Clock, AlertTriangle } from "lucide-react"
import type { Order, OrderStatus } from "@/lib/types"

interface OrderCardProps {
  order: Order
  onStatusChange?: (orderId: string, newStatus: OrderStatus) => void
  showActions?: boolean
  className?: string
}

export function OrderCard({ order, onStatusChange, showActions = true, className }: OrderCardProps) {
  const isOverdue = order.status !== "ready" && order.status !== "completed" && 
    new Date().getTime() - new Date(order.createdAt).getTime() > 15 * 60 * 1000 // 15 minutes

  const displayStatus = isOverdue && order.status !== "ready" && order.status !== "completed" 
    ? "overdue" 
    : order.status

  const nextStatus: Record<OrderStatus, OrderStatus | null> = {
    pending: "preparing",
    preparing: "ready",
    ready: "completed",
    completed: null,
  }

  return (
    <div
      className={cn(
        "rounded-lg bg-card border border-border p-4 transition-all hover:border-primary/50",
        isOverdue && "border-destructive/50 bg-destructive/5",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold text-primary">#{order.orderNumber}</span>
          <StatusBadge status={displayStatus} />
        </div>
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          {isOverdue && <AlertTriangle className="w-4 h-4 text-destructive" />}
          <Clock className="w-4 h-4" />
          <span>{formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}</span>
        </div>
      </div>

      {/* Order type and table */}
      <div className="flex items-center gap-2 mb-3 text-sm">
        <span className={cn(
          "px-2 py-0.5 rounded text-xs font-medium uppercase",
          order.type === "dine-in" ? "bg-primary/20 text-primary" : "bg-secondary text-secondary-foreground"
        )}>
          {order.type}
        </span>
        {order.tableNumber && (
          <span className="text-muted-foreground">Table {order.tableNumber}</span>
        )}
      </div>

      {/* Items */}
      <div className="space-y-2 mb-4">
        {order.items.map((item, index) => (
          <div key={index} className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-muted flex items-center justify-center text-xs font-semibold">
                {item.quantity}
              </span>
              <span>{item.name}</span>
              {item.variant && (
                <span className="text-muted-foreground">({item.variant})</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Notes */}
      {order.notes && (
        <div className="text-sm text-muted-foreground bg-muted/50 rounded p-2 mb-4">
          <span className="font-medium">Note:</span> {order.notes}
        </div>
      )}

      {/* Actions */}
      {showActions && nextStatus[order.status] && (
        <div className="flex gap-2">
          <Button
            className="flex-1"
            onClick={() => onStatusChange?.(order.id, nextStatus[order.status]!)}
          >
            Mark as {nextStatus[order.status]}
          </Button>
        </div>
      )}
    </div>
  )
}
