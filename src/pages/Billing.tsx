import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Kbd } from "@/components/ui/kbd"
import { mockOrders } from "@/lib/mockData"
import {
  CreditCard,
  Banknote,
  Smartphone,
  Split,
  Printer,
  X,
  Check,
} from "lucide-react"
import type { PaymentMethod } from "@/lib/types"

const paymentMethods: { value: PaymentMethod; label: string; icon: typeof CreditCard }[] = [
  { value: "cash", label: "Cash", icon: Banknote },
  { value: "card", label: "Card", icon: CreditCard },
  { value: "upi", label: "UPI", icon: Smartphone },
  { value: "split", label: "Split", icon: Split },
]

export default function BillingPage() {
  const [selectedOrder, setSelectedOrder] = useState(mockOrders[3]) // Ready order
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>("cash")
  const [discount, setDiscount] = useState("")
  const [amountReceived, setAmountReceived] = useState("")

  // Recalculate totals with discount
  const discountPercent = parseFloat(discount) || 0
  const discountAmount = selectedOrder.subtotal * (discountPercent / 100)
  const taxableAmount = selectedOrder.subtotal - discountAmount
  const tax = taxableAmount * 0.1
  const total = taxableAmount + tax

  const received = parseFloat(amountReceived) || 0
  const change = received - total

  // Ready orders for billing
  const readyOrders = mockOrders.filter((o) => o.status === "ready")

  return (
    <div className="min-h-screen p-4 lg:p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-6">Billing</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Selection */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Ready for Payment</h2>
            {readyOrders.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-lg">
                <p>No orders ready for payment</p>
              </div>
            ) : (
              <div className="space-y-2">
                {readyOrders.map((order) => (
                  <button
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className={`w-full p-4 rounded-lg border text-left transition-all ${
                      selectedOrder?.id === order.id
                        ? "border-primary bg-primary/10"
                        : "border-border bg-card hover:border-primary/50"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-primary">#{order.orderNumber}</span>
                      <span className="font-semibold">${order.total.toFixed(2)}</span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {order.type === "dine-in" ? `Table ${order.tableNumber}` : "Takeaway"} •{" "}
                      {order.items.length} items
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Bill Preview */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Bill Preview</h2>
              <span className="text-2xl font-bold text-primary">#{selectedOrder?.orderNumber}</span>
            </div>

            {/* Items */}
            <div className="space-y-3 mb-6">
              {selectedOrder?.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <div>
                    <span className="font-medium">{item.name}</span>
                    {item.variant && (
                      <span className="text-muted-foreground ml-1">({item.variant})</span>
                    )}
                    <span className="text-muted-foreground ml-2">x{item.quantity}</span>
                  </div>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="border-t border-border my-4" />

            {/* Totals */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${selectedOrder?.subtotal.toFixed(2)}</span>
              </div>
              {discountPercent > 0 && (
                <div className="flex justify-between text-status-ready">
                  <span>Discount ({discountPercent}%)</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax (10%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-border my-2" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Discount input */}
            <div className="mt-6">
              <Label htmlFor="discount">Discount (%)</Label>
              <Input
                id="discount"
                type="number"
                min="0"
                max="100"
                placeholder="0"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          {/* Payment */}
          <div className="space-y-6">
            {/* Payment method */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
              <div className="grid grid-cols-2 gap-2">
                {paymentMethods.map((method) => (
                  <button
                    key={method.value}
                    onClick={() => setSelectedPayment(method.value)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-lg border transition-all ${
                      selectedPayment === method.value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card hover:border-primary/50"
                    }`}
                  >
                    <method.icon className="w-6 h-6" />
                    <span className="font-medium">{method.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Cash calculation */}
            {selectedPayment === "cash" && (
              <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <Label htmlFor="received">Amount Received</Label>
                  <Input
                    id="received"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={amountReceived}
                    onChange={(e) => setAmountReceived(e.target.value)}
                    className="mt-1 text-lg"
                  />
                </div>
                {change >= 0 && received > 0 && (
                  <div className="flex justify-between items-center p-3 bg-status-ready/10 rounded-lg">
                    <span className="font-medium">Change</span>
                    <span className="text-xl font-bold text-status-ready">
                      ${change.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Action buttons */}
            <div className="space-y-2">
              <Button size="lg" className="w-full" disabled={!selectedOrder}>
                <Check className="w-5 h-5 mr-2" />
                Confirm Payment
                <Kbd className="ml-2">F12</Kbd>
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  <Printer className="w-4 h-4 mr-2" />
                  Print Bill
                </Button>
                <Button variant="ghost" className="flex-1">
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
