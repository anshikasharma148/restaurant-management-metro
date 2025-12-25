import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Kbd } from "@/components/ui/kbd"
import { ordersAPI, paymentsAPI, settingsAPI } from "@/lib/api"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
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
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [readyOrders, setReadyOrders] = useState<any[]>([])
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>("cash")
  const [discount, setDiscount] = useState("")
  const [amountReceived, setAmountReceived] = useState("")
  const [taxRate, setTaxRate] = useState(10)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [orders, settings] = await Promise.all([
          ordersAPI.getOrders({ status: "ready" }),
          settingsAPI.getSettings(),
        ])
        setReadyOrders(orders)
        if (orders.length > 0 && !selectedOrder) {
          setSelectedOrder(orders[0])
        }
        setTaxRate(settings.taxRate || 10)
      } catch (error: any) {
        toast.error(error.message || "Failed to load data")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const discountPercent = parseFloat(discount) || 0
  const discountAmount = selectedOrder ? selectedOrder.subtotal * (discountPercent / 100) : 0
  const taxableAmount = selectedOrder ? selectedOrder.subtotal - discountAmount : 0
  const tax = taxableAmount * (taxRate / 100)
  const total = taxableAmount + tax

  const received = parseFloat(amountReceived) || 0
  const change = received - total

  const handleProcessPayment = async () => {
    if (!selectedOrder) {
      toast.error("Please select an order")
      return
    }

    try {
      await paymentsAPI.processPayment({
        orderId: selectedOrder._id || selectedOrder.id,
        method: selectedPayment,
        receivedAmount: selectedPayment === "cash" ? received : total,
      })
      toast.success("Payment processed successfully!")
      setAmountReceived("")
      setDiscount("")
      // Refresh orders
      const orders = await ordersAPI.getOrders({ status: "ready" })
      setReadyOrders(orders)
      if (orders.length > 0) {
        setSelectedOrder(orders[0])
      } else {
        setSelectedOrder(null)
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to process payment")
    }
  }

  return (
    <div className="min-h-screen p-4 lg:p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-xl lg:text-2xl font-bold text-foreground mb-4 lg:mb-6">Billing</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Order Selection */}
          <div className="space-y-3">
            <h2 className="font-semibold">Ready for Payment</h2>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">Loading...</p>
              </div>
            ) : readyOrders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground border border-dashed border-border rounded-lg">
                <p className="text-sm">No orders ready</p>
              </div>
            ) : (
              <div className="space-y-2">
                {readyOrders.map((order) => {
                  const orderId = order._id || order.id
                  return (
                    <button
                      key={orderId}
                      onClick={() => setSelectedOrder(order)}
                      className={cn(
                        "w-full p-3 rounded-lg border text-left transition-colors",
                        (selectedOrder?._id === orderId || selectedOrder?.id === orderId)
                          ? "border-primary bg-primary/10"
                          : "border-border bg-card hover:border-primary/50"
                      )}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-primary">#{order.orderNumber}</span>
                        <span className="font-semibold">${order.total.toFixed(2)}</span>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {order.type === "dine-in" ? `Table ${order.tableNumber}` : "Takeaway"} • {order.items.length} items
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Bill Preview */}
          <div className="bg-card border border-border rounded-xl p-4 lg:p-6">
            {selectedOrder ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold">Bill Preview</h2>
                  <span className="text-xl font-bold text-primary">#{selectedOrder?.orderNumber}</span>
                </div>

            {/* Items */}
            <div className="space-y-2 mb-4">
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

            <div className="border-t border-border my-3" />

            {/* Totals */}
            <div className="space-y-1.5 text-sm">
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
                <span className="text-muted-foreground">Tax ({taxRate}%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-border my-2" />
              <div className="flex justify-between text-base font-bold">
                <span>Total</span>
                <span className="text-primary">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Discount input */}
            <div className="mt-4">
              <Label htmlFor="discount" className="text-sm">Discount (%)</Label>
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
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">Select an order to view bill</p>
              </div>
            )}

          {/* Payment */}
          <div className="space-y-4">
            {/* Payment method */}
            <div>
              <h2 className="font-semibold mb-3">Payment Method</h2>
              <div className="grid grid-cols-2 gap-2">
                {paymentMethods.map((method) => (
                  <button
                    key={method.value}
                    onClick={() => setSelectedPayment(method.value)}
                    className={cn(
                      "flex flex-col items-center gap-2 p-3 rounded-lg border transition-colors",
                      selectedPayment === method.value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card hover:border-primary/50"
                    )}
                  >
                    <method.icon className="w-5 h-5" />
                    <span className="font-medium text-sm">{method.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Cash calculation */}
            {selectedPayment === "cash" && (
              <div className="space-y-3 p-3 bg-muted/50 rounded-lg">
                <div>
                  <Label htmlFor="received" className="text-sm">Amount Received</Label>
                  <Input
                    id="received"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={amountReceived}
                    onChange={(e) => setAmountReceived(e.target.value)}
                    className="mt-1"
                  />
                </div>
                {change >= 0 && received > 0 && (
                  <div className="flex justify-between items-center p-2 bg-status-ready/10 rounded-lg">
                    <span className="font-medium text-sm">Change</span>
                    <span className="text-lg font-bold text-status-ready">
                      ${change.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Action buttons */}
            <div className="space-y-2">
              <Button size="lg" className="w-full" disabled={!selectedOrder} onClick={handleProcessPayment}>
                <Check className="w-5 h-5 mr-2" />
                Confirm Payment
                <Kbd className="ml-2">F12</Kbd>
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  <Printer className="w-4 h-4 mr-2" />
                  Print
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