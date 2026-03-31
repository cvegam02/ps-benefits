import { Tenant, User, Product, Order } from "./types"

export const tenants: Tenant[] = [
  { id: "sindicato_energia", name: "Sindicato Energía", discount: 30 },
  { id: "demo_corp",         name: "Demo Corp",         discount: 20 },
  { id: "grupo_santa",       name: "Grupo Santa",       discount: 25 },
  { id: "tech_alianza",      name: "Tech Alianza",      discount: 15 },
]

export const users: User[] = [
  {
    id: 1,
    name: "Carlos Vega",
    email: "carlos@test.com",
    password: "123456",
    phone: "5512345678",
    employeeNumber: "EMP001",
    tenantId: "sindicato_energia",
  },
]

export const products: Product[] = [
  { id: 1, name: "Smartphone X Pro",    price: 18570, category: "Electrónica", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop" },
  { id: 2, name: 'Laptop Pro 15"',      price: 34999, category: "Computación", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop" },
  { id: 3, name: "Audífonos Premium",   price: 2999,  category: "Audio",       image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop" },
  { id: 4, name: "Smartwatch Ultra",    price: 7999,  category: "Wearables",   image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop" },
  { id: 5, name: 'Tablet Pro 11"',      price: 14999, category: "Electrónica", image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop" },
  { id: 6, name: "Bocina Bluetooth",    price: 1999,  category: "Audio",       image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop" },
  { id: 7, name: "Teclado Mecánico",    price: 3499,  category: "Computación", image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=400&fit=crop" },
  { id: 8, name: 'Monitor 27" 4K',      price: 12999, category: "Computación", image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop" },
]

// Pre-populated demo orders for the store panel
const now = Date.now()
export const mockOrders: Order[] = [
  {
    id: "ORD-001",
    userId: 1,
    userName: "Carlos Vega",
    tenantId: "sindicato_energia",
    tenantName: "Sindicato Energía",
    items: [
      { product: products[0], quantity: 1 }, // Smartphone X Pro
      { product: products[1], quantity: 1 }, // Laptop Pro 15"
    ],
    subtotal: 18570 + 34999,                  // 53569
    discount: 30,
    total: Math.round(18570 * 0.7) + Math.round(34999 * 0.7), // 12999 + 24499 = 37498
    status: "pendiente",
    paymentMethod: "tarjeta",
    createdAt: new Date(now - 18 * 60 * 1000).toISOString(), // 18 min ago
  },
  {
    id: "ORD-002",
    userId: 2,
    userName: "Ana López",
    tenantId: "grupo_santa",
    tenantName: "Grupo Santa",
    items: [
      { product: products[2], quantity: 1 }, // Audífonos Premium
      { product: products[3], quantity: 1 }, // Smartwatch Ultra
    ],
    subtotal: 2999 + 7999,                   // 10998
    discount: 25,
    total: Math.round(2999 * 0.75) + Math.round(7999 * 0.75), // 2249 + 5999 = 8248
    status: "listo",
    paymentMethod: "oxxo",
    createdAt: new Date(now - 42 * 60 * 1000).toISOString(), // 42 min ago
  },
  {
    id: "ORD-003",
    userId: 3,
    userName: "Luis Mora",
    tenantId: "sindicato_energia",
    tenantName: "Sindicato Energía",
    items: [
      { product: products[1], quantity: 2 }, // Laptop Pro 15" × 2
      { product: products[4], quantity: 1 }, // Tablet Pro 11"
    ],
    subtotal: 34999 * 2 + 14999,             // 84997
    discount: 30,
    total: Math.round(34999 * 0.7) * 2 + Math.round(14999 * 0.7), // 24499*2 + 10499 = 59497
    status: "entregado",
    paymentMethod: "spei",
    createdAt: new Date(now - 2 * 60 * 60 * 1000).toISOString(), // 2 hrs ago
  },
  {
    id: "ORD-004",
    userId: 4,
    userName: "Sofía Ramírez",
    tenantId: "demo_corp",
    tenantName: "Demo Corp",
    items: [
      { product: products[7], quantity: 1 }, // Monitor 27" 4K
      { product: products[6], quantity: 1 }, // Teclado Mecánico
    ],
    subtotal: 12999 + 3499,                  // 16498
    discount: 20,
    total: Math.round(12999 * 0.8) + Math.round(3499 * 0.8), // 10399 + 2799 = 13198
    status: "pendiente",
    paymentMethod: "mercadopago",
    createdAt: new Date(now - 7 * 60 * 1000).toISOString(), // 7 min ago
  },
  {
    id: "ORD-005",
    userId: 5,
    userName: "Marco Fuentes",
    tenantId: "tech_alianza",
    tenantName: "Tech Alianza",
    items: [
      { product: products[4], quantity: 1 }, // Tablet Pro 11"
    ],
    subtotal: 14999,
    discount: 15,
    total: Math.round(14999 * 0.85), // 12749
    status: "listo",
    paymentMethod: "meses",
    createdAt: new Date(now - 55 * 60 * 1000).toISOString(), // 55 min ago
  },
  // Extra orders for Carlos Vega (userId: 1) — visible in his profile
  {
    id: "ORD-006",
    userId: 1,
    userName: "Carlos Vega",
    tenantId: "sindicato_energia",
    tenantName: "Sindicato Energía",
    items: [
      { product: products[3], quantity: 1 }, // Smartwatch Ultra
      { product: products[5], quantity: 2 }, // Bocina Bluetooth × 2
    ],
    subtotal: 7999 + 1999 * 2,               // 11997
    discount: 30,
    total: Math.round(7999 * 0.7) + Math.round(1999 * 0.7) * 2, // 5599 + 2798 = 8397
    status: "entregado",
    paymentMethod: "tarjeta",
    createdAt: new Date(now - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
  },
  {
    id: "ORD-007",
    userId: 1,
    userName: "Carlos Vega",
    tenantId: "sindicato_energia",
    tenantName: "Sindicato Energía",
    items: [
      { product: products[6], quantity: 1 }, // Teclado Mecánico
      { product: products[7], quantity: 1 }, // Monitor 27" 4K
    ],
    subtotal: 3499 + 12999,                  // 16498
    discount: 30,
    total: Math.round(3499 * 0.7) + Math.round(12999 * 0.7), // 2449 + 9099 = 11548
    status: "entregado",
    paymentMethod: "spei",
    createdAt: new Date(now - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
  },
]

export function getDiscountedPrice(price: number, discount: number): number {
  return Math.round(price * (1 - discount / 100))
}

export function getTenant(tenantId: string): Tenant | undefined {
  return tenants.find((t) => t.id === tenantId)
}

export function formatMXN(amount: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(amount)
}

export function timeAgo(isoDate: string): string {
  const diff = Math.floor((Date.now() - new Date(isoDate).getTime()) / 1000)
  if (diff < 60) return `${diff}s`
  if (diff < 3600) return `${Math.floor(diff / 60)}min`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ${Math.floor((diff % 3600) / 60)}min`
  return `${Math.floor(diff / 86400)}d`
}

// Start counter after mock orders so new orders don't collide
let orderCounter = mockOrders.length + 1
export function generateOrderId(): string {
  return `ORD-${String(orderCounter++).padStart(3, "0")}`
}
