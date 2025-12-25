import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
  delay?: number
}

export function StatCard({ title, value, subtitle, icon: Icon, trend, className, delay = 0 }: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl bg-card border border-border p-6 transition-all duration-300 hover-lift interactive-card animate-slide-up opacity-0 [animation-fill-mode:forwards]",
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center transition-transform duration-300 hover:scale-110">
          <Icon className="w-6 h-6 text-primary" />
        </div>
      </div>

      <div className="space-y-1">
        <p className="text-3xl font-bold text-foreground">{value}</p>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
        {trend && (
          <p
            className={cn(
              "text-sm font-medium flex items-center gap-1",
              trend.isPositive ? "text-status-ready" : "text-destructive"
            )}
          >
            <span className={cn(
              "inline-flex items-center justify-center w-5 h-5 rounded-full text-xs",
              trend.isPositive ? "bg-status-ready/20" : "bg-destructive/20"
            )}>
              {trend.isPositive ? "↑" : "↓"}
            </span>
            {Math.abs(trend.value)}% vs last period
          </p>
        )}
      </div>
    </div>
  )
}
