import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { menuAPI } from "@/lib/api"
import { toast } from "sonner"
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Utensils,
} from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface MenuItem {
  _id?: string
  id?: string
  name: string
  description?: string
  price: number
  category: string | { _id: string; name: string }
  emoji?: string
  variants?: Array<{ name: string; priceModifier: number }>
  available: boolean
}

interface MenuCategory {
  _id?: string
  id?: string
  name: string
  emoji?: string
}

export function MenuManagement() {
  const [items, setItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<MenuCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"items" | "categories">("items")
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null)
  const [showItemForm, setShowItemForm] = useState(false)
  const [showCategoryForm, setShowCategoryForm] = useState(false)

  // Form states for items
  const [itemForm, setItemForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    emoji: "",
    available: true,
    variants: [] as Array<{ name: string; priceModifier: number }>,
  })

  // Form states for categories
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    emoji: "",
  })

  const fetchData = async () => {
    try {
      setLoading(true)
      const [itemsData, categoriesData] = await Promise.all([
        menuAPI.getItems(),
        menuAPI.getCategories(),
      ])
      setItems(itemsData)
      setCategories(categoriesData)
    } catch (error: any) {
      toast.error(error.message || "Failed to load menu data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleCreateItem = async () => {
    if (!itemForm.name || !itemForm.price || !itemForm.category) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      await menuAPI.createItem({
        name: itemForm.name,
        description: itemForm.description,
        price: parseFloat(itemForm.price),
        category: itemForm.category,
        emoji: itemForm.emoji,
        available: itemForm.available,
        variants: itemForm.variants,
      })
      toast.success("Menu item created successfully")
      setShowItemForm(false)
      resetItemForm()
      fetchData()
    } catch (error: any) {
      toast.error(error.message || "Failed to create menu item")
    }
  }

  const handleUpdateItem = async () => {
    if (!editingItem || !itemForm.name || !itemForm.price || !itemForm.category) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      const itemId = (editingItem as any)._id || editingItem.id
      await menuAPI.updateItem(itemId, {
        name: itemForm.name,
        description: itemForm.description,
        price: parseFloat(itemForm.price),
        category: itemForm.category,
        emoji: itemForm.emoji,
        available: itemForm.available,
        variants: itemForm.variants,
      })
      toast.success("Menu item updated successfully")
      setEditingItem(null)
      setShowItemForm(false)
      resetItemForm()
      fetchData()
    } catch (error: any) {
      toast.error(error.message || "Failed to update menu item")
    }
  }

  const handleDeleteItem = async (item: MenuItem) => {
    if (!confirm(`Are you sure you want to delete "${item.name}"?`)) {
      return
    }

    try {
      const itemId = (item as any)._id || item.id
      await menuAPI.deleteItem(itemId)
      toast.success("Menu item deleted successfully")
      fetchData()
    } catch (error: any) {
      toast.error(error.message || "Failed to delete menu item")
    }
  }

  const handleCreateCategory = async () => {
    if (!categoryForm.name) {
      toast.error("Please enter a category name")
      return
    }

    try {
      await menuAPI.createCategory({
        name: categoryForm.name,
        emoji: categoryForm.emoji,
      })
      toast.success("Category created successfully")
      setShowCategoryForm(false)
      resetCategoryForm()
      fetchData()
    } catch (error: any) {
      toast.error(error.message || "Failed to create category")
    }
  }

  const handleUpdateCategory = async () => {
    if (!editingCategory || !categoryForm.name) {
      toast.error("Please enter a category name")
      return
    }

    try {
      const categoryId = (editingCategory as any)._id || editingCategory.id
      await menuAPI.updateCategory(categoryId, {
        name: categoryForm.name,
        emoji: categoryForm.emoji,
      })
      toast.success("Category updated successfully")
      setEditingCategory(null)
      setShowCategoryForm(false)
      resetCategoryForm()
      fetchData()
    } catch (error: any) {
      toast.error(error.message || "Failed to update category")
    }
  }

  const handleDeleteCategory = async (category: MenuCategory) => {
    if (!confirm(`Are you sure you want to delete "${category.name}"? This will affect all items in this category.`)) {
      return
    }

    try {
      const categoryId = (category as any)._id || category.id
      await menuAPI.deleteCategory(categoryId)
      toast.success("Category deleted successfully")
      fetchData()
    } catch (error: any) {
      toast.error(error.message || "Failed to delete category")
    }
  }

  const resetItemForm = () => {
    setItemForm({
      name: "",
      description: "",
      price: "",
      category: "",
      emoji: "",
      available: true,
      variants: [],
    })
  }

  const resetCategoryForm = () => {
    setCategoryForm({
      name: "",
      emoji: "",
    })
  }

  const startEditItem = (item: MenuItem) => {
    const categoryId = typeof item.category === "object" ? item.category._id : item.category
    setEditingItem(item)
    setItemForm({
      name: item.name,
      description: item.description || "",
      price: String(item.price),
      category: categoryId,
      emoji: item.emoji || "",
      available: item.available,
      variants: item.variants || [],
    })
    setShowItemForm(true)
  }

  const startEditCategory = (category: MenuCategory) => {
    setEditingCategory(category)
    setCategoryForm({
      name: category.name,
      emoji: category.emoji || "",
    })
    setShowCategoryForm(true)
  }

  const addVariant = () => {
    setItemForm({
      ...itemForm,
      variants: [...itemForm.variants, { name: "", priceModifier: 0 }],
    })
  }

  const updateVariant = (index: number, field: "name" | "priceModifier", value: string | number) => {
    const updated = [...itemForm.variants]
    updated[index] = { ...updated[index], [field]: value }
    setItemForm({ ...itemForm, variants: updated })
  }

  const removeVariant = (index: number) => {
    setItemForm({
      ...itemForm,
      variants: itemForm.variants.filter((_, i) => i !== index),
    })
  }

  if (loading) {
    return <div className="text-center py-12">Loading menu data...</div>
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => {
            setActiveTab("items")
            setShowItemForm(false)
            setEditingItem(null)
            resetItemForm()
          }}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === "items"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Menu Items
        </button>
        <button
          onClick={() => {
            setActiveTab("categories")
            setShowCategoryForm(false)
            setEditingCategory(null)
            resetCategoryForm()
          }}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === "categories"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Categories
        </button>
      </div>

      {/* Menu Items Tab */}
      {activeTab === "items" && (
        <div className="space-y-4">
          {!showItemForm ? (
            <Button onClick={() => setShowItemForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Menu Item
            </Button>
          ) : (
            <div className="bg-card border border-border rounded-xl p-4 lg:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">
                  {editingItem ? "Edit Menu Item" : "New Menu Item"}
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setShowItemForm(false)
                    setEditingItem(null)
                    resetItemForm()
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid gap-4">
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="item-name">Name *</Label>
                    <Input
                      id="item-name"
                      value={itemForm.name}
                      onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                      placeholder="e.g., Classic Burger"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="item-price">Price (₹) *</Label>
                    <Input
                      id="item-price"
                      type="number"
                      step="0.01"
                      value={itemForm.price}
                      onChange={(e) => setItemForm({ ...itemForm, price: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="item-description">Description</Label>
                  <Textarea
                    id="item-description"
                    value={itemForm.description}
                    onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                    placeholder="Item description..."
                    rows={3}
                  />
                </div>

                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="item-category">Category *</Label>
                    <select
                      id="item-category"
                      value={itemForm.category}
                      onChange={(e) => setItemForm({ ...itemForm, category: e.target.value })}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="">Select category</option>
                      {categories.map((cat) => (
                        <option key={(cat as any)._id || cat.id} value={(cat as any)._id || cat.id}>
                          {cat.emoji} {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="item-emoji">Emoji</Label>
                    <Input
                      id="item-emoji"
                      value={itemForm.emoji}
                      onChange={(e) => setItemForm({ ...itemForm, emoji: e.target.value })}
                      placeholder="🍔"
                      maxLength={2}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="item-available">Available</Label>
                    <p className="text-xs text-muted-foreground">Show this item in menu</p>
                  </div>
                  <Switch
                    id="item-available"
                    checked={itemForm.available}
                    onCheckedChange={(checked) => setItemForm({ ...itemForm, available: checked })}
                  />
                </div>

                {/* Variants */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Variants (e.g., Size, Type)</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addVariant}>
                      <Plus className="w-3 h-3 mr-1" />
                      Add Variant
                    </Button>
                  </div>
                  {itemForm.variants.map((variant, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder="Variant name (e.g., Large)"
                        value={variant.name}
                        onChange={(e) => updateVariant(index, "name", e.target.value)}
                      />
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Price modifier"
                        value={variant.priceModifier}
                        onChange={(e) => updateVariant(index, "priceModifier", parseFloat(e.target.value) || 0)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeVariant(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowItemForm(false)
                      setEditingItem(null)
                      resetItemForm()
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={editingItem ? handleUpdateItem : handleCreateItem}>
                    <Save className="w-4 h-4 mr-2" />
                    {editingItem ? "Update" : "Create"}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Items List */}
          <div className="space-y-2">
            {items.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No menu items yet. Add your first item!
              </div>
            ) : (
              items.map((item) => {
                const itemId = (item as any)._id || item.id
                const categoryName = typeof item.category === "object" ? item.category.name : categories.find(c => ((c as any)._id || c.id) === item.category)?.name || "Unknown"
                return (
                  <div
                    key={itemId}
                    className="bg-card border border-border rounded-lg p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="text-2xl">{item.emoji || <Utensils className="w-6 h-6" />}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{item.name}</p>
                          {!item.available && (
                            <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">
                              Unavailable
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {item.description || "No description"}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm font-medium">{formatCurrency(item.price)}</span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">{categoryName}</span>
                          {item.variants && item.variants.length > 0 && (
                            <>
                              <span className="text-xs text-muted-foreground">•</span>
                              <span className="text-xs text-muted-foreground">
                                {item.variants.length} variant{item.variants.length > 1 ? "s" : ""}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => startEditItem(item)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteItem(item)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      )}

      {/* Categories Tab */}
      {activeTab === "categories" && (
        <div className="space-y-4">
          {!showCategoryForm ? (
            <Button onClick={() => setShowCategoryForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          ) : (
            <div className="bg-card border border-border rounded-xl p-4 lg:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">
                  {editingCategory ? "Edit Category" : "New Category"}
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setShowCategoryForm(false)
                    setEditingCategory(null)
                    resetCategoryForm()
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid gap-4">
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="category-name">Name *</Label>
                    <Input
                      id="category-name"
                      value={categoryForm.name}
                      onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                      placeholder="e.g., Main Course"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category-emoji">Emoji</Label>
                    <Input
                      id="category-emoji"
                      value={categoryForm.emoji}
                      onChange={(e) => setCategoryForm({ ...categoryForm, emoji: e.target.value })}
                      placeholder="🍽️"
                      maxLength={2}
                    />
                  </div>
                </div>

                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowCategoryForm(false)
                      setEditingCategory(null)
                      resetCategoryForm()
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={editingCategory ? handleUpdateCategory : handleCreateCategory}>
                    <Save className="w-4 h-4 mr-2" />
                    {editingCategory ? "Update" : "Create"}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Categories List */}
          <div className="space-y-2">
            {categories.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No categories yet. Add your first category!
              </div>
            ) : (
              categories.map((category) => {
                const categoryId = (category as any)._id || category.id
                const itemCount = items.filter(
                  (item) => (typeof item.category === "object" ? item.category._id : item.category) === categoryId
                ).length
                return (
                  <div
                    key={categoryId}
                    className="bg-card border border-border rounded-lg p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{category.emoji || <Utensils className="w-6 h-6" />}</div>
                      <div>
                        <p className="font-medium">{category.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {itemCount} item{itemCount !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => startEditCategory(category)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteCategory(category)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}

