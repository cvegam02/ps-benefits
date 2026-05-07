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
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
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
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
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
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
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
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
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

        {/* Nav items */}
        {NAV_ITEMS.map(({ tab, view, label, icon }) => {
          const active = activeTab === tab
          return (
            <button
              key={tab}
              onClick={() => { onNavigate(view); onClose() }}
              className={`w-full flex items-center gap-4 px-5 py-4 ${active ? "bg-price-blue-900/[0.06]" : ""}`}
            >
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                active ? "bg-price-blue-900" : "bg-gray-100"
              }`}>
                {icon(active)}
              </div>
              <span className={`text-sm font-bold flex-1 text-left ${
                active ? "text-price-blue-900" : "text-gray-600"
              }`}>
                {label}
              </span>
              {tab === "cart" && cartCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-price-pink-600 text-white text-[10px] font-black flex items-center justify-center">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
              {active && (
                <div className="w-2 h-2 rounded-full bg-price-blue-900" />
              )}
            </button>
          )
        })}

        <div className="h-6" />
      </div>
    </>
  )
}
