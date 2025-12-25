import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"
import { Trash2, Plus, Minus } from "lucide-react"
import type { CartItem } from "@/lib/types"

interface OrderSummaryProps {
  items: CartItem[]
  onUpdateQuantity: (index: number, quantity: number) => void
  onRemoveItem: (index: number) => void
  onSubmit: () => void
  taxRate?: number
  discount?: number
  className?: string
}

export function OrderSummary({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onSubmit,
  taxRate = 0.1,
  discount = 0,
  className,
}: OrderSummaryProps) {
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const discountAmount = subtotal * (discount / 100)
  const taxableAmount = subtotal - discountAmount
  const tax = taxableAmount * taxRate
  const total = taxableAmount + tax

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-lg font-bold">Order Summary</h2>
        <span className="text-sm text-muted-foreground">{items.length} items</span>
      </div>

      {/* Items list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {items.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <p className="text-lg mb-2">No items yet</p>
            <p className="text-sm">Add items from the menu</p>
          </div>
        ) : (
          items.map((item, index) => (
            <div
              key={`${item.menuItemId}-${item.variant}-${index}`}
              className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 animate-slide-up"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{item.name}</p>
                {item.variant && (
                  <p className="text-sm text-muted-foreground">{item.variant}</p>
                )}
                <p className="text-sm text-primary font-semibold mt-1">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </p>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-8 text-center font-semibold">{item.quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive"
                onClick={() => onRemoveItem(index)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))
        )}
      </div>

      {/* Totals */}
      <div className="border-t border-border p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm text-status-ready">
            <span>Discount ({discount}%)</span>
            <span>-₹{discountAmount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Tax ({(taxRate * 100).toFixed(0)}%)</span>
          <span>₹{tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
          <span>Total</span>
          <span className="text-primary">₹{total.toFixed(2)}</span>
        </div>
      </div>

      {/* Submit button */}
      <div className="p-4 border-t border-border">
        <Button
          size="lg"
          className="w-full"
          onClick={onSubmit}
          disabled={items.length === 0}
        >
          Place Order
          <Kbd className="ml-2">F12</Kbd>
        </Button>
      </div>
    </div>
  )
}
