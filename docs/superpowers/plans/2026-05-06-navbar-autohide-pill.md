# Navbar Auto-hide con Pill Indicator — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reemplazar el navbar mobile de 4 tabs con un componente `BottomNav` con pill indicator (estilo Instagram/Apple Music) que se oculta con slide-down al hacer scroll hacia abajo y reaparece al hacer scroll hacia arriba.

**Architecture:** Se extrae el navbar inline duplicado en 3 vistas (CatalogView, ProfileView, StoresView) a un componente `BottomNav` compartido. Un hook `useScrollHide` detecta la dirección del scroll en el contenedor scrollable de cada vista y retorna un `boolean` que controla la transformación CSS del navbar.

**Tech Stack:** React 18, Next.js 14, TypeScript, Tailwind CSS, Jest + React Testing Library (setup incluido en este plan)

---

## File Map

| Archivo | Acción | Responsabilidad |
|---------|--------|-----------------|
| `demo-app/hooks/useScrollHide.ts` | Crear | Detecta dirección de scroll y retorna `hidden: boolean` |
| `demo-app/components/shop/BottomNav.tsx` | Crear | Navbar de 4 tabs con pill indicator y auto-hide |
| `demo-app/__tests__/hooks/useScrollHide.test.ts` | Crear | Tests del hook |
| `demo-app/__tests__/components/BottomNav.test.tsx` | Crear | Tests del componente |
| `demo-app/jest.config.ts` | Crear | Config Jest para Next.js |
| `demo-app/jest.setup.ts` | Crear | Setup @testing-library/jest-dom |
| `demo-app/package.json` | Modificar | Agregar dependencias y scripts de test |
| `demo-app/components/shop/CatalogView.tsx` | Modificar | Usar `<BottomNav activeTab="catalog" />` |
| `demo-app/components/shop/ProfileView.tsx` | Modificar | Usar `<BottomNav activeTab="profile" />` |
| `demo-app/components/shop/StoresView.tsx` | Modificar | Usar `<BottomNav activeTab="stores" />` |

> **Nota:** CartView, ProductDetailView, CheckoutView, PaymentView y QRView tienen CTAs específicos en el área inferior (no el navbar de 4 tabs) y no se modifican.

---

## Task 1: Setup Jest + React Testing Library

**Files:**
- Create: `demo-app/jest.config.ts`
- Create: `demo-app/jest.setup.ts`
- Modify: `demo-app/package.json`

- [ ] **Step 1: Instalar dependencias de testing**

```bash
cd "demo-app" && npm install --save-dev jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event @types/jest
```

- [ ] **Step 2: Crear `jest.config.ts`**

```typescript
import type { Config } from "jest"
import nextJest from "next/jest.js"

const createJestConfig = nextJest({ dir: "./" })

const config: Config = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  testPathPattern: ["__tests__"],
}

export default createJestConfig(config)
```

- [ ] **Step 3: Crear `jest.setup.ts`**

```typescript
import "@testing-library/jest-dom"
```

- [ ] **Step 4: Agregar scripts en `package.json`**

Agregar dentro de `"scripts"`:
```json
"test": "jest",
"test:watch": "jest --watch",
"test:coverage": "jest --coverage"
```

- [ ] **Step 5: Verificar que Jest corre sin errores**

```bash
cd "demo-app" && npm test -- --passWithNoTests
```

Resultado esperado: `Test Suites: 0 passed` (sin errores)

- [ ] **Step 6: Commit**

```bash
git add demo-app/jest.config.ts demo-app/jest.setup.ts demo-app/package.json demo-app/package-lock.json
git commit -m "chore: setup Jest + React Testing Library"
```

---

## Task 2: Hook `useScrollHide` (TDD)

**Files:**
- Create: `demo-app/hooks/useScrollHide.ts`
- Create: `demo-app/__tests__/hooks/useScrollHide.test.ts`

- [ ] **Step 1: Crear directorio y archivo de test vacío**

```bash
mkdir -p "demo-app/__tests__/hooks"
```

- [ ] **Step 2: Escribir los tests (RED)**

Crear `demo-app/__tests__/hooks/useScrollHide.test.ts`:

