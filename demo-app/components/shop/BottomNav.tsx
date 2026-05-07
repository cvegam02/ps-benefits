"use client"

import { AppView } from "@/lib/types"

type Tab = "catalog" | "stores" | "cart" | "profile"

interface BottomNavProps {
  activeTab: Tab
  cartCount: number
  hidden: boolean
  onNavigate: (view: AppView) => void
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
