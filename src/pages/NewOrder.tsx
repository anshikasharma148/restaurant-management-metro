import { useState, useCallback, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MenuItem } from "@/components/orders/MenuItem"
import { OrderSummary } from "@/components/orders/OrderSummary"
import { mockCategories, mockMenuItems, mockTables } from "@/lib/mockData"
import { Search, UtensilsCrossed, ShoppingBag, Users, X } from "lucide-react"
import type { MenuItem as MenuItemType, OrderType, CartItem, Table } from "@/lib/types"

export default function NewOrderPage() {
  const navigate = useNavigate()
  const [orderType, setOrderType] = useState<OrderType>("dine-in")
  const [selectedTable, setSelectedTable] = useState<Table | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>(mockCategories[0].id)
  const [searchQuery, setSearchQuery] = useState("")
  const [cart, setCart] = useState<CartItem[]>([])
  const [showTableSelector, setShowTableSelector] = useState(false)
  const [showCart, setShowCart] = useState(false)

  const filteredItems = useMemo(() => {
    let items = mockMenuItems.filter((item) => item.available)

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query)
      )
    } else {
      items = items.filter((item) => item.category === selectedCategory)
    }

    return items
  }, [selectedCategory, searchQuery])

  const handleAddItem = useCallback((item: MenuItemType, quantity: number, variant?: string) => {
    const variantPrice = item.variants?.find((v) => v.name === variant)?.priceModifier || 0
    const price = item.price + variantPrice

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (cartItem) => cartItem.menuItemId === item.id && cartItem.variant === variant
      )

      if (existingIndex >= 0) {
        const updated = [...prev]
        updated[existingIndex].quantity += quantity
        return updated
      }

      return [
        ...prev,
        {
          menuItemId: item.id,
          name: item.name,
          quantity,
          price,
          variant,
        },
      ]
    })

    toast.success(`Added ${quantity}x ${item.name}${variant ? ` (${variant})` : ""}`)
  }, [])

  const handleUpdateQuantity = useCallback((index: number, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((_, i) => i !== index))
    } else {
      setCart((prev) => {
        const updated = [...prev]
        updated[index].quantity = quantity
        return updated
      })
    }
  }, [])

  const handleRemoveItem = useCallback((index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const handleSubmit = useCallback(() => {
    if (orderType === "dine-in" && !selectedTable) {
      toast.error("Please select a table for dine-in orders")
      setShowTableSelector(true)
      return
    }

    if (cart.length === 0) {
      toast.error("Please add items to the order")
      return
    }

    toast.success("Order placed successfully!")
    navigate("/kitchen")
  }, [orderType, selectedTable, cart, navigate])

  return (
    <div className="h-[calc(100vh-3.5rem)] lg:h-screen flex flex-col lg:flex-row">
      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Header */}
        <div className="p-4 border-b border-border space-y-3">
          {/* Order type selector */}
          <div className="flex gap-2">
            <Button
              variant={orderType === "dine-in" ? "default" : "outline"}
              size="lg"
              onClick={() => {
                setOrderType("dine-in")
                setShowTableSelector(true)
              }}
              className="flex-1 h-12"
            >
              <UtensilsCrossed className="w-5 h-5 mr-2" />
              Dine-in
            </Button>
            <Button
              variant={orderType === "takeaway" ? "default" : "outline"}
              size="lg"
              onClick={() => {
                setOrderType("takeaway")
                setSelectedTable(null)
                setShowTableSelector(false)
              }}
              className="flex-1 h-12"
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              Takeaway
            </Button>
          </div>

          {/* Table selector */}
          {orderType === "dine-in" && showTableSelector && (
            <div className="p-3 bg-muted/50 rounded-lg border border-border animate-fade-in">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Select Table
                </h3>
                {selectedTable && (
                  <Button variant="ghost" size="sm" onClick={() => setShowTableSelector(false)}>
                    Done
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-5 sm:grid-cols-8 lg:grid-cols-5 gap-2">
                {mockTables.map((table) => (
                  <button
                    key={table.id}
                    onClick={() => {
                      if (table.status === "available") {
                        setSelectedTable(table)
                        setShowTableSelector(false)
                      }
                    }}
                    disabled={table.status !== "available"}
                    className={cn(
                      "p-2 rounded-lg border text-center transition-colors",
                      table.status !== "available" && "opacity-40 cursor-not-allowed",
                      selectedTable?.id === table.id
                        ? "border-primary bg-primary/10 text-primary"
                        : table.status === "available"
                        ? "border-border bg-card hover:border-primary/50"
                        : "border-border bg-muted/50"
                    )}
                  >
                    <span className="text-sm font-bold">{table.number}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Selected table indicator */}
          {orderType === "dine-in" && selectedTable && !showTableSelector && (
            <button
              onClick={() => setShowTableSelector(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium"
            >
              <Users className="w-4 h-4" />
              Table {selectedTable.number}
            </button>
          )}

          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11"
            />
          </div>

          {/* Category tabs */}
          {!searchQuery && (
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4">
              {mockCategories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="shrink-0"
                >
                  <span className="mr-1.5">{category.emoji}</span>
                  {category.name}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Menu grid */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredItems.map((item) => (
              <MenuItem key={item.id} item={item} onAdd={handleAddItem} />
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-base">No items found</p>
              <p className="text-sm">Try a different search or category</p>
            </div>
          )}
        </div>

        {/* Mobile cart button */}
        {cart.length > 0 && (
          <div className="lg:hidden p-4 border-t border-border bg-card">
            <Button 
              size="lg" 
              className="w-full h-12"
              onClick={() => setShowCart(true)}
            >
              View Cart ({cart.length} items)
            </Button>
          </div>
        )}
      </div>

      {/* Desktop Order summary sidebar */}
      <div className="hidden lg:block w-96 border-l border-border bg-card">
        <OrderSummary
          items={cart}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onSubmit={handleSubmit}
        />
      </div>

      {/* Mobile Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setShowCart(false)}
          />
          <div className="absolute inset-x-0 bottom-0 bg-card border-t border-border rounded-t-2xl max-h-[85vh] flex flex-col animate-slide-up">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="font-semibold">Your Order</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowCart(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <OrderSummary
                items={cart}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
                onSubmit={() => {
                  setShowCart(false)
                  handleSubmit()
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}