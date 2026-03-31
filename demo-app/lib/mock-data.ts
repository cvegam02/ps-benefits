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
  // Calzado
  {
    id: 1, name: "Kit Tenis Slip On", price: 619, category: "Calzado", brand: "SHOSH",
    sku: "1204452",
    image: "https://res.cloudinary.com/priceshoes/w_1120,q_auto:eco,fl_progressive,f_auto,e_trim,dpr_auto,w_256/product/1/2/1204452-1.jpg",
    description: "Kit completo que incluye tenis slip on de diseño moderno con cierre elástico sin agujetas. Perfecto para el uso diario, combinan estilo y comodidad en un solo par. Incluye plantilla removible y suela antiderrapante.",
    features: ["Sin agujetas, fácil de poner y quitar", "Suela antiderrapante de hule", "Plantilla acolchada removible", "Material transpirable", "Kit incluye 2 pares"],
  },
  {
    id: 2, name: "Kit Tenis Slip On Sport", price: 739, category: "Calzado", brand: "SHOSH SPORT",
    sku: "1090089",
    image: "https://res.cloudinary.com/priceshoes/w_1120,q_auto:eco,fl_progressive,f_auto,e_trim,dpr_auto,w_256/product/1/0/1090089-1.jpg",
    description: "Kit de tenis slip on Sport con materiales de mayor calidad y mejor rendimiento. Diseño urbano que va con cualquier outfit. Ideal para personas activas que buscan comodidad sin sacrificar estilo.",
    features: ["Diseño urbano versátil", "Suela con mayor amortiguación", "Interior suave tipo tela", "Ligero y flexible", "Kit incluye 2 pares"],
  },
  {
    id: 3, name: "Tenis Casual Adidas", price: 1149, category: "Calzado", brand: "ADIDAS",
    sku: "1262107",
    image: "https://res.cloudinary.com/priceshoes/w_1120,q_auto:eco,fl_progressive,f_auto,e_trim,dpr_auto,w_256/product/1/2/1262107-0.jpg",
    description: "Tenis casual Adidas con diseño urbano en la línea junior. Con suela de cupsole que añade tracción y una silueta icónica que destaca en cualquier ambiente. Materiales sintéticos de alta durabilidad.",
    features: ["Diseño Adidas clásico renovado", "Suela cupsole de alta tracción", "Material sintético resistente", "Interior acolchado suave", "Disponible en tallas junior"],
  },
  {
    id: 4, name: "Tenis Casual Reebok", price: 999, category: "Calzado", brand: "REEBOK",
    sku: "1135759",
    image: "https://res.cloudinary.com/priceshoes/w_1120,q_auto:eco,fl_progressive,f_auto,e_trim,dpr_auto,w_256/product/1/1/1135759-0.jpg",
    description: "Tenis Reebok de la línea clásica, diseñados para mujer con un corte ligero y elegante. Perfectos para el día a día, van desde el gym hasta el fin de semana con igual comodidad.",
    features: ["Diseño Reebok clásico", "Suela ligera de EVA", "Material sintético premium", "Plantilla anatómica", "Corte bajo para mayor movilidad"],
  },
  {
    id: 5, name: "Bota Caterpillar", price: 3699, category: "Calzado", brand: "CATERPILLAR",
    sku: "180626",
    image: "https://res.cloudinary.com/priceshoes/w_1120,q_auto:eco,fl_progressive,f_auto,e_trim,dpr_auto,w_256/product/1/8/180626-1.jpg",
    description: "Bota Caterpillar de piel genuina con diseño robusto para uso rudo y senderismo. Con caña media que brinda soporte al tobillo y suela de hule gruesa resistente a todo terreno.",
    features: ["Piel genuina de alta durabilidad", "Suela todo terreno antiderrapante", "Caña media con soporte de tobillo", "Resistente a la intemperie", "Casquillo protector en la punta"],
  },
  // Ropa
  {
    id: 6, name: "Jogger Cintura Alta", price: 619, category: "Ropa", brand: "SANTA LOLA",
    sku: "1225287",
    image: "https://res.cloudinary.com/priceshoes/w_1120,q_auto:eco,fl_progressive,f_auto,e_trim,dpr_auto,w_256/product/1/2/1225287-1.jpg",
    description: "Pantalón jogger de cintura alta Santa Lola en tela cargo de calidad. Diseño athleisure perfecto para el día a día. La cintura alta estiliza la figura y brinda mayor comodidad.",
    features: ["Cintura alta con elástico ancho", "Estilo cargo con bolsillos laterales", "Tobillo ajustado con resorte", "Corte slim que estiliza la figura", "Tela suave y duradera"],
  },
  {
    id: 7, name: "Jeans Campana", price: 649, category: "Ropa", brand: "SEVEN JEANS",
    sku: "1247577",
    image: "https://res.cloudinary.com/priceshoes/w_1120,q_auto:eco,fl_progressive,f_auto,e_trim,dpr_auto,w_256/product/1/2/1247577-1.jpg",
    description: "Jeans acampanados Seven Jeans que regresan con fuerza al mundo de la moda. Cintura alta que realza la silueta y bota amplia que crea un look retro-moderno.",
    features: ["Corte campana clásico renovado", "Cintura alta con cierre de botón", "Tela denim de alta resistencia", "5 bolsillos funcionales", "Lavado especial vintage"],
  },
  {
    id: 8, name: "Chamarra NFL", price: 1449, category: "Ropa", brand: "NFL",
    sku: "1218710",
    image: "https://res.cloudinary.com/priceshoes/w_1120,q_auto:eco,fl_progressive,f_auto,e_trim,dpr_auto,w_256/product/1/2/1218710-1.jpg",
    description: "Chamarra oficial con licencia NFL. Diseño Kansas sin capucha con estampado del equipo. Ideal para los fanáticos del fútbol americano que quieren lucir su equipo favorito con estilo.",
    features: ["Licencia oficial NFL", "Estampado Kansas en pecho y espalda", "Interior de felpa suave", "Cierre de metal resistente", "Talla desde XCH hasta XXG"],
  },
  {
    id: 9, name: "Camisa Manga Larga Niño", price: 379, category: "Ropa", brand: "HPC POLO",
    sku: "1093845",
    image: "https://res.cloudinary.com/priceshoes/w_1120,q_auto:eco,fl_progressive,f_auto,e_trim,dpr_auto,w_256/product/1/0/1093845-1.jpg",
    description: "Camisa de manga larga HPC Polo para niño, de corte recto sastre. Versátil y cómoda, perfecta para ocasiones formales o casual. Diseño liso y elegante para el pequeño de la familia.",
    features: ["Tela de calidad premium", "Corte recto sastre", "Botones resistentes", "Diseño liso elegante", "Tallas desde 3/4 hasta 13/14 años"],
  },
  // Accesorios
  {
    id: 10, name: "Bolsa Crossbody Bob Esponja", price: 779, category: "Accesorios", brand: "BOB ESPONJA",
    sku: "1257960",
    image: "https://res.cloudinary.com/priceshoes/w_1120,q_auto:eco,fl_progressive,f_auto,e_trim,dpr_auto,w_256/product/1/2/1257960-1.jpg",
    description: "Bolsa crossbody con diseño oficial de Bob Esponja. Diseño amplio tipo bandolera inspirado en la Cangreburguesa, ideal para fans de todas las edades.",
    features: ["Diseño oficial Bob Esponja", "Correa ajustable y removible", "Cierre principal con zipper", "Bolsillo frontal adicional", "Estilo bandolera amplia"],
  },
  {
    id: 11, name: "Minimochila Bluey", price: 579, category: "Accesorios", brand: "BLUEY",
    sku: "1222260",
    image: "https://res.cloudinary.com/priceshoes/w_1120,q_auto:eco,fl_progressive,f_auto,e_trim,dpr_auto,w_256/product/1/2/1222260-1.jpg",
    description: "Minimochila transparente con el personaje oficial de Bluey. Diseño pequeño y compacto, ideal para niñas que quieren llevar a su personaje favorito a todos lados.",
    features: ["Diseño oficial Bluey", "Compartimento principal con zipper", "Detalle transparente", "Correas ajustables", "Tamaño pequeño ideal para niñas"],
  },
  {
    id: 12, name: "Bolsa Crossbody Rey León", price: 679, category: "Accesorios", brand: "EL REY LEON",
    sku: "1222291",
    image: "https://res.cloudinary.com/priceshoes/w_1120,q_auto:eco,fl_progressive,f_auto,e_trim,dpr_auto,w_256/product/1/2/1222291-1.jpg",
    description: "Bolsa crossbody con diseño oficial de El Rey León. Acompaña a Simba y Nala a donde vayas. Diseño pequeño con correa larga de hombro.",
    features: ["Diseño oficial Disney El Rey León", "Correa larga cruzada ajustable", "Zipper principal de calidad", "Personajes Simba y Nala", "Bolsa pequeña y práctica"],
  },
  {
    id: 13, name: "Bolsa Crossbody Gary", price: 669, category: "Accesorios", brand: "BOB ESPONJA",
    sku: "1222298",
    image: "https://res.cloudinary.com/priceshoes/w_1120,q_auto:eco,fl_progressive,f_auto,e_trim,dpr_auto,w_256/product/1/2/1222298-1.jpg",
    description: "Bolsa crossbody con el caracol Gary de Bob Esponja. Un accesorio divertido con correa de hombro, diseño pequeño y original para los fans de Nickelodeon.",
    features: ["Diseño oficial Bob Esponja / Gary", "Correa ajustable de hombro", "Cierre con zipper", "Bolsa pequeña y ligera", "Diseño divertido y colorido"],
  },
  {
    id: 14, name: "Minimochila Stitch", price: 849, category: "Accesorios", brand: "STITCH",
    sku: "1222278",
    image: "https://res.cloudinary.com/priceshoes/w_1120,q_auto:eco,fl_progressive,f_auto,e_trim,dpr_auto,w_256/product/1/2/1222278-1.jpg",
    description: "Minimochila con el adorable Stitch de Disney. Diseño azul pequeño con correas ajustables. Perfecta para fans que quieren un accesorio único y lindo.",
    features: ["Licencia oficial Disney Stitch", "Compartimento principal con zipper", "Bolsillo frontal independiente", "Correas ergonómicas ajustables", "Diseño pequeño y compacto"],
  },
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
      { product: products[0], quantity: 1 }, // Kit Tenis Slip On
      { product: products[4], quantity: 1 }, // Bota Elite
    ],
    subtotal: 619 + 3699,
    discount: 30,
    total: Math.round(619 * 0.7) + Math.round(3699 * 0.7),
    status: "pendiente",
    paymentMethod: "tarjeta",
    createdAt: new Date(now - 18 * 60 * 1000).toISOString(),
  },
  {
    id: "ORD-002",
    userId: 2,
    userName: "Ana López",
    tenantId: "grupo_santa",
    tenantName: "Grupo Santa",
    items: [
      { product: products[6], quantity: 1 }, // Jeans Campana
      { product: products[9], quantity: 1 }, // Bolsa Crossbody Bob Esponja
    ],
    subtotal: 599 + 499,
    discount: 25,
    total: Math.round(599 * 0.75) + Math.round(499 * 0.75),
    status: "listo",
    paymentMethod: "oxxo",
    createdAt: new Date(now - 42 * 60 * 1000).toISOString(),
  },
  {
    id: "ORD-003",
    userId: 3,
    userName: "Luis Mora",
    tenantId: "sindicato_energia",
    tenantName: "Sindicato Energía",
    items: [
      { product: products[2], quantity: 2 }, // Tenis Casual Streettalk × 2
      { product: products[7], quantity: 1 }, // Chamarra NFL
    ],
    subtotal: 649 * 2 + 1499,
    discount: 30,
    total: Math.round(649 * 0.7) * 2 + Math.round(1499 * 0.7),
    status: "entregado",
    paymentMethod: "spei",
    createdAt: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "ORD-004",
    userId: 4,
    userName: "Sofía Ramírez",
    tenantId: "demo_corp",
    tenantName: "Demo Corp",
    items: [
      { product: products[10], quantity: 1 }, // Minimochila Bluey
      { product: products[13], quantity: 1 }, // Minimochila Stitch
    ],
    subtotal: 399 + 399,
    discount: 20,
    total: Math.round(399 * 0.8) + Math.round(399 * 0.8),
    status: "pendiente",
    paymentMethod: "mercadopago",
    createdAt: new Date(now - 7 * 60 * 1000).toISOString(),
  },
  {
    id: "ORD-005",
    userId: 5,
    userName: "Marco Fuentes",
    tenantId: "tech_alianza",
    tenantName: "Tech Alianza",
    items: [
      { product: products[3], quantity: 1 }, // Tenis Casual Princess
      { product: products[5], quantity: 1 }, // Jogger Cintura Alta
    ],
    subtotal: 599 + 449,
    discount: 15,
    total: Math.round(599 * 0.85) + Math.round(449 * 0.85),
    status: "listo",
    paymentMethod: "meses",
    createdAt: new Date(now - 55 * 60 * 1000).toISOString(),
  },
  // Extra orders for Carlos Vega (userId: 1) — visible in his profile
  {
    id: "ORD-006",
    userId: 1,
    userName: "Carlos Vega",
    tenantId: "sindicato_energia",
    tenantName: "Sindicato Energía",
    items: [
      { product: products[1], quantity: 1 }, // Kit Tenis Slip On Pro
      { product: products[11], quantity: 1 }, // Bolsa Crossbody Rey León
    ],
    subtotal: 799 + 499,
    discount: 30,
    total: Math.round(799 * 0.7) + Math.round(499 * 0.7),
    status: "entregado",
    paymentMethod: "tarjeta",
    createdAt: new Date(now - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "ORD-007",
    userId: 1,
    userName: "Carlos Vega",
    tenantId: "sindicato_energia",
    tenantName: "Sindicato Energía",
    items: [
      { product: products[8], quantity: 1 }, // Camisa Manga Larga
      { product: products[12], quantity: 1 }, // Bolsa Crossbody Gary
    ],
    subtotal: 349 + 499,
    discount: 30,
    total: Math.round(349 * 0.7) + Math.round(499 * 0.7),
    status: "entregado",
    paymentMethod: "spei",
    createdAt: new Date(now - 10 * 24 * 60 * 60 * 1000).toISOString(),
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
