# Mobile Hamburger Menu Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the floating `BottomNav` on mobile with a hamburger button (≡) in the blue header that opens a bottom sheet with the 4 navigation items.

**Architecture:** A new `MobileMenuSheet` component renders the backdrop + sheet, controlled by a local `menuOpen` boolean state in each view. The three views that used `BottomNav` (CatalogView, StoresView, ProfileView) each get a hamburger toggle button in their mobile header and render `MobileMenuSheet`. `BottomNav.tsx` is deleted after all three views are updated.

**Tech Stack:** Next.js 14 App Router, React 18, TypeScript, Tailwind CSS.

---

## File Map

| File | Action |
|------|--------|
| `components/shop/MobileMenuSheet.tsx` | **Create** — new bottom sheet component |
| `components/shop/CatalogView.tsx` | **Modify** — hamburger button + MobileMenuSheet, remove BottomNav |
| `components/shop/StoresView.tsx` | **Modify** — hamburger button + MobileMenuSheet, remove BottomNav |
| `components/shop/ProfileView.tsx` | **Modify** — hamburger button + MobileMenuSheet, remove BottomNav |
| `components/shop/BottomNav.tsx` | **Delete** |

---

## Task 1: Create MobileMenuSheet component

**Files:**
- Create: `demo-app/components/shop/MobileMenuSheet.tsx`

- [ ] **Step 1: Create the file**

```tsx
"use client"

import { AppView } from "@/lib/types"

type ActiveTab = "catalog" | "stores" | "cart" | "profile"

interface MobileMenuSheetProps {
  open: boolean
  activeTab: ActiveTab
  cartCount: number
  onNavigate: (view: AppView) => void
  onClose: () => void
}

const NAV_ITEMS: {
  tab: ActiveTab
  view: AppView
  label: string
  icon: (active: boolean) => React.ReactNode
}[] = [
  {
    tab: "catalog",
    view: "catalog",
    label: "Inicio",
    icon: (active) => (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke={active ? "white" : "#6b7280"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
      </svg>
    ),
  },
  {
    tab: "stores",
    view: "stores",
    label: "Tiendas",
    icon: (active) => (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke={active ? "white" : "#6b7280"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    ),
  },
  {
    tab: "cart",
    view: "cart",
    label: "Carrito",
    icon: (active) => (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke={active ? "white" : "#6b7280"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 01-8 0"/>
      </svg>
    ),
  },
  {
    tab: "profile",
    view: "profile",
    label: "Cuenta",
    icon: (active) => (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke={active ? "white" : "#6b7280"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
]

export function MobileMenuSheet({ open, activeTab, cartCount, onNavigate, onClose }: MobileMenuSheetProps) {
  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/35 backdrop-blur-[2px] transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-[20px] shadow-[0_-8px_40px_rgba(0,0,0,0.15)] transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-8 h-[3px] bg-gray-200 rounded-full" />
        </div>

        {/* Section label */}
        <div className="px-4 pb-2 border-b border-gray-50">
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.15em]">Navegación</p>
        </div>

        {/* Nav items */}
        {NAV_ITEMS.map(({ tab, view, label, icon }) => {
          const active = activeTab === tab
          return (
            <button
              key={tab}
              onClick={() => { onNavigate(view); onClose() }}
              className={`w-full flex items-center gap-3 px-4 py-3 ${active ? "bg-price-blue-900/[0.06]" : ""}`}
            >
              <div className={`w-7 h-7 rounded-[8px] flex items-center justify-center flex-shrink-0 ${
                active ? "bg-price-blue-900" : "bg-gray-100"
              }`}>
                {icon(active)}
              </div>
              <span className={`text-[10px] font-bold flex-1 text-left ${
                active ? "text-price-blue-900" : "text-gray-600"
              }`}>
                {label}
              </span>
              {tab === "cart" && cartCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-price-pink-600 text-white text-[9px] font-black flex items-center justify-center">
                  {cartCount}
                </span>
              )}
              {active && (
                <div className="w-[6px] h-[6px] rounded-full bg-price-blue-900" />
              )}
            </button>
          )
        })}

        <div className="h-6" />
      </div>
    </>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd demo-app && npx tsc --noEmit
```

Expected: no errors. If you see `Cannot find module '@/lib/types'`, check that `AppView` is exported from `demo-app/lib/types.ts` (it is — `"catalog" | "detail" | "cart" | ... | "stores" | "profile"`).

