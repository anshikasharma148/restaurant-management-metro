// User roles
export type UserRole = "admin" | "manager" | "cashier" | "kitchen"

// User
export interface User {
  id: string
  name: string
  email: string
  role: UserRole
}

// Menu
export interface MenuVariant {
  name: string
  priceModifier: number
}

export interface MenuItem {
  id: string
  name: string
  description?: string
  price: number
  category: string
  emoji?: string
  variants?: MenuVariant[]
  available: boolean
}

export interface MenuCategory {
  id: string
  name: string
  emoji?: string
}

// Orders
export type OrderType = "dine-in" | "takeaway"
export type OrderStatus = "pending" | "preparing" | "ready" | "completed"

export interface OrderItem {
  menuItemId: string
  name: string
  quantity: number
  price: number
  variant?: string
  notes?: string
}

export interface Order {
  id: string
  orderNumber: string
  type: OrderType
  status: OrderStatus
  items: OrderItem[]
  tableNumber?: number
  notes?: string
  subtotal: number
  tax: number
  discount: number
  total: number
  createdAt: string
  updatedAt: string
  createdBy: string
}

// Cart
export interface CartItem {
  menuItemId: string
  name: string
  quantity: number
  price: number
  variant?: string
}

// Tables
export interface Table {
  id: string
  number: number
  capacity: number
  status: "available" | "occupied" | "reserved"
}

// Billing
export type PaymentMethod = "cash" | "card" | "upi" | "split"

export interface Payment {
  id: string
  orderId: string
  method: PaymentMethod
  amount: number
  createdAt: string
}

// Reports
export interface SalesSummary {
  totalSales: number
  totalOrders: number
  averageOrderValue: number
  topItems: Array<{
    name: string
    quantity: number
    revenue: number
  }>
}
