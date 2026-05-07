# Store Mobile Responsive Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the store admin panel (`/store`) usable on mobile phones, with a compact responsive header and an `OrderDetailPanel` that slides in full-screen from the right.

**Architecture:** Two focused changes — (1) the store header restructures into a mobile-only compact row + hidden desktop row, and (2) `OrderDetailPanel` switches from a fixed-460px side panel to `fixed inset-0` (full screen) on mobile using Tailwind responsive prefixes. No new components, no state changes.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind CSS (with `tailwindcss-animate` for `animate-in slide-in-from-right`), brand tokens `price-blue-900` / `price-pink-600`.

---

## File Map

| File | What changes |
|------|-------------|
| `demo-app/app/store/page.tsx` | Header: add `md:hidden` mobile row + `hidden md:flex` wrapper around existing desktop content |
| `demo-app/components/store/OrderDetailPanel.tsx` | Panel wrapper: `fixed inset-0 md:inset-auto md:right-0 md:top-0 md:bottom-0 md:w-[460px]`; reduce padding on mobile; `grid-cols-1 sm:grid-cols-2` for Customer/Payment |

Modals (`ReadyConfirmationModal`, `DeliveryConfirmationModal`) already use `p-4 w-full max-w-lg` — they render fine on mobile and do not need changes.

---

### Task 1: OrderDetailPanel — full-screen on mobile

**Files:**
- Modify: `demo-app/components/store/OrderDetailPanel.tsx`

**Context:** The panel lives in `OrderDetailPanel.tsx`. Currently it has:
- Line 85: overlay `<div className="fixed inset-0 ... z-40 ...">` — already fine.
- Line 88: panel `<div className="fixed right-0 top-0 bottom-0 z-50 flex flex-col bg-white shadow-2xl animate-in slide-in-from-right duration-300" style={{ width: 460 }}>` — hardcoded 460px, breaks on mobile.
- Line 107: header `px-8 py-8` — too much padding on mobile.
- Line 129: content area `p-8 space-y-8` — too much padding on mobile.
- Line 151: `grid grid-cols-2 gap-4` for Customer/Payment cards — overflows on mobile.
- Line 263: footer CTA `px-8 py-8` — too much padding on mobile.

- [ ] **Step 1: Make the panel wrapper full-screen on mobile**

Replace line 88. Remove the `style={{ width: 460 }}` inline style. Replace the className:

```tsx
{/* Before */}
<div className="fixed right-0 top-0 bottom-0 z-50 flex flex-col bg-white shadow-2xl animate-in slide-in-from-right duration-300" style={{ width: 460 }}>

{/* After */}
<div className="fixed inset-0 md:inset-auto md:right-0 md:top-0 md:bottom-0 md:w-[460px] z-50 flex flex-col bg-white shadow-2xl animate-in slide-in-from-right duration-300">
```

- [ ] **Step 2: Reduce header padding on mobile**

Line 107 — change `px-8 py-8` to `px-5 py-5 md:px-8 md:py-8`:

```tsx
{/* Before */}
<div className="bg-price-blue-900 text-white px-8 py-8 relative overflow-hidden flex-shrink-0">

{/* After */}
<div className="bg-price-blue-900 text-white px-5 py-5 md:px-8 md:py-8 relative overflow-hidden flex-shrink-0">
```

- [ ] **Step 3: Reduce content area padding on mobile**

Line 129 — change `p-8 space-y-8` to `p-5 md:p-8 space-y-6 md:space-y-8`:

```tsx
{/* Before */}
<div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar bg-gray-50/30">

{/* After */}
<div className="flex-1 overflow-y-auto p-5 md:p-8 space-y-6 md:space-y-8 no-scrollbar bg-gray-50/30">
```

- [ ] **Step 4: Make Customer/Payment grid single-column on mobile**

Line 151 — change `grid grid-cols-2 gap-4` to `grid grid-cols-1 sm:grid-cols-2 gap-4`:

```tsx
{/* Before */}
<div className="grid grid-cols-2 gap-4">

{/* After */}
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
```

- [ ] **Step 5: Reduce footer CTA padding on mobile**

Line 263 — change `px-8 py-8` to `px-5 py-5 md:px-8 md:py-8`:

```tsx
{/* Before */}
<div className="px-8 py-8 border-t border-gray-100 bg-white flex-shrink-0 flex flex-col gap-4">

{/* After */}
<div className="px-5 py-5 md:px-8 md:py-8 border-t border-gray-100 bg-white flex-shrink-0 flex flex-col gap-4">
```

- [ ] **Step 6: Commit**

```bash
git add demo-app/components/store/OrderDetailPanel.tsx
git commit -m "feat: make OrderDetailPanel full-screen on mobile"
```

---

### Task 2: Store header — compact mobile row

**Files:**
- Modify: `demo-app/app/store/page.tsx`

