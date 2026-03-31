export type Tenant = {
  id: string
  name: string
  discount: number
}

export type User = {
  id: number
  name: string
  email: string
  password: string
  phone: string
  employeeNumber: string
  tenantId: string
}

export type Product = {
  id: number
  name: string
  price: number
  image?: string
  category?: string
}

export type CartItem = {
  product: Product
  quantity: number
}

export type OrderStatus = "pendiente" | "listo" | "entregado"

export type Order = {
  id: string
  userId: number
  userName: string
  tenantId: string
  tenantName: string
  items: CartItem[]
  subtotal: number
  discount: number
  total: number
  status: OrderStatus
  paymentMethod: string
  createdAt: string
}

export type AppView = "catalog" | "detail" | "cart" | "checkout" | "payment" | "processing" | "qr" | "stores" | "profile"
