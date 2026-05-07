# Mobile Navigation: Hamburger Menu + Bottom Sheet

**Date:** 2026-05-06  
**Status:** Approved

## Context

The current mobile navigation uses a floating `BottomNav` component — a pill-shaped bar that hovers over the content at the bottom of the screen and hides on scroll. The goal is to replace it with a hamburger button in the header that opens a bottom sheet, freeing up content space and simplifying the chrome.

## Decision

Replace the floating `BottomNav` with:
1. A **hamburger (≡) button** in the top-right corner of each mobile view's header, replacing the decorative notification bell.
2. A **bottom sheet** that slides up from the bottom when the button is tapped, listing the 4 navigation destinations.

## Design

### Trigger button

- Position: top-right of the blue atmospheric header, where the notification bell currently sits.
- Appearance: `28×28px` rounded square (`rounded-[8px]`) with `bg-white/15 border border-white/20` — consistent with the existing logo button style.
- Icon: three horizontal lines (≡) when closed; × (cross) when the sheet is open.
- The toggle between ≡ and × happens instantly on tap.

### Bottom sheet

- Slides up from the bottom: starts at `translateY(100%)` (hidden below viewport), animates to `translateY(0)` on open. Uses `transition: transform 300ms cubic-bezier(0.4,0,0.2,1)`, consistent with the existing `BottomNav` animation.
- Background: `bg-white rounded-t-[20px] shadow-[0_-8px_40px_rgba(0,0,0,0.15)]`.
- Backdrop: `bg-black/35 backdrop-blur-[2px]` covers the rest of the screen; tapping it closes the sheet.
- Drag handle: `32×3px` pill at the top center for visual affordance.
- Section label: small uppercase `"Navegación"` label above the items.

### Navigation items

Four items in order: Inicio, Tiendas, Carrito, Cuenta.

Each item:
- Full-width row: `48px` touch target, `14px` horizontal padding.
- Left icon: `28×28px` rounded square (`rounded-[8px]`), gray fill by default; `bg-price-blue-900` fill when active.
- Label: `10px font-700`, gray by default; `text-price-blue-900` when active.
- Active row: `bg-price-blue-900/6` background + blue dot on the right edge.
- Carrito badge: pink `16×16px` circle with item count, shown only when `cartCount > 0`.

### Interaction

- Tapping an item navigates to the view and closes the sheet.
- Tapping the backdrop closes the sheet without navigating.
- Tapping ≡/× toggles the sheet.

## Architecture

### New component: `MobileMenuSheet`

A single self-contained component that receives:
```tsx
interface MobileMenuSheetProps {
  open: boolean
  activeTab: "catalog" | "stores" | "cart" | "profile"
  cartCount: number
  onNavigate: (view: AppView) => void
  onClose: () => void
}
```

Renders the backdrop + sheet. The parent controls `open` state.

### State

Each view that currently renders `BottomNav` manages a local `menuOpen: boolean` state. The hamburger button and `MobileMenuSheet` are both rendered within that view's mobile section.

Affected views: `CatalogView`, `StoresView`, `ProfileView`.

### Hamburger button placement

In each view's mobile header, the notification bell `<button>` is replaced with the hamburger/close toggle button. The button calls `setMenuOpen(prev => !prev)`.

### `BottomNav` removal

The `BottomNav` component and its `useScrollHide` dependency are no longer needed in the shop nav context. The `BottomNav.tsx` file can be deleted after the three views are updated.

## Files changed

| File | Change |
|------|--------|
| `components/shop/MobileMenuSheet.tsx` | **Create** — new bottom sheet component |
| `components/shop/CatalogView.tsx` | Replace `BottomNav` with hamburger + `MobileMenuSheet` |
| `components/shop/StoresView.tsx` | Replace `BottomNav` with hamburger + `MobileMenuSheet` |
| `components/shop/ProfileView.tsx` | Replace `BottomNav` with hamburger + `MobileMenuSheet` |
| `components/shop/BottomNav.tsx` | **Delete** |

## Visual tokens (existing system)

| Token | Value | Usage |
|-------|-------|-------|
| `price-blue-900` | `#1e3a8a` | Active icon bg, active label, active dot |
| `price-pink-600` | `#db2777` | Cart item count badge |
| `white/15`, `white/20` | — | Hamburger button bg/border in blue header |

## Out of scope

- Desktop navigation is unchanged.
- The decorative notification bell is removed and not replaced with functional notifications.
- Swipe-down gesture to dismiss the sheet is not implemented in this iteration.
