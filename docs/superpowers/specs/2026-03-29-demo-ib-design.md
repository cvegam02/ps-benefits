# PRD — Demo Plataforma de Beneficios Corporativos
**Versión:** 1.0
**Fecha:** 2026-03-29
**Tipo:** Demo funcional para presentación a inversionistas

---

## 1. Visión y Problema

### Nombre de plataforma
`[Nombre de Plataforma]` — pendiente de definición. En pantallas se usa como placeholder hasta que el equipo defina el nombre y la marca.

### El problema
Las empresas y sindicatos ofrecen beneficios de descuento a sus empleados, pero hoy ese proceso es manual, opaco y difícil de escalar: cupones en papel, listas en Excel, coordinación por WhatsApp. No existe una plataforma que conecte digitalmente al empleado, el beneficio y el punto de venta en un solo flujo.

### La solución
Una plataforma SaaS **multi-tenant** que permite a cualquier sindicato u organización corporativa ofrecer un catálogo de productos con descuentos exclusivos para sus empleados, con compra digital y entrega en tienda verificada por QR.

### Audiencia del demo
Inversionistas en pitch formal. El demo dura 2–4 minutos y es navegado en vivo por el presentador desde laptop, con un celular físico como segundo dispositivo.

### Los tres momentos clave que el inversionista debe recordar
1. **Experiencia del empleado** — comprar con descuento desde el celular es trivialmente simple
2. **Conexión tienda-digital** — el QR cierra el loop físico/digital sin fricción
3. **Modelo multi-tenant** — una sola plataforma sirve a múltiples sindicatos y empresas

---

## 2. Alcance del Demo

### Lo que ES este demo
- Una aplicación funcional **sin backend real**
- Todo el estado vive en memoria (Context API + `useReducer`)
- Flujo lineal diseñado para presentación en vivo, sin bifurcaciones
- Visualmente terminado: mobile-first en la app del empleado, desktop en el panel de tienda
- La identidad visual base ya existe en `login.pen` y se extiende a todas las pantallas restantes

### Lo que NO ES
- No tiene backend, base de datos ni autenticación real
- No procesa pagos reales (flujo de pago es simulado con delay + animación)
- No envía notificaciones
- No tiene IA real (la recomendación de disponibilidad es UI estática)
- El panel `/store` no tiene login — acceso directo, decisión consciente para simplificar el demo

### Limitaciones conocidas y aceptadas
- **Recarga de página** — si el presentador recarga durante el demo, el estado se pierde. Mitigación: navegar únicamente con los botones de la app, nunca recargar.
- **Persistencia** — no se implementa `localStorage` ni sesión real. Fuera de scope para este demo.

### Setup de presentación
- **Celular** — abre `/login` vía URL pública generada por **ngrok** (túnel al servidor local)
- **Laptop** — proyecta `/store` en pantalla completa
- El presentador coordina ambos dispositivos durante la narrativa

---

## 3. Flujo del Demo — Narrativa de 10 Pasos

| # | Paso | Ruta | Dispositivo |
|---|------|------|-------------|
| 1 | Empleado se registra | `/register` | Celular |
| 2 | Empleado inicia sesión | `/login` | Celular |
| 3 | Ve catálogo con precios con descuento | `/app` → vista Catálogo | Celular |
| 4 | Agrega productos al carrito | `/app` → vista Carrito | Celular |
| 5 | Confirma orden y selecciona "Recoger en tienda" | `/app` → vista Checkout | Celular |
| 6 | Ve recomendación de disponibilidad | `/app` → vista Checkout | Celular |
| 7 | Selecciona método de pago y confirma | `/app` → vista Pago | Celular |
| 8 | Recibe código QR de su orden | `/app` → vista QR | Celular |
| 9 | Presentador cambia al panel de tienda; tienda escanea el QR del celular | `/store` | Laptop ← escanea → Celular |
| 10 | Pedido marcado como entregado | `/store` | Laptop |

> **Nota técnica — Paso 9:** La cámara que escanea el QR es la de la laptop, apuntando físicamente al celular. Requiere permisos de cámara en el browser. Probar antes del pitch.

> **Nota de narrativa — Paso 8→9:** El flujo funciona porque ambas rutas comparten el mismo `AppContext` en memoria. La orden creada en `/app` es inmediatamente visible en `/store` siempre que ambas estén abiertas en el mismo browser.

---

## 4. Arquitectura Técnica

### Stack

| Capa | Tecnología | Decisión |
|------|-----------|----------|
| Framework | Next.js 14 (App Router) | Rutas simples, sin API routes necesarias |
| UI | React + TailwindCSS | Consistente con identidad visual existente |
| Estado global | Context API + `useReducer` | Suficiente para demo sin backend |
| QR — generación | `qrcode.react` | Estable, sin dependencias problemáticas |
| QR — escaneo | `html5-qrcode` | Reemplaza `react-qr-reader` (deprecado e incompatible con App Router) |
| Tunneling demo | ngrok | Expone localhost al celular vía URL pública |