```typescript
import { renderHook, act } from "@testing-library/react"
import { useScrollHide } from "@/hooks/useScrollHide"

function makeRef(initialScrollTop = 0) {
  const div = document.createElement("div")
  Object.defineProperty(div, "scrollTop", {
    value: initialScrollTop,
    writable: true,
    configurable: true,
  })
  return { current: div }
}

describe("useScrollHide", () => {
  it("returns false initially", () => {
    const ref = makeRef(0)
    const { result } = renderHook(() => useScrollHide(ref))
    expect(result.current).toBe(false)
  })

  it("returns true when scrolling down more than 8px", () => {
    const ref = makeRef(0)
    const { result } = renderHook(() => useScrollHide(ref))

    act(() => {
      ref.current.scrollTop = 50
      ref.current.dispatchEvent(new Event("scroll"))
    })

    expect(result.current).toBe(true)
  })

  it("returns false when scrolling back up", () => {
    const ref = makeRef(0)
    const { result } = renderHook(() => useScrollHide(ref))

    act(() => {
      ref.current.scrollTop = 50
      ref.current.dispatchEvent(new Event("scroll"))
    })
    act(() => {
      ref.current.scrollTop = 20
      ref.current.dispatchEvent(new Event("scroll"))
    })

    expect(result.current).toBe(false)
  })

  it("returns false when scrollTop reaches 0", () => {
    const ref = makeRef(0)
    const { result } = renderHook(() => useScrollHide(ref))

    act(() => {
      ref.current.scrollTop = 50
      ref.current.dispatchEvent(new Event("scroll"))
    })
    act(() => {
      ref.current.scrollTop = 0
      ref.current.dispatchEvent(new Event("scroll"))
    })

    expect(result.current).toBe(false)
  })

  it("does not crash when ref.current is null", () => {
    const ref = { current: null }
    const { result } = renderHook(() => useScrollHide(ref))
    expect(result.current).toBe(false)
  })

  it("ignores small downward scroll (<=8px)", () => {
    const ref = makeRef(0)
    const { result } = renderHook(() => useScrollHide(ref))

    act(() => {
      ref.current.scrollTop = 4
      ref.current.dispatchEvent(new Event("scroll"))
    })

    expect(result.current).toBe(false)
  })
})
```

- [ ] **Step 3: Ejecutar tests — deben fallar**

```bash
cd "demo-app" && npm test -- __tests__/hooks/useScrollHide.test.ts
```

Resultado esperado: `FAIL` con `Cannot find module '@/hooks/useScrollHide'`

- [ ] **Step 4: Crear `hooks/useScrollHide.ts` (GREEN)**

```typescript
import { useEffect, useState } from "react"

export function useScrollHide(ref: { current: HTMLElement | null }): boolean {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let lastScrollTop = 0

    function handleScroll() {
      const scrollTop = el!.scrollTop
      if (scrollTop === 0) {
        setHidden(false)
      } else if (scrollTop > lastScrollTop + 8) {
        setHidden(true)
      } else if (scrollTop < lastScrollTop) {
        setHidden(false)
      }
      lastScrollTop = scrollTop
    }

    el.addEventListener("scroll", handleScroll, { passive: true })
    return () => el.removeEventListener("scroll", handleScroll)
  }, [ref])

  return hidden
}
```

- [ ] **Step 5: Ejecutar tests — deben pasar**

```bash
cd "demo-app" && npm test -- __tests__/hooks/useScrollHide.test.ts
```

Resultado esperado: `PASS` — 6 tests en verde

- [ ] **Step 6: Commit**

```bash
git add demo-app/hooks/useScrollHide.ts demo-app/__tests__/hooks/useScrollHide.test.ts
git commit -m "feat: add useScrollHide hook with scroll direction detection"
```

---

## Task 3: Componente `BottomNav` (TDD)

**Files:**
- Create: `demo-app/components/shop/BottomNav.tsx`
- Create: `demo-app/__tests__/components/BottomNav.test.tsx`

- [ ] **Step 1: Crear directorio de tests de componentes**

```bash
mkdir -p "demo-app/__tests__/components"
```

- [ ] **Step 2: Escribir tests del componente (RED)**

Crear `demo-app/__tests__/components/BottomNav.test.tsx`:

```tsx
import { render, screen, fireEvent } from "@testing-library/react"
import { BottomNav } from "@/components/shop/BottomNav"

const defaultProps = {
  activeTab: "catalog" as const,
  cartCount: 0,
  hidden: false,
  onNavigate: jest.fn(),
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe("BottomNav", () => {
  it("renders all 4 nav buttons", () => {
    render(<BottomNav {...defaultProps} />)
    expect(screen.getByRole("button", { name: "Inicio" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Tiendas" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Carrito" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Cuenta" })).toBeInTheDocument()
  })

  it("applies slide-out transform when hidden is true", () => {
    const { container } = render(<BottomNav {...defaultProps} hidden={true} />)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.style.transform).toBe("translateY(calc(100% + 24px))")
  })

  it("applies no transform when hidden is false", () => {
    const { container } = render(<BottomNav {...defaultProps} hidden={false} />)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.style.transform).toBe("translateY(0)")
  })

  it("shows cart badge when cartCount > 0", () => {
    render(<BottomNav {...defaultProps} cartCount={3} />)
    expect(screen.getByText("3")).toBeInTheDocument()
  })

  it("hides cart badge when cartCount is 0", () => {
    render(<BottomNav {...defaultProps} cartCount={0} />)
    expect(screen.queryByText("0")).not.toBeInTheDocument()
  })

  it("calls onNavigate('stores') when Tiendas button is clicked", () => {
    const onNavigate = jest.fn()
    render(<BottomNav {...defaultProps} onNavigate={onNavigate} />)
    fireEvent.click(screen.getByRole("button", { name: "Tiendas" }))
    expect(onNavigate).toHaveBeenCalledWith("stores")
  })

  it("calls onNavigate('cart') when Carrito button is clicked", () => {
    const onNavigate = jest.fn()
    render(<BottomNav {...defaultProps} onNavigate={onNavigate} />)
    fireEvent.click(screen.getByRole("button", { name: "Carrito" }))
    expect(onNavigate).toHaveBeenCalledWith("cart")
  })

  it("calls onNavigate('profile') when Cuenta button is clicked", () => {
    const onNavigate = jest.fn()
    render(<BottomNav {...defaultProps} onNavigate={onNavigate} />)
    fireEvent.click(screen.getByRole("button", { name: "Cuenta" }))
    expect(onNavigate).toHaveBeenCalledWith("profile")
  })

  it("calls onNavigate('catalog') when Inicio button is clicked", () => {
    const onNavigate = jest.fn()
    render(<BottomNav {...defaultProps} activeTab="profile" onNavigate={onNavigate} />)
    fireEvent.click(screen.getByRole("button", { name: "Inicio" }))
    expect(onNavigate).toHaveBeenCalledWith("catalog")
  })

  it("active tab (catalog) has pill background class on icon container", () => {
    render(<BottomNav {...defaultProps} activeTab="catalog" />)
    const btn = screen.getByRole("button", { name: "Inicio" })
    const iconContainer = btn.querySelector("div")
    expect(iconContainer?.className).toMatch(/bg-price-blue-900/)
  })

  it("inactive tab does not have pill background", () => {
    render(<BottomNav {...defaultProps} activeTab="catalog" />)
    const btn = screen.getByRole("button", { name: "Tiendas" })
    const iconContainer = btn.querySelector("div")
    expect(iconContainer?.className).not.toMatch(/bg-price-blue-900/)
  })
})
```

- [ ] **Step 3: Ejecutar tests — deben fallar**

```bash
cd "demo-app" && npm test -- __tests__/components/BottomNav.test.tsx
```

Resultado esperado: `FAIL` con `Cannot find module '@/components/shop/BottomNav'`

- [ ] **Step 4: Crear `components/shop/BottomNav.tsx` (GREEN)**

