# Navbar Auto-hide con Pill Indicator

**Fecha:** 2026-05-06  
**Estado:** Aprobado

## Contexto

El navbar inferior mobile ocupa ~80-90px de espacio vertical permanente en la vista de catálogo de productos. El usuario quiere recuperar ese espacio durante el scroll y modernizar el estilo visual para que se parezca a apps como Instagram o Apple Music.

## Decisiones de diseño

- **Estilo:** Pill indicator (Opción A) — solo íconos, el tab activo tiene una pastilla `bg-price-blue-900` detrás del ícono. Sin labels visibles.
- **Animación de ocultamiento:** Slide — el navbar se desliza físicamente hacia abajo y sale de pantalla al hacer scroll hacia abajo. Regresa al hacer scroll hacia arriba.

## Archivos a crear

### `demo-app/hooks/useScrollHide.ts`

Hook que detecta la dirección del scroll en un contenedor dado:

- Recibe una `ref` del elemento scrollable (`RefObject<HTMLElement>`)
- Retorna `hidden: boolean`
- `hidden = true` cuando el usuario scrollea hacia abajo más de 8px desde la última posición
- `hidden = false` cuando el usuario scrollea hacia arriba, o cuando `scrollTop === 0`
- Listener con `{ passive: true }` para no bloquear el scroll
- Cleanup del listener en el `useEffect` de retorno

### `demo-app/components/shop/BottomNav.tsx`

Componente que encapsula el navbar inferior mobile:

**Props:**
```typescript
interface BottomNavProps {
  activeTab: 'catalog' | 'stores' | 'cart' | 'profile'
  cartCount: number
  hidden: boolean
  onNavigate: (view: string) => void
}
```

**Visual:**
- Wrapper: `fixed bottom-0 left-0 right-0 z-50 px-4 pb-5 pt-2 pointer-events-none`
- Transición de ocultamiento: `transform translateY(calc(100% + 24px))` cuando `hidden=true`, `translateY(0)` cuando `hidden=false`
- Timing: `transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]`
- Contenedor navbar: `bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.12)] border border-white/60 px-3 py-2 flex items-center pointer-events-auto`
- Tab activo: pill `bg-price-blue-900 rounded-2xl w-10 h-10` con ícono blanco
- Tab inactivo: ícono `text-gray-400` sin fondo, sin label
- Badge carrito: punto `bg-price-pink-600 w-5 h-5 rounded-full` con número, `border-2 border-white`, posición `absolute -top-1 -right-1`

**Tabs (en orden):**
1. Inicio → `catalog`
2. Tiendas → `stores`
3. Carrito → `cart` (con badge de cantidad)
4. Cuenta → `profile`

## Archivos a modificar

Reemplazar el bloque `{/* Bottom Nav */}` inline por `<BottomNav />` en:

| Archivo | Acción |
|---------|--------|
| `components/shop/CatalogView.tsx` | Añadir `scrollRef` al contenedor scrollable, usar `useScrollHide`, renderizar `<BottomNav>` |
| `components/shop/CartView.tsx` | Igual |
| `components/shop/ProfileView.tsx` | Igual |
| `components/shop/QRView.tsx` | Igual |
| `components/shop/ProductDetailView.tsx` | Igual |
| `components/shop/CheckoutView.tsx` | Igual |
| `components/shop/PaymentView.tsx` | Igual |
| `components/shop/StoresView.tsx` | Igual |

> **Nota:** Las vistas que no tienen scroll real (ej. ProcessingView) pueden no usar `useScrollHide` — el navbar siempre visible ahí es el comportamiento correcto.

## Comportamiento del hook

```
scrollTop aumenta (scroll hacia abajo) && delta > 8px → hidden = true
scrollTop disminuye (scroll hacia arriba)              → hidden = false
scrollTop === 0                                        → hidden = false (siempre visible en el top)
```

## Padding inferior del contenido

El contenedor scrollable de cada vista mantiene `pb-32` para que el último elemento no quede oculto detrás del navbar cuando está visible.

## Lo que NO cambia

- Desktop: sin cambios, el navbar mobile ya tiene `md:hidden`
- Badge rosa del carrito: se mantiene igual
- Colores y sombras del navbar: se mantienen exactamente igual
- Lógica de navegación (dispatch SET_VIEW): sin cambios
