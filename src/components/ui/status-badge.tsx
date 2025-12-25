import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const statusBadgeVariants = cva(
  "inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide transition-colors",
  {
    variants: {
      status: {
        pending: "bg-status-pending/20 text-status-pending border border-status-pending/30",
        preparing: "bg-status-preparing/20 text-status-preparing border border-status-preparing/30",
        ready: "bg-status-ready/20 text-status-ready border border-status-ready/30",
        overdue: "bg-status-overdue/20 text-status-overdue border border-status-overdue/30 animate-pulse",
        completed: "bg-status-completed/20 text-muted-foreground border border-border",
      },
      size: {
        sm: "px-2 py-0.5 text-[10px]",
        default: "px-3 py-1 text-xs",
        lg: "px-4 py-1.5 text-sm",
      },
    },
    defaultVariants: {
      status: "pending",
      size: "default",
    },
  }
)

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusBadgeVariants> {
  children?: React.ReactNode
}

const StatusBadge = React.forwardRef<HTMLSpanElement, StatusBadgeProps>(
  ({ className, status, size, children, ...props }, ref) => {
    const statusLabels = {
      pending: "Pending",
      preparing: "Preparing",
      ready: "Ready",
      overdue: "Overdue",
      completed: "Completed",
    }

    return (
      <span
        ref={ref}
        className={cn(statusBadgeVariants({ status, size, className }))}
        {...props}
      >
        {children || statusLabels[status || "pending"]}
      </span>
    )
  }
)
StatusBadge.displayName = "StatusBadge"

export { StatusBadge, statusBadgeVariants }