```tsx
"use client"

type Tab = "catalog" | "stores" | "cart" | "profile"

interface BottomNavProps {
  activeTab: Tab
  cartCount: number
  hidden: boolean
  onNavigate: (view: string) => void
}

function PillIcon({ active, children }: { active: boolean; children: React.ReactNode }) {
  return (
    <div
      className={`relative flex items-center justify-center w-10 h-10 rounded-2xl ${
        active ? "bg-price-blue-900 shadow-lg shadow-price-blue-900/30" : ""
      }`}
    >
      {children}
    </div>
  )
}

export function BottomNav({ activeTab, cartCount, hidden, onNavigate }: BottomNavProps) {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-5 pt-2 pointer-events-none md:hidden transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
      style={{ transform: hidden ? "translateY(calc(100% + 24px))" : "translateY(0)" }}
    >
      <div className="pointer-events-auto bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.12)] border border-white/60 px-3 py-2 flex items-center">

        {/* Inicio */}
        <button
          aria-label="Inicio"
          onClick={() => onNavigate("catalog")}
          className="flex-1 flex items-center justify-center py-1"
        >
          <PillIcon active={activeTab === "catalog"}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke={activeTab === "catalog" ? "white" : "#9ca3af"}
              strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
            </svg>
          </PillIcon>
        </button>

        {/* Tiendas */}
        <button
          aria-label="Tiendas"
          onClick={() => onNavigate("stores")}
          className="flex-1 flex items-center justify-center py-1"
        >
          <PillIcon active={activeTab === "stores"}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke={activeTab === "stores" ? "white" : "#9ca3af"}
              strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </PillIcon>
        </button>

        {/* Carrito */}
        <button
          aria-label="Carrito"
          onClick={() => onNavigate("cart")}
          className="flex-1 flex items-center justify-center py-1"
        >
          <PillIcon active={activeTab === "cart"}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke={activeTab === "cart" ? "white" : "#9ca3af"}
              strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-price-pink-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                {cartCount}
              </span>
            )}
          </PillIcon>
        </button>

        {/* Cuenta */}
        <button
          aria-label="Cuenta"
          onClick={() => onNavigate("profile")}
          className="flex-1 flex items-center justify-center py-1"
        >
          <PillIcon active={activeTab === "profile"}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke={activeTab === "profile" ? "white" : "#9ca3af"}
              strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </PillIcon>
        </button>

      </div>
    </div>
  )
}
```

- [ ] **Step 5: Ejecutar todos los tests — deben pasar**

```bash
cd "demo-app" && npm test
```

Resultado esperado: `PASS` — todos los tests en verde

- [ ] **Step 6: Commit**

```bash
git add demo-app/components/shop/BottomNav.tsx demo-app/__tests__/components/BottomNav.test.tsx
git commit -m "feat: add BottomNav component with pill indicator and auto-hide support"
```

---

## Task 4: Integrar en CatalogView

**Files:**
- Modify: `demo-app/components/shop/CatalogView.tsx`

- [ ] **Step 1: Agregar imports**

En [CatalogView.tsx](demo-app/components/shop/CatalogView.tsx), cambiar:

```tsx
import { useState } from "react"
```

por:

```tsx
import { useRef, useState } from "react"
import { useScrollHide } from "@/hooks/useScrollHide"
import { BottomNav } from "@/components/shop/BottomNav"
```

- [ ] **Step 2: Agregar ref y hook dentro del componente**

Después de `const cartCount = state.cart.reduce(...)` agregar:

```tsx
const scrollRef = useRef<HTMLDivElement>(null)
const navHidden = useScrollHide(scrollRef)
```

- [ ] **Step 3: Agregar `ref` al contenedor scrollable**

En la línea del Product Grid, cambiar:

```tsx
<div className="flex-1 overflow-y-auto px-4 pb-32">
```

por:

```tsx
<div ref={scrollRef} className="flex-1 overflow-y-auto px-4 pb-32">
```

- [ ] **Step 4: Reemplazar el bloque `{/* Bottom Nav */}` (líneas 171-231)**

Borrar el bloque completo desde `{/* Bottom Nav */}` hasta el cierre `</div>` de ese bloque, y reemplazarlo con:

```tsx
<BottomNav
  activeTab="catalog"
  cartCount={cartCount}
  hidden={navHidden}
  onNavigate={(view) => dispatch({ type: "SET_VIEW", payload: view })}
/>
```

- [ ] **Step 5: Verificar TypeScript**

```bash
cd "demo-app" && npx tsc --noEmit
```

Resultado esperado: sin errores de tipos

- [ ] **Step 6: Commit**

```bash
git add demo-app/components/shop/CatalogView.tsx
git commit -m "feat: integrate BottomNav with auto-hide in CatalogView"
```

---

## Task 5: Integrar en ProfileView

**Files:**
- Modify: `demo-app/components/shop/ProfileView.tsx`

- [ ] **Step 1: Agregar imports**

En [ProfileView.tsx](demo-app/components/shop/ProfileView.tsx), cambiar la línea de imports de `"use client"` y el import de `useApp`, agregar:

