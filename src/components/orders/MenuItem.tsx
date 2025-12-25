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
        "rounded-xl bg-card border border-border p-5 transition-all duration-300 hover-lift interactive-card group",
        className
      )}
    >
      <div className="flex gap-4">
        {/* Emoji/Image placeholder */}
        <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-3xl shrink-0 transition-transform duration-300 group-hover:scale-105 border border-primary/10">
          {item.emoji || "🍽️"}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate text-lg">{item.name}</h3>
          {item.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{item.description}</p>
          )}
          
          {/* Variants */}
          {item.variants && item.variants.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {item.variants.map((variant) => (
                <button
                  key={variant.name}
                  onClick={() => setSelectedVariant(variant.name)}
                  className={cn(
                    "px-3 py-1.5 text-xs rounded-lg border transition-all duration-200",
                    selectedVariant === variant.name
                      ? "border-primary bg-primary/10 text-primary font-medium shadow-sm"
                      : "border-border text-muted-foreground hover:border-primary/50 hover:bg-muted"
                  )}
                >
                  {variant.name}
                  {variant.priceModifier !== 0 && (
                    <span className="ml-1 opacity-75">
                      {variant.priceModifier > 0 ? "+" : ""}${variant.priceModifier.toFixed(2)}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Price and quantity */}
          <div className="flex items-center justify-between gap-2 mt-3">
            <span className="text-xl font-bold text-primary">${totalPrice.toFixed(2)}</span>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-muted rounded-xl p-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-lg"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-8 text-center font-bold">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-lg"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <Button size="sm" onClick={handleAdd} className="hover:shadow-glow transition-all duration-300">
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