### Estructura de rutas

```
/login        → Inicio de sesión del empleado
/register     → Registro de nuevo empleado
/app          → Flujo completo del empleado (wizard de vistas internas)
/store        → Panel operativo de tienda
```

### Estado global — `AppContext`

```ts
type AppState = {
  currentUser: User | null       // sesión activa del empleado
  cart: CartItem[]               // productos en el carrito activo
  orders: Order[]                // todas las órdenes (compartidas con /store)
}

type AppAction =
  | { type: "LOGIN"; user: User }
  | { type: "LOGOUT" }
  | { type: "ADD_TO_CART"; product: Product }
  | { type: "REMOVE_FROM_CART"; productId: number }
  | { type: "CLEAR_CART" }
  | { type: "CREATE_ORDER"; order: Order }
  | { type: "UPDATE_ORDER_STATUS"; orderId: string; status: Order["status"] }
```

### Navegación en `/app`
Vista única con estado interno tipo wizard. No usa rutas para las sub-vistas del flujo del empleado — evita recargas accidentales y mantiene el estado del carrito y la orden.

```
/app
  ├── vista: "catalog"    → Catálogo de productos
  ├── vista: "cart"       → Carrito
  ├── vista: "checkout"   → Confirmación + pickup + recomendación
  ├── vista: "payment"    → Selección y simulación de pago
  └── vista: "qr"         → Código QR de la orden
```

---

## 5. Modelo de Datos Mock

```ts
type Tenant = {
  id: string
  name: string
  discount: number  // porcentaje de descuento
}

type User = {
  id: number
  name: string
  email: string
  password: string
  phone: string
  employeeNumber: string
  tenantId: string
}

type Product = {
  id: number
  name: string
  price: number     // precio original en MXN
  image?: string    // URL de imagen (pendiente — ver nota abajo)
  category?: string
}

type CartItem = {
  product: Product
  quantity: number
}

type Order = {
  id: string        // formato "ORD-001"
  userId: number
  userName: string
  tenantId: string
  tenantName: string
  items: CartItem[]
  subtotal: number  // sin descuento
  discount: number  // porcentaje aplicado
  total: number     // precio final con descuento
  status: "pendiente" | "listo" | "entregado"
  paymentMethod: string
  createdAt: string
}
```

### Precio final
```ts
finalPrice = price * (1 - tenant.discount / 100)
```

### Datos iniciales hardcodeados

**Tenants** (demuestra el modelo multi-tenant):
```ts
const tenants = [
  { id: "sindicato_energia", name: "Sindicato Energía", discount: 30 },
  { id: "demo_corp",         name: "Demo Corp",         discount: 20 },
]
```

**Usuario pre-cargado** (para agilizar demo si se quiere saltar el registro):
```ts
const users = [
  {
    id: 1,
    name: "Carlos Vega",
    email: "carlos@test.com",
    password: "123456",
    phone: "5512345678",
    employeeNumber: "EMP001",
    tenantId: "sindicato_energia",
  }
]
```

**Productos** — estructura definida; contenido (nombres, precios, imágenes) a proveer por el equipo antes del demo. El catálogo debe tener al menos 8–12 productos para que la pantalla se vea completa y realista.

> **Pendiente del equipo:** imágenes, nombres reales de productos y precios en MXN.

---

## 6. Pantallas

La identidad visual base (azul marino `#1E3A8A` → `#2563EB`, tipografía Inter, shield-check como logo) está definida en `login.pen` y se extiende a todas las pantallas.

### Pantallas existentes en `login.pen`
- ✅ Mobile Login
- ✅ Desktop Login
- ✅ Mobile Register
- ✅ Desktop Register

### Pantallas pendientes de implementar

| # | Vista | Ruta/Contexto | Device | Descripción |
|---|-------|--------------|--------|-------------|
| 1 | Catálogo | `/app` | Mobile | Grid o lista de productos. Muestra precio original tachado y precio con descuento destacado. Badge con % de descuento del tenant. Botón "Agregar al carrito". |
| 2 | Carrito | `/app` | Mobile | Lista de productos agregados con cantidad editable. Subtotal, descuento aplicado y total final. Botón "Continuar". |
| 3 | Checkout | `/app` | Mobile | Resumen de la orden. Selector de método de entrega (solo "Recoger en tienda" habilitado). Mensaje de recomendación de disponibilidad (estático). Botón "Ir a pagar". |
| 4 | Pago | `/app` | Mobile | Opciones de pago: Tarjeta crédito/débito, OXXO Pay, SPEI, Meses sin intereses, Mercado Pago. Al confirmar: animación "Procesando..." (~2s delay) → avanza a QR. |
| 5 | QR de orden | `/app` | Mobile | Código QR grande centrado (valor = `order.id`). Datos de la orden debajo: productos, total, tienda. Mensaje "Muestra este código en tienda". |
| 6 | Panel de tienda | `/store` | Desktop | Lista de todas las órdenes con columnas: cliente, tenant, productos, total, estado. Botón "Marcar como listo" para órdenes pendientes (enriquece la UI pero no es parte del guión principal del demo). Botón "Escanear QR" para iniciar lectura. |
| 7 | Detalle de pedido escaneado | `/store` | Desktop | Modal o panel lateral que aparece tras escanear. Muestra detalle completo de la orden. Botón "Entregado" que actualiza el estado y cierra el panel. |

