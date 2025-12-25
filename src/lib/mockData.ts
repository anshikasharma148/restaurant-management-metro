import type { MenuItem, MenuCategory, Order, Table } from "@/lib/types"

export const mockCategories: MenuCategory[] = [
  { id: "1", name: "Starters", emoji: "🥗" },
  { id: "2", name: "Main Course", emoji: "🍝" },
  { id: "3", name: "Burgers", emoji: "🍔" },
  { id: "4", name: "Pizza", emoji: "🍕" },
  { id: "5", name: "Desserts", emoji: "🍰" },
  { id: "6", name: "Beverages", emoji: "🥤" },
]

export const mockMenuItems: MenuItem[] = [
  // Starters
  { id: "s1", name: "Caesar Salad", description: "Fresh romaine, parmesan, croutons", price: 8.99, category: "1", emoji: "🥗", available: true },
  { id: "s2", name: "Garlic Bread", description: "Toasted with herb butter", price: 4.99, category: "1", emoji: "🍞", available: true },
  { id: "s3", name: "Soup of the Day", description: "Chef's special", price: 5.99, category: "1", emoji: "🍲", available: true },
  { id: "s4", name: "Bruschetta", description: "Tomato, basil, olive oil", price: 6.99, category: "1", emoji: "🍅", available: true },
  
  // Main Course
  { id: "m1", name: "Grilled Salmon", description: "With lemon butter sauce", price: 18.99, category: "2", emoji: "🐟", available: true },
  { id: "m2", name: "Chicken Parmesan", description: "Breaded chicken with marinara", price: 15.99, category: "2", emoji: "🍗", available: true },
  { id: "m3", name: "Pasta Carbonara", description: "Creamy bacon pasta", price: 13.99, category: "2", emoji: "🍝", available: true },
  { id: "m4", name: "Steak Frites", description: "8oz ribeye with fries", price: 24.99, category: "2", emoji: "🥩", variants: [{ name: "Rare", priceModifier: 0 }, { name: "Medium", priceModifier: 0 }, { name: "Well Done", priceModifier: 0 }], available: true },
  
  // Burgers
  { id: "b1", name: "Classic Burger", description: "Beef patty, lettuce, tomato", price: 11.99, category: "3", emoji: "🍔", variants: [{ name: "Single", priceModifier: 0 }, { name: "Double", priceModifier: 4 }], available: true },
  { id: "b2", name: "Cheese Burger", description: "With cheddar cheese", price: 12.99, category: "3", emoji: "🧀", variants: [{ name: "Single", priceModifier: 0 }, { name: "Double", priceModifier: 4 }], available: true },
  { id: "b3", name: "Veggie Burger", description: "Plant-based patty", price: 10.99, category: "3", emoji: "🌱", available: true },
  
  // Pizza
  { id: "p1", name: "Margherita", description: "Tomato, mozzarella, basil", price: 12.99, category: "4", emoji: "🍕", variants: [{ name: "Small", priceModifier: 0 }, { name: "Medium", priceModifier: 3 }, { name: "Large", priceModifier: 6 }], available: true },
  { id: "p2", name: "Pepperoni", description: "Classic pepperoni pizza", price: 14.99, category: "4", emoji: "🍕", variants: [{ name: "Small", priceModifier: 0 }, { name: "Medium", priceModifier: 3 }, { name: "Large", priceModifier: 6 }], available: true },
  { id: "p3", name: "BBQ Chicken", description: "BBQ sauce, chicken, onions", price: 15.99, category: "4", emoji: "🍕", variants: [{ name: "Small", priceModifier: 0 }, { name: "Medium", priceModifier: 3 }, { name: "Large", priceModifier: 6 }], available: true },
  
  // Desserts
  { id: "d1", name: "Chocolate Cake", description: "Rich chocolate layer cake", price: 6.99, category: "5", emoji: "🍫", available: true },
  { id: "d2", name: "Cheesecake", description: "New York style", price: 7.99, category: "5", emoji: "🍰", available: true },
  { id: "d3", name: "Ice Cream", description: "Three scoops", price: 4.99, category: "5", emoji: "🍨", variants: [{ name: "Vanilla", priceModifier: 0 }, { name: "Chocolate", priceModifier: 0 }, { name: "Strawberry", priceModifier: 0 }], available: true },
  
  // Beverages
  { id: "v1", name: "Soft Drink", description: "Coca-Cola, Sprite, Fanta", price: 2.99, category: "6", emoji: "🥤", available: true },
  { id: "v2", name: "Fresh Juice", description: "Orange or Apple", price: 3.99, category: "6", emoji: "🧃", variants: [{ name: "Orange", priceModifier: 0 }, { name: "Apple", priceModifier: 0 }], available: true },
  { id: "v3", name: "Coffee", description: "Freshly brewed", price: 2.49, category: "6", emoji: "☕", variants: [{ name: "Regular", priceModifier: 0 }, { name: "Large", priceModifier: 1 }], available: true },
  { id: "v4", name: "Beer", description: "Draft or bottled", price: 5.99, category: "6", emoji: "🍺", available: true },
]

