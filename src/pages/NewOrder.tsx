import { useState, useCallback, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MenuItem } from "@/components/orders/MenuItem"
import { OrderSummary } from "@/components/orders/OrderSummary"
import { mockCategories, mockMenuItems, mockTables } from "@/lib/mockData"
import { Search, UtensilsCrossed, ShoppingBag, Users } from "lucide-react"
import type { MenuItem as MenuItemType, OrderType, CartItem, Table } from "@/lib/types"

export default function NewOrderPage() {
  const navigate = useNavigate()
  const [orderType, setOrderType] = useState<OrderType>("dine-in")
  const [selectedTable, setSelectedTable] = useState<Table | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>(mockCategories[0].id)
  const [searchQuery, setSearchQuery] = useState("")
  const [cart, setCart] = useState<CartItem[]>([])
  const [showTableSelector, setShowTableSelector] = useState(false)

  // Filter menu items
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

  // Add item to cart
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

  // Update cart item quantity
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

  // Remove cart item
  const handleRemoveItem = useCallback((index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index))
  }, [])

  // Submit order
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

  // Available tables
  const availableTables = mockTables.filter((t) => t.status === "available")

  return (
    <div className="h-screen flex flex-col lg:flex-row">
      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Header */}
        <div className="p-4 lg:p-6 border-b border-border space-y-4">
          {/* Order type selector */}
          <div className="flex gap-2">
            <Button
              variant={orderType === "dine-in" ? "default" : "outline"}
              size="lg"
              onClick={() => {
                setOrderType("dine-in")
                setShowTableSelector(true)
              }}
              className="flex-1"
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
              className="flex-1"
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              Takeaway
            </Button>
          </div>

          {/* Table selector (for dine-in) */}
          {orderType === "dine-in" && showTableSelector && (
            <div className="p-4 bg-card rounded-lg border border-border animate-slide-up">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Select Table
                </h3>
                {selectedTable && (
                  <Button variant="ghost" size="sm" onClick={() => setShowTableSelector(false)}>
                    Done
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-5 gap-2">
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
                      "p-3 rounded-lg border text-center transition-all",
                      table.status !== "available" && "opacity-50 cursor-not-allowed",
                      selectedTable?.id === table.id
                        ? "border-primary bg-primary/10 text-primary"
                        : table.status === "available"
                        ? "border-border bg-muted hover:border-primary/50"
                        : "border-border bg-muted/50"
                    )}
                  >
                    <span className="text-lg font-bold">{table.number}</span>
                    <span className="text-xs text-muted-foreground block">
                      {table.capacity} seats
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Selected table indicator */}
          {orderType === "dine-in" && selectedTable && !showTableSelector && (
            <button
              onClick={() => setShowTableSelector(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary text-sm"
            >
              <Users className="w-4 h-4" />
              Table {selectedTable.number} ({selectedTable.capacity} seats)
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
              className="pl-10 h-12"
            />
          </div>

          {/* Category tabs */}
          {!searchQuery && (
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 lg:mx-0 lg:px-0">
              {mockCategories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  className="shrink-0"
                >
                  <span className="mr-2">{category.emoji}</span>
                  {category.name}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Menu grid */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredItems.map((item) => (
              <MenuItem key={item.id} item={item} onAdd={handleAddItem} />
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg">No items found</p>
              <p className="text-sm">Try a different search or category</p>
            </div>
          )}
        </div>
      </div>

      {/* Order summary sidebar */}
      <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-border bg-card">
        <OrderSummary
          items={cart}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  )
}