- [ ] **Step 3: Commit**

```bash
git add demo-app/components/shop/MobileMenuSheet.tsx
git commit -m "feat: add MobileMenuSheet bottom sheet component"
```

---

## Task 2: Update CatalogView

**Files:**
- Modify: `demo-app/components/shop/CatalogView.tsx`

**What changes:**
- Remove `useRef` import and `useScrollHide` import
- Remove `BottomNav` import, add `MobileMenuSheet` import
- Remove `scrollRef` and `navHidden` declarations
- Add `menuOpen` state
- Replace notification bell button with hamburger toggle
- Remove `ref={scrollRef}` from scroll container, change `pb-32` → `pb-6`
- Replace `<BottomNav .../>` with `<MobileMenuSheet .../>`

- [ ] **Step 1: Update imports (lines 3–10)**

Replace:
```tsx
import { useRef, useState } from "react"
import { useApp } from "@/context/AppContext"
import { useScrollHide } from "@/hooks/useScrollHide"
import { BottomNav } from "@/components/shop/BottomNav"
```
With:
```tsx
import { useState } from "react"
import { useApp } from "@/context/AppContext"
import { MobileMenuSheet } from "@/components/shop/MobileMenuSheet"
```

- [ ] **Step 2: Remove scrollRef/navHidden, add menuOpen (around line 33)**

Remove these two lines:
```tsx
const scrollRef = useRef<HTMLDivElement>(null)
const navHidden = useScrollHide(scrollRef)
```
Add after `const cartCount = ...`:
```tsx
const [menuOpen, setMenuOpen] = useState(false)
```

- [ ] **Step 3: Replace the notification bell button with the hamburger toggle (around line 80)**

Find and replace — the entire bell `<div className="flex items-center gap-2">` block:
```tsx
              <div className="flex items-center gap-2">
                <button className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white active:scale-90 transition-transform">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
                </button>
              </div>
```
Replace with:
```tsx
              <button
                onClick={() => setMenuOpen(prev => !prev)}
                className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center active:scale-90 transition-transform"
                aria-label="Menú de navegación"
              >
                {menuOpen ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
                  </svg>
                )}
              </button>
```

- [ ] **Step 4: Fix scroll container (around line 158)**

Replace:
```tsx
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 pb-32">
```
With:
```tsx
        <div className="flex-1 overflow-y-auto px-4 pb-6">
```

- [ ] **Step 5: Replace BottomNav with MobileMenuSheet (around line 175)**

Replace:
```tsx
        <BottomNav
          activeTab="catalog"
          cartCount={cartCount}
          hidden={navHidden}
          onNavigate={(view) => dispatch({ type: "SET_VIEW", payload: view })}
        />
```
With:
```tsx
        <MobileMenuSheet
          open={menuOpen}
          activeTab="catalog"
          cartCount={cartCount}
          onNavigate={(view) => dispatch({ type: "SET_VIEW", payload: view })}
          onClose={() => setMenuOpen(false)}
        />
```

- [ ] **Step 6: Verify TypeScript compiles**

```bash
cd demo-app && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 7: Smoke test in browser**

```bash
cd demo-app && npm run dev
```

Open http://localhost:3000/shop on a mobile viewport (Chrome DevTools → iPhone 14). Verify:
- No floating bottom bar visible
- Hamburger ≡ appears top-right of blue header
- Tap ≡ → sheet slides up from bottom with 4 items
- "Inicio" row is highlighted (active)
- Tap a different item → navigates and sheet closes
- Tap backdrop → sheet closes without navigating

- [ ] **Step 8: Commit**

```bash
git add demo-app/components/shop/CatalogView.tsx
git commit -m "feat: replace BottomNav with hamburger + sheet in CatalogView"
```

---

## Task 3: Update StoresView

**Files:**
- Modify: `demo-app/components/shop/StoresView.tsx`

**What changes:**
- Remove `useRef`, `useScrollHide`, `BottomNav` imports; add `MobileMenuSheet` import
- Remove `scrollRef` and `navHidden` declarations (scrollRef is declared but never attached to a DOM element in this view)
- Add `menuOpen` state
- Replace the Hermosillo location pill (right side of mobile header) with the hamburger toggle
- Fix bottom padding: `pb-28` on the sticky bottom action row needs no change (it's not BottomNav padding; leave as-is)
- Replace `<BottomNav .../>` with `<MobileMenuSheet .../>`

- [ ] **Step 1: Update imports (lines 3–7)**

Replace:
```tsx
import { useRef } from "react"
import { useApp } from "@/context/AppContext"
import { useState } from "react"
import { useScrollHide } from "@/hooks/useScrollHide"
import { BottomNav } from "@/components/shop/BottomNav"
```
With:
```tsx
import { useApp } from "@/context/AppContext"
import { useState } from "react"
import { MobileMenuSheet } from "@/components/shop/MobileMenuSheet"
```

- [ ] **Step 2: Remove scrollRef/navHidden, add menuOpen (around line 81)**

Remove:
```tsx
  const scrollRef = useRef<HTMLDivElement>(null)
  const navHidden = useScrollHide(scrollRef)