export const mockTables: Table[] = [
  { id: "t1", number: 1, capacity: 2, status: "available" },
  { id: "t2", number: 2, capacity: 2, status: "occupied" },
  { id: "t3", number: 3, capacity: 4, status: "available" },
  { id: "t4", number: 4, capacity: 4, status: "reserved" },
  { id: "t5", number: 5, capacity: 4, status: "available" },
  { id: "t6", number: 6, capacity: 6, status: "occupied" },
  { id: "t7", number: 7, capacity: 6, status: "available" },
  { id: "t8", number: 8, capacity: 8, status: "available" },
  { id: "t9", number: 9, capacity: 8, status: "occupied" },
  { id: "t10", number: 10, capacity: 10, status: "available" },
]

export const mockOrders: Order[] = [
  {
    id: "o1",
    orderNumber: "001",
    type: "dine-in",
    status: "preparing",
    tableNumber: 2,
    items: [
      { menuItemId: "b1", name: "Classic Burger", quantity: 2, price: 11.99, variant: "Double" },
      { menuItemId: "v1", name: "Soft Drink", quantity: 2, price: 2.99 },
    ],
    subtotal: 35.96,
    tax: 3.60,
    discount: 0,
    total: 39.56,
    createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    createdBy: "3",
  },
  {
    id: "o2",
    orderNumber: "002",
    type: "takeaway",
    status: "pending",
    items: [
      { menuItemId: "p2", name: "Pepperoni Pizza", quantity: 1, price: 14.99, variant: "Large" },
      { menuItemId: "s1", name: "Caesar Salad", quantity: 1, price: 8.99 },
    ],
    subtotal: 29.98,
    tax: 3.00,
    discount: 0,
    total: 32.98,
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    createdBy: "3",
  },
  {
    id: "o3",
    orderNumber: "003",
    type: "dine-in",
    status: "pending",
    tableNumber: 6,
    items: [
      { menuItemId: "m4", name: "Steak Frites", quantity: 2, price: 24.99, variant: "Medium" },
      { menuItemId: "m1", name: "Grilled Salmon", quantity: 1, price: 18.99 },
      { menuItemId: "d2", name: "Cheesecake", quantity: 3, price: 7.99 },
    ],
    notes: "No onions on the steak",
    subtotal: 92.94,
    tax: 9.29,
    discount: 0,
    total: 102.23,
    createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    createdBy: "3",
  },
  {
    id: "o4",
    orderNumber: "004",
    type: "dine-in",
    status: "ready",
    tableNumber: 9,
    items: [
      { menuItemId: "m3", name: "Pasta Carbonara", quantity: 2, price: 13.99 },
      { menuItemId: "v4", name: "Beer", quantity: 2, price: 5.99 },
    ],
    subtotal: 39.96,
    tax: 4.00,
    discount: 0,
    total: 43.96,
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    createdBy: "3",
  },
]
