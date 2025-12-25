import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Plus, Minus } from "lucide-react"
import type { MenuItem as MenuItemType } from "@/lib/types"

interface MenuItemProps {
  item: MenuItemType
  onAdd: (item: MenuItemType, quantity: number, variant?: string) => void
  className?: string
}

export function MenuItem({ item, onAdd, className }: MenuItemProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState<string | undefined>(
    item.variants?.[0]?.name
  )

  const selectedVariantPrice = item.variants?.find((v) => v.name === selectedVariant)?.priceModifier || 0
  const totalPrice = (item.price + selectedVariantPrice) * quantity

  const handleAdd = () => {
    onAdd(item, quantity, selectedVariant)
    setQuantity(1)
  }

  return (
    <div
      className={cn(
        "rounded-lg bg-card border border-border p-4 transition-all hover:border-primary/50 animate-fade-in",
        className
      )}
    >
      <div className="flex gap-4">
        {/* Image placeholder */}
        <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center text-2xl shrink-0">
          {item.emoji || "🍽️"}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate">{item.name}</h3>
          {item.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{item.description}</p>
          )}
          
          {/* Variants */}
          {item.variants && item.variants.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {item.variants.map((variant) => (
                <button
                  key={variant.name}
                  onClick={() => setSelectedVariant(variant.name)}
                  className={cn(
                    "px-2 py-1 text-xs rounded-md border transition-colors",
                    selectedVariant === variant.name
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/50"
                  )}
                >
                  {variant.name}
                  {variant.priceModifier !== 0 && (
                    <span className="ml-1">
                      {variant.priceModifier > 0 ? "+" : ""}${variant.priceModifier.toFixed(2)}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Price and quantity */}
          <div className="flex items-center justify-between gap-2 mt-2">
            <span className="text-lg font-bold text-primary">${totalPrice.toFixed(2)}</span>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-muted rounded-lg">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-8 text-center font-semibold">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <Button size="sm" onClick={handleAdd}>
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
