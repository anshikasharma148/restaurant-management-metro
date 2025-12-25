import { cn } from "@/lib/utils"

interface LoadingSkeletonProps {
  className?: string
}

export function CardSkeleton({ className }: LoadingSkeletonProps) {
  return (
    <div className={cn("rounded-lg bg-card border border-border p-4 space-y-3 animate-pulse", className)}>
      <div className="h-4 bg-muted rounded w-3/4" />
      <div className="h-3 bg-muted rounded w-1/2" />
      <div className="h-8 bg-muted rounded w-full mt-4" />
    </div>
  )
}

export function TableRowSkeleton({ className }: LoadingSkeletonProps) {
  return (
    <div className={cn("flex items-center gap-4 p-4 border-b border-border animate-pulse", className)}>
      <div className="h-4 bg-muted rounded w-1/4" />
      <div className="h-4 bg-muted rounded w-1/3" />
      <div className="h-4 bg-muted rounded w-1/6" />
      <div className="h-4 bg-muted rounded w-1/6 ml-auto" />
    </div>
  )
}

export function MenuItemSkeleton({ className }: LoadingSkeletonProps) {
  return (
    <div className={cn("rounded-lg bg-card border border-border p-4 animate-pulse", className)}>
      <div className="flex gap-4">
        <div className="w-20 h-20 bg-muted rounded-lg" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-muted rounded w-3/4" />
          <div className="h-3 bg-muted rounded w-1/2" />
          <div className="h-6 bg-muted rounded w-20 mt-2" />
        </div>
      </div>
    </div>
  )
}

export function OrderCardSkeleton({ className }: LoadingSkeletonProps) {
  return (
    <div className={cn("rounded-lg bg-card border border-border p-4 space-y-4 animate-pulse", className)}>
      <div className="flex justify-between items-center">
        <div className="h-6 bg-muted rounded w-24" />
        <div className="h-6 bg-muted rounded w-20" />
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-muted rounded w-full" />
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-4 bg-muted rounded w-1/2" />
      </div>
      <div className="flex gap-2 mt-4">
        <div className="h-10 bg-muted rounded flex-1" />
        <div className="h-10 bg-muted rounded flex-1" />
      </div>
    </div>
  )
}

export function DashboardCardSkeleton({ className }: LoadingSkeletonProps) {
  return (
    <div className={cn("rounded-lg bg-card border border-border p-6 animate-pulse", className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 bg-muted rounded w-24" />
        <div className="h-8 w-8 bg-muted rounded" />
      </div>
      <div className="h-8 bg-muted rounded w-32 mb-2" />
      <div className="h-3 bg-muted rounded w-20" />
    </div>
  )
}