```
Add after `const cartCount = ...`:
```tsx
  const [menuOpen, setMenuOpen] = useState(false)
```

- [ ] **Step 3: Replace the location pill with the hamburger toggle (around line 114)**

Find this block (the Hermosillo location pill on the right of the mobile header):
```tsx
          <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20">
            <p className="text-[8px] font-bold text-price-blue-300 uppercase tracking-widest leading-none mb-0.5">Hermosillo</p>
            <p className="text-white text-[10px] font-bold leading-none">Sonora, MX</p>
          </div>
```
Replace with:
```tsx
          <button
            onClick={() => setMenuOpen(prev => !prev)}
            className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center active:scale-90 transition-transform"
            aria-label="Menú de navegación"
          >
            {menuOpen ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            )}
          </button>
```

- [ ] **Step 4: Replace BottomNav with MobileMenuSheet (around line 385)**

Replace:
```tsx
      <BottomNav
        activeTab="stores"
        cartCount={cartCount}
        hidden={navHidden}
        onNavigate={(view) => dispatch({ type: "SET_VIEW", payload: view })}
      />
```
With:
```tsx
      <MobileMenuSheet
        open={menuOpen}
        activeTab="stores"
        cartCount={cartCount}
        onNavigate={(view) => dispatch({ type: "SET_VIEW", payload: view })}
        onClose={() => setMenuOpen(false)}
      />
```

- [ ] **Step 5: Verify TypeScript compiles**

```bash
cd demo-app && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 6: Smoke test in browser**

Navigate to Tiendas view (mobile viewport). Verify:
- No floating bottom bar
- Hamburger ≡ appears in the top-right of the blue header (where the Hermosillo pill was)
- Tap ≡ → sheet slides up, "Tiendas" item is highlighted
- Tap "Inicio" → navigates to catalog view, sheet closes

- [ ] **Step 7: Commit**

```bash
git add demo-app/components/shop/StoresView.tsx
git commit -m "feat: replace BottomNav with hamburger + sheet in StoresView"
```

---

## Task 4: Update ProfileView

**Files:**
- Modify: `demo-app/components/shop/ProfileView.tsx`

**What changes:**
- Remove `useRef`, `useScrollHide`, `BottomNav` imports; add `MobileMenuSheet` import
- Remove `scrollRef` and `navHidden` declarations
- Add `menuOpen` state
- Add hamburger toggle button at the end of the avatar flex row (requires adding `flex-1` to the user info div)
- Remove `ref={scrollRef}` from the scroll container (line 184)
- Fix bottom padding on the content div: `pb-32 md:pb-12` → `pb-6 md:pb-12`
- Replace `<BottomNav .../>` with `<MobileMenuSheet .../>`

- [ ] **Step 1: Update imports (lines 1–8)**

Replace:
```tsx
import { useRef } from "react"
import { useApp } from "@/context/AppContext"
import { tenants, formatMXN, timeAgo, getProductImageUrl } from "@/lib/mock-data"
import { Order } from "@/lib/types"
import { useScrollHide } from "@/hooks/useScrollHide"
import { BottomNav } from "@/components/shop/BottomNav"
```
With:
```tsx
import { useState } from "react"
import { useApp } from "@/context/AppContext"
import { tenants, formatMXN, timeAgo, getProductImageUrl } from "@/lib/mock-data"
import { Order } from "@/lib/types"
import { MobileMenuSheet } from "@/components/shop/MobileMenuSheet"
```

- [ ] **Step 2: Remove scrollRef/navHidden, add menuOpen (around line 87)**