```tsx
import { useRef } from "react"
import { useScrollHide } from "@/hooks/useScrollHide"
import { BottomNav } from "@/components/shop/BottomNav"
```

- [ ] **Step 2: Agregar `cartCount`, ref y hook**

Después de `const { state, dispatch } = useApp()` agregar:

```tsx
const cartCount = state.cart.reduce((sum, i) => sum + i.quantity, 0)
const scrollRef = useRef<HTMLDivElement>(null)
const navHidden = useScrollHide(scrollRef)
```

- [ ] **Step 3: Agregar `ref` al contenedor scrollable**

En ProfileView, el área scrollable mobile está en la línea con `className="flex-1 overflow-y-auto no-scrollbar"`. Cambiarla por:

```tsx
<div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar">
```

- [ ] **Step 4: Reemplazar el bloque `{/* BOTTOM NAV (mobile) */}` (líneas 373-412)**

Borrar el bloque completo desde el comentario `{/* ── BOTTOM NAV (mobile) */}` hasta el `</div>` que lo cierra, y reemplazarlo con:

```tsx
<BottomNav
  activeTab="profile"
  cartCount={cartCount}
  hidden={navHidden}
  onNavigate={(view) => dispatch({ type: "SET_VIEW", payload: view })}
/>
```

- [ ] **Step 5: Verificar TypeScript**

```bash
cd "demo-app" && npx tsc --noEmit
```

Resultado esperado: sin errores de tipos

- [ ] **Step 6: Commit**

```bash
git add demo-app/components/shop/ProfileView.tsx
git commit -m "feat: integrate BottomNav with auto-hide in ProfileView"
```

---

## Task 6: Integrar en StoresView

**Files:**
- Modify: `demo-app/components/shop/StoresView.tsx`

> **Nota:** StoresView muestra un mapa — no tiene un contenedor scrollable único en mobile. El navbar no tendrá auto-hide (siempre visible). `useScrollHide` con `ref.current = null` retorna `false` por diseño.

- [ ] **Step 1: Agregar imports**

En [StoresView.tsx](demo-app/components/shop/StoresView.tsx) agregar:

```tsx
import { useRef } from "react"
import { useScrollHide } from "@/hooks/useScrollHide"
import { BottomNav } from "@/components/shop/BottomNav"
```

- [ ] **Step 2: Agregar `state`, `cartCount`, ref y hook**

Cambiar:
```tsx
const { dispatch } = useApp()
```
por:
```tsx
const { state, dispatch } = useApp()
const cartCount = state.cart.reduce((sum, i) => sum + i.quantity, 0)
const scrollRef = useRef<HTMLDivElement>(null)
const navHidden = useScrollHide(scrollRef)
```

- [ ] **Step 3: Reemplazar el bloque `{/* BOTTOM NAV (mobile) */}` (líneas 380-419)**

Borrar el bloque completo desde `{/* ── BOTTOM NAV (mobile) */}` hasta `</div>` (justo antes de `</div>` del wrapper mobile principal), y reemplazarlo con:

```tsx
<BottomNav
  activeTab="stores"
  cartCount={cartCount}
  hidden={navHidden}
  onNavigate={(view) => dispatch({ type: "SET_VIEW", payload: view })}
/>
```

- [ ] **Step 4: Verificar TypeScript**

```bash
cd "demo-app" && npx tsc --noEmit
```

Resultado esperado: sin errores de tipos

- [ ] **Step 5: Commit**

```bash
git add demo-app/components/shop/StoresView.tsx
git commit -m "feat: integrate BottomNav with auto-hide in StoresView"
```

---

## Task 7: Build check y cobertura final

**Files:** ninguno nuevo

- [ ] **Step 1: Correr todos los tests con cobertura**

```bash
cd "demo-app" && npm run test:coverage
```

Resultado esperado: `PASS` para todos los archivos de test. Verificar que la cobertura de `hooks/useScrollHide.ts` y `components/shop/BottomNav.tsx` sea ≥ 80%.

- [ ] **Step 2: Build de producción**

```bash
cd "demo-app" && npm run build
```

Resultado esperado: build exitoso sin errores de TypeScript ni warnings críticos.

- [ ] **Step 3: Commit final**

```bash
git add -A
git commit -m "chore: verify build and test coverage for BottomNav auto-hide"
```