**Context:** The `<header>` (lines 298–374) currently renders as `flex items-stretch h-24` with a `w-80` brand block directly in the flex row. On a 375px phone, `w-80 = 320px` consumes most of the viewport. Strategy: wrap the existing desktop content in `hidden md:flex items-stretch h-24 w-full` and add a sibling `md:hidden` compact row above it. The decorative background `<div>`s stay at the `<header>` level (they use `absolute` positioning and are fine as-is).

Note: `byStatus` is computed above the return statement — it's available in JSX.

- [ ] **Step 1: Change the header element and wrap desktop content**

The current header opens with (line 298):
```tsx
<header className="relative z-20 bg-price-blue-900 border-b border-white/10 flex items-stretch h-24 flex-shrink-0 shadow-xl shadow-price-blue-900/20 overflow-hidden">
```

Change it to remove `flex items-stretch h-24` (those move to the desktop wrapper):
```tsx
<header className="relative z-20 bg-price-blue-900 border-b border-white/10 flex-shrink-0 shadow-xl shadow-price-blue-900/20 overflow-hidden">
```

- [ ] **Step 2: Add mobile compact row (inside `<header>`, before the decorative backgrounds)**

Insert immediately after `<header ...>` (before the existing decorative `<div className="absolute top-0 right-0 ...">` at line 300):

```tsx
{/* Mobile header */}
<div className="md:hidden relative z-10 flex items-center justify-between px-4 py-4">
  <div className="flex items-center gap-3">
    <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg flex-shrink-0">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    </div>
    <div>
      <p className="text-[9px] font-bold text-price-blue-300 uppercase tracking-widest leading-none mb-0.5">Price Shoes Benefits</p>
      <p className="text-white text-base font-black leading-none tracking-tight">Panel de Tienda</p>
    </div>
  </div>
  <div className="flex items-center gap-2">
    <div className="flex items-center gap-1.5 h-9 px-3 bg-white/5 border border-white/10 rounded-xl">
      <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
      <span className="text-[10px] font-black text-white tabular-nums">{byStatus.pendiente.length}</span>
    </div>
    <button
      onClick={() => setShowScanner(true)}
      className="w-11 h-11 rounded-xl bg-price-pink-600 hover:bg-price-pink-500 text-white shadow-lg shadow-price-pink-600/30 transition-all active:scale-90 flex items-center justify-center"
      title="Escáner"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/>
        <rect x="7" y="7" width="3" height="3"/><rect x="14" y="7" width="3" height="3"/><rect x="7" y="14" width="3" height="3"/><rect x="14" y="14" width="3" height="3"/>
      </svg>
    </button>
  </div>
</div>
```

- [ ] **Step 3: Wrap existing desktop content in `hidden md:flex`**

The existing desktop content starts with the brand block `<div className="w-80 flex items-center ...">` (line 304) and ends just before `</header>` (line 374). Wrap it:

```tsx
{/* Desktop header */}
<div className="hidden md:flex items-stretch h-24 w-full">
  {/* existing: brand block + toolbar — no changes inside */}
  <div className="w-80 flex items-center px-8 relative border-r border-white/5">
    ...existing brand block content unchanged...
  </div>
  <div className="flex-1 flex items-center px-10 gap-10">
    ...existing toolbar content unchanged...
  </div>
</div>
```

Do NOT change any content inside the brand block or toolbar — just wrap them.

- [ ] **Step 4: Commit**

```bash
git add demo-app/app/store/page.tsx
git commit -m "feat: add compact mobile header to store panel"
```

---

### Task 3: Build verification

**Files:** None modified — this task only runs the build.

- [ ] **Step 1: Run the Next.js build**

```bash
cd demo-app && npm run build 2>&1 | tail -40
```

Expected: build completes. The pre-existing `QRScanner` type error in `app/store/page.tsx:474` may appear — it existed before this work and does not block the feature. Any NEW TypeScript errors introduced by Tasks 1–2 must be fixed before marking done.

- [ ] **Step 2: If new type errors appear, fix them**

Common pitfall: `byStatus` used in the new mobile header JSX — it is computed at lines 273–277 of `page.tsx` before the `return` statement, so it is in scope. No type changes expected.

- [ ] **Step 3: Commit fix if needed**

```bash
git add demo-app/app/store/page.tsx demo-app/components/store/OrderDetailPanel.tsx
git commit -m "fix: resolve type errors in store mobile responsive"
```

---

## Visual Verification Checklist

After implementation, manually check on a 390px-wide viewport (Chrome DevTools → iPhone 14):

- [ ] Store header shows compact row (icon + title + amber count chip + pink scan button)
- [ ] Tapping an order card slides in the detail panel full-screen from the right
- [ ] Detail panel has a close (✕) button in the top-right corner
- [ ] Customer/Payment cards stack in a single column inside the panel
- [ ] Footer action buttons (MARCAR COMO LISTO / CONFIRMAR ENTREGA) are full-width and tappable
- [ ] Desktop (1280px wide): header looks unchanged, panel is 460px side panel — no regressions