Remove:
```tsx
  const scrollRef = useRef<HTMLDivElement>(null)
  const navHidden = useScrollHide(scrollRef)
```
Add after `const cartCount = ...`:
```tsx
  const [menuOpen, setMenuOpen] = useState(false)
```

- [ ] **Step 3: Add hamburger button to the mobile header (around line 110)**

The mobile header has a flex row with the avatar and user info div. Find:
```tsx
            <div className="min-w-0">
```
Change to:
```tsx
            <div className="min-w-0 flex-1">
```

Then, immediately after the closing `</div>` of that user info block (after the badges row, around line 127), add the hamburger button as the next sibling inside the flex row:
```tsx
            <button
              onClick={() => setMenuOpen(prev => !prev)}
              className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center flex-shrink-0 active:scale-90 transition-transform self-start"
              aria-label="Menú de navegación"
            >
              {menuOpen ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
                </svg>
              )}
            </button>
```

- [ ] **Step 4: Remove ref from scroll container, fix bottom padding (line 184)**

Replace:
```tsx
      <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar">
```
With:
```tsx
      <div className="flex-1 overflow-y-auto no-scrollbar">
```

Also find (line 188):
```tsx
          <div className="flex-1 px-4 md:px-8 pt-6 md:pt-8 pb-32 md:pb-12 space-y-5">
```
Replace `pb-32` with `pb-6`:
```tsx
          <div className="flex-1 px-4 md:px-8 pt-6 md:pt-8 pb-6 md:pb-12 space-y-5">
```

- [ ] **Step 5: Replace BottomNav with MobileMenuSheet (around line 379)**

Replace:
```tsx
      <BottomNav
        activeTab="profile"
        cartCount={cartCount}
        hidden={navHidden}
        onNavigate={(view) => dispatch({ type: "SET_VIEW", payload: view })}
      />
```
With:
```tsx
      <MobileMenuSheet
        open={menuOpen}
        activeTab="profile"
        cartCount={cartCount}
        onNavigate={(view) => dispatch({ type: "SET_VIEW", payload: view })}
        onClose={() => setMenuOpen(false)}
      />
```

- [ ] **Step 6: Verify TypeScript compiles**

```bash
cd demo-app && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 7: Smoke test in browser**

Navigate to Cuenta view (mobile viewport). Verify:
- Hamburger ≡ appears top-right of the header alongside the avatar
- Tap ≡ → sheet shows, "Cuenta" item is highlighted
- Content scrolls without clipping into a floating bar

- [ ] **Step 8: Commit**

```bash
git add demo-app/components/shop/ProfileView.tsx
git commit -m "feat: replace BottomNav with hamburger + sheet in ProfileView"
```

---

## Task 5: Delete BottomNav and final verification

**Files:**
- Delete: `demo-app/components/shop/BottomNav.tsx`

- [ ] **Step 1: Confirm BottomNav has no remaining imports**

```bash
grep -r "BottomNav" demo-app/components demo-app/app demo-app/hooks
```

Expected: no output. If any file still imports `BottomNav`, fix it before continuing.

- [ ] **Step 2: Delete the file**

```bash
rm demo-app/components/shop/BottomNav.tsx
```

- [ ] **Step 3: Final TypeScript check**

```bash
cd demo-app && npx tsc --noEmit
```

Expected: no errors. The `BottomNav` import in `useScrollHide` (if any) should not exist — `useScrollHide` is a standalone hook. If `useScrollHide` itself now has zero importers, you may delete it too, but it is not required.

- [ ] **Step 4: Full flow smoke test (mobile viewport)**

Open http://localhost:3000/shop on iPhone 14 viewport (Chrome DevTools). Run through the entire navigation flow:

1. CatalogView → tap ≡ → sheet opens → tap "Tiendas" → StoresView opens, sheet closes
2. StoresView → tap ≡ → sheet opens, "Tiendas" highlighted → tap "Cuenta" → ProfileView opens
3. ProfileView → tap ≡ → sheet opens, "Cuenta" highlighted → tap "Carrito" → CartView opens (no sheet in CartView — this is expected, CartView has no BottomNav)
4. CartView → go back to catalog → tap ≡ → add something to cart → tap ≡ again → Carrito badge shows item count in pink

Verify desktop is unaffected: widen to ≥768px on each view, confirm no hamburger button or sheet appears.

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "chore: remove BottomNav component (replaced by MobileMenuSheet)"
```