### Mensaje de recomendación (estático)
> *"Laptop Pro y Smartphone X están disponibles hoy. Audífonos Premium disponible en 2 días hábiles."*

> **Pendiente:** Este mensaje usa nombres de productos placeholder. Debe actualizarse con productos reales del catálogo definitivo antes del pitch.

---

## 7. Opciones de Pago (Simuladas)

Todas las opciones son UI solamente — ningún dato se valida ni procesa.

| Método | Ícono sugerido | Comportamiento al confirmar |
|--------|---------------|----------------------------|
| Tarjeta crédito/débito | 💳 | Formulario con campos de número, nombre, fecha, CVV (sin validación real) → delay → QR |
| OXXO Pay | Logo OXXO | Muestra referencia de pago ficticia → delay → QR |
| SPEI / Transferencia | 🏦 | Muestra CLABE ficticia → delay → QR |
| Meses sin intereses | 📆 | Selector de 3, 6, 12 meses → delay → QR |
| Mercado Pago | Logo MP | Botón "Pagar con Mercado Pago" → delay → QR |

**Delay de simulación:** 2 segundos con spinner/animación "Procesando pago..." antes de generar la orden y mostrar el QR.

---

## 8. Estrategia de Presentación

### Duración objetivo
2–4 minutos

### Setup previo al pitch
- [ ] Servidor Next.js corriendo (`npm run dev`)
- [ ] ngrok activo y URL copiada al celular
- [ ] `/store` abierto en laptop, pantalla completa
- [ ] Celular en `/login`, brillo al máximo
- [ ] Bloqueo automático de pantalla desactivado en ambos dispositivos
- [ ] Permisos de cámara probados en el browser de la laptop

### Guión narrativo sugerido

> *"Imagina que eres empleado del Sindicato Energía. Entras a la app y ves tu catálogo con 30% de descuento exclusivo para ti..."*
→ navega catálogo en celular

> *"Agregas lo que quieres al carrito y el sistema calcula automáticamente tu precio final..."*
→ agrega productos, muestra carrito

> *"Eliges recoger en tienda y pagas con tu tarjeta o en OXXO — como prefieras."*
→ checkout y pago simulado

> *"Y recibes este código QR. Este es tu comprobante digital."*
→ muestra QR en celular

> *"Ahora, del lado de la tienda..."*
→ cambia a laptop

> *"El operador ve todos los pedidos en tiempo real. Escanea el QR del empleado..."*
→ escanea QR apuntando al celular

> *"Y el sistema cierra el loop: entregado. Todo trazado, sin papel, sin errores."*
→ marca como entregado

### Riesgos operativos y mitigaciones

| Riesgo | Mitigación |
|--------|-----------|
| ngrok cae durante demo | Tener red local como backup: `http://[IP-laptop]:3000` |
| Cámara no abre para escanear | Probar permisos de cámara antes del pitch; tener browser alternativo listo |
| Estado perdido por recarga accidental | Navegar solo con botones de la app; nunca usar F5 durante el demo |
| Celular se bloquea | Desactivar bloqueo automático antes del pitch |
| QR no se lee bien | Ajustar brillo del celular al máximo; probar distancia de escaneo |

---

## 9. Fuera de Scope

No implementar en este demo:

- Backend real o base de datos
- Autenticación real (JWT, OAuth)
- Notificaciones push o email
- IA o recomendaciones dinámicas
- Pagos reales
- Gestión de inventario
- Panel de administración de tenants
- Múltiples sucursales o puntos de entrega
- Historial de órdenes del empleado
- Modo oscuro

---

## 10. Pendientes del Equipo

| Item | Responsable | Notas |
|------|------------|-------|
| Nombre y marca de la plataforma | Equipo | Reemplaza `[Nombre de Plataforma]` en todas las pantallas |
| Catálogo de productos | Equipo | Mínimo 8–12 productos con nombre, precio MXN e imagen |
| Logos de métodos de pago | Equipo | OXXO, Mercado Pago (uso bajo fair use para demo) |
| Nombre real del retailer partner | Equipo | Actualmente "Price Shoes" como ejemplo |
