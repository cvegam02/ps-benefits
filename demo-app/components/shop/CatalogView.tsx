"use client"

import { useState } from "react"
import { useApp } from "@/context/AppContext"
import { products, tenants, getDiscountedPrice, formatMXN, getProductImageUrl } from "@/lib/mock-data"
import { Product } from "@/lib/types"
import Image from "next/image"

const CATEGORIES = ["Todos los productos", "Calzado", "Ropa", "Accesorios"]
const CATEGORY_MAP: Record<string, string> = {
  "Todos los productos": "",
  Calzado: "Calzado",
  Ropa: "Ropa",
  Accesorios: "Accesorios",
}

export default function CatalogView() {
  const { state, dispatch } = useApp()
  const [activeCategory, setActiveCategory] = useState("Todos los productos")
  const [search, setSearch] = useState("")
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")

  const tenant = state.currentUser
    ? tenants.find((t) => t.id === state.currentUser!.tenantId)
    : null
  const discount = tenant?.discount ?? 0
  const tenantName = tenant?.name ?? "Price Shoes Benefits"

  const cartCount = state.cart.reduce((sum, i) => sum + i.quantity, 0)

  const filtered = products.filter((p) => {
    const matchCat = !CATEGORY_MAP[activeCategory] || p.category === CATEGORY_MAP[activeCategory]
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  function addToCart(product: Product) {
    dispatch({ type: "ADD_TO_CART", payload: product })
  }

  function buyNow(product: Product) {
    dispatch({ type: "ADD_TO_CART", payload: product })
    dispatch({ type: "SET_VIEW", payload: "cart" })
  }

  function openDetail(product: Product) {
    dispatch({ type: "SELECT_PRODUCT", payload: product })
    dispatch({ type: "SET_VIEW", payload: "detail" })
  }

  return (
    <>
      {/* ── MOBILE ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col w-full md:hidden h-screen bg-gray-50">
        
        {/* Atmospheric Header */}
        <div className="relative bg-price-blue-900 pt-6 pb-8 px-4 overflow-hidden shadow-xl shadow-price-blue-900/20">
          <div className="absolute top-0 right-0 w-48 h-48 bg-price-pink-500/10 rounded-full blur-3xl -mr-10 -mt-10" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-price-blue-400/10 rounded-full blur-2xl -ml-10 -mb-10" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-price-blue-300 uppercase tracking-widest leading-none mb-1">Price Shoes Benefits</p>
                  <p className="text-white text-lg font-bold leading-none">{tenantName}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white active:scale-90 transition-transform">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
                </button>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-price-blue-600 transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </div>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="¿Qué estás buscando hoy?"
                className="w-full bg-white pl-11 pr-4 py-4 rounded-2xl text-sm font-medium shadow-2xl shadow-black/10 outline-none focus:ring-4 focus:ring-price-blue-500/20 transition-all placeholder:text-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Floating Discount Pill */}
        {discount > 0 && (
          <div className="px-4 -mt-5 z-20">
            <div className="bg-gradient-to-r from-price-pink-600 to-price-pink-500 rounded-full py-2.5 px-6 shadow-xl shadow-price-pink-600/20 flex items-center justify-center gap-2 border border-white/20">
              <span className="text-sm">💎</span>
              <span className="text-sm font-bold text-white tracking-wide">
                Beneficio Exclusivo: <span className="ml-1">{discount}% OFF</span> en todo el catálogo
              </span>
            </div>
          </div>
        )}

        {/* Categories Scroller */}
        <div className="flex items-center gap-2 px-4 py-6 overflow-x-auto no-scrollbar flex-shrink-0">
          <button className="flex items-center gap-2 px-4 h-10 rounded-2xl bg-white border border-gray-100 shadow-sm whitespace-nowrap active:scale-95 transition-transform">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1e40af" strokeWidth="2.5"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>
            <span className="text-sm font-bold text-price-blue-900 uppercase tracking-tighter">Filtros</span>
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 h-10 rounded-2xl text-sm font-bold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? "bg-price-blue-900 text-white shadow-lg shadow-price-blue-900/20"
                  : "bg-white text-gray-500 border border-gray-100 shadow-sm"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* View Switcher Buttons */}
        <div className="flex items-center justify-between px-4 mb-4 flex-shrink-0">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{filtered.length} productos encontrados</p>
          <div className="flex bg-white rounded-xl p-1 border border-gray-100 shadow-sm">
            <button 
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-price-blue-900 text-white shadow-lg" : "text-gray-400 active:bg-gray-50"}`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
              </svg>
            </button>
            <button 
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-price-blue-900 text-white shadow-lg" : "text-gray-400 active:bg-gray-50"}`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto px-4 pb-32">
          <div className={viewMode === "list" ? "flex flex-col gap-4" : "grid grid-cols-2 gap-4"}>
            {filtered.map((product) => (
              <MobileProductCard
                key={product.id}
                product={product}
                discount={discount}
                viewMode={viewMode}
                inCart={state.cart.find((i) => i.product.id === product.id)?.quantity}
                onAdd={() => addToCart(product)}
                onBuy={() => buyNow(product)}
                onDetail={() => openDetail(product)}
              />
            ))}
          </div>
        </div>

        {/* Bottom Nav */}
        <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-5 pt-2 pointer-events-none">
          <div className="pointer-events-auto bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.12)] border border-white/60 px-3 py-2 flex items-center">

            {/* Inicio */}
            <button className="flex-1 flex flex-col items-center justify-center gap-1 py-1 group">
              <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-price-blue-900 shadow-lg shadow-price-blue-900/30">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                </svg>
              </div>
              <span className="text-[10px] font-black text-price-blue-900 tracking-tight">Inicio</span>
            </button>

            {/* Tiendas */}
            <button
              onClick={() => dispatch({ type: "SET_VIEW", payload: "stores" })}
              className="flex-1 flex flex-col items-center justify-center gap-1 py-1 group"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-2xl group-active:bg-gray-100 transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-gray-600 transition-colors">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <span className="text-[10px] font-bold text-gray-400 tracking-tight group-hover:text-gray-600 transition-colors">Tiendas</span>
            </button>

            {/* Carrito */}
            <button
              onClick={() => dispatch({ type: "SET_VIEW", payload: "cart" })}
              className="flex-1 flex flex-col items-center justify-center gap-1 py-1 group"
            >
              <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl group-active:bg-gray-100 transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-gray-600 transition-colors">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 01-8 0"/>
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-price-pink-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-bold text-gray-400 tracking-tight group-hover:text-gray-600 transition-colors">Carrito</span>
            </button>

            {/* Cuenta */}
            <button onClick={() => dispatch({ type: "SET_VIEW", payload: "profile" })} className="flex-1 flex flex-col items-center justify-center gap-1 py-1 group">
              <div className="flex items-center justify-center w-10 h-10 rounded-2xl group-active:bg-gray-100 transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-gray-600 transition-colors">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <span className="text-[10px] font-bold text-gray-400 tracking-tight group-hover:text-gray-600 transition-colors">Cuenta</span>
            </button>

          </div>
        </div>
      </div>

      {/* ── DESKTOP ────────────────────────────────────────────────────── */}
      <div className="hidden md:flex flex-col h-full bg-gray-50 overflow-hidden">
        
        {/* Asymmetric Sophisticated Header */}
        <header className="bg-white border-b border-gray-100 flex items-stretch h-24 z-20 flex-shrink-0">
          {/* Brand Block */}
          <div className="bg-price-blue-900 w-80 flex items-center px-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-price-pink-500/10 rounded-full blur-2xl -mr-16 -mt-16 transition-transform group-hover:scale-110 duration-700" />
            <div className="relative z-10 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-xl">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
              </div>
              <div>
                <p className="text-[9px] font-bold text-price-blue-300 uppercase tracking-widest leading-none mb-1">Price Shoes Benefits</p>
                <p className="text-white text-xl font-black leading-none tracking-tight">{tenantName}</p>
              </div>
            </div>
          </div>

          {/* Main Search & Actions ToolBar */}
          <div className="flex-1 flex items-center px-8 gap-8">
            <div className="flex-1 max-w-2xl relative group flex items-center bg-gray-50 border-2 border-price-blue-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-price-blue-400 transition-all focus-within:bg-white focus-within:border-price-pink-500 focus-within:ring-8 focus-within:ring-price-pink-500/5">
              <div className="pl-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-price-blue-600 transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </div>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="¿Qué estás buscando hoy?"
                className="flex-1 bg-transparent pl-4 pr-6 py-4 text-sm font-bold placeholder:text-gray-400 outline-none"
              />
              <button className="self-stretch bg-price-pink-600 px-8 text-white text-[11px] font-black uppercase tracking-widest hover:bg-price-pink-700 transition-colors active:scale-95">
                Buscar
              </button>
            </div>

            <div className="flex items-center gap-6 ml-auto">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => dispatch({ type: "SET_VIEW", payload: "stores" })}
                  className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center relative hover:bg-white hover:border-price-blue-200 hover:shadow-lg hover:shadow-price-blue-900/5 transition-all group"
                  title="Tiendas"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-gray-500 group-hover:text-price-blue-600 transition-colors" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                </button>
                <button className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center relative hover:bg-white hover:border-price-blue-200 hover:shadow-lg hover:shadow-price-blue-900/5 transition-all group">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-gray-500 group-hover:text-price-blue-600 transition-colors" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
                </button>
                <button
                  onClick={() => dispatch({ type: "SET_VIEW", payload: "cart" })}
                  className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center relative hover:bg-white hover:border-price-blue-200 hover:shadow-lg hover:shadow-price-blue-900/5 transition-all group"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-gray-500 group-hover:text-price-blue-600 transition-colors" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
                  </svg>
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-price-pink-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                      {cartCount}
                    </span>
                  )}
                </button>
                <button className="w-12 h-12 rounded-2xl bg-price-blue-900 flex items-center justify-center text-white shadow-lg shadow-price-blue-900/20 hover:scale-105 transition-transform active:scale-95">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Sub-Header / Filters Bar */}
        <div className="bg-white border-b border-gray-100 px-8 flex items-center justify-between h-14 z-10 shadow-sm shadow-black/5 flex-shrink-0">
          <div className="flex items-center gap-8 h-full">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`h-full px-2 text-[11px] font-bold uppercase tracking-widest transition-all relative group ${
                  activeCategory === cat ? "text-price-blue-900" : "text-gray-400 hover:text-gray-700"
                }`}
              >
                {cat}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-price-blue-900 transition-transform duration-300 ${activeCategory === cat ? "scale-x-100" : "scale-x-0"}`} />
              </button>
            ))}
          </div>

          {discount > 0 && (
            <div className="flex items-center gap-3 bg-price-blue-50 px-4 h-9 rounded-xl border border-price-blue-100">
              <span className="text-sm">💎</span>
              <span className="text-[10px] font-bold text-price-blue-900 uppercase tracking-tighter">
                Beneficio Exclusivo: <span className="text-price-pink-600 ml-1">{discount}% OFF</span> en todo el catálogo
              </span>
            </div>
          )}
        </div>

        {/* Desktop Content Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Filter Sidebar */}
          <aside className="w-72 bg-white border-r border-gray-100 p-8 overflow-y-auto no-scrollbar hidden xl:flex flex-col gap-10">
            <div>
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-6">Filtrar por</h3>
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-bold text-gray-900 mb-4">Rango de Precio</p>
                  <div className="space-y-3">
                    {["Menos de $5,000", "$5,000 – $15,000", "$15,000 – $25,000", "Más de $25,000"].map((range) => (
                      <label key={range} className="flex items-center gap-3 group cursor-pointer">
                        <input type="checkbox" className="w-5 h-5 rounded-lg border-gray-200 text-price-blue-900 focus:ring-price-blue-500 accent-[#db2777] transition-all" />
                        <span className="text-xs font-medium text-gray-500 group-hover:text-gray-900 transition-colors">{range}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <p className="text-xs font-bold text-gray-900 mb-4">Estado</p>
                  <div className="space-y-3">
                    {["En stock", "Disponible hoy", "Envío inmediato"].map((opt) => (
                      <label key={opt} className="flex items-center gap-3 group cursor-pointer">
                        <input type="checkbox" defaultChecked className="w-5 h-5 rounded-lg border-gray-200 text-price-blue-900 focus:ring-price-blue-500 accent-[#db2777] transition-all" />
                        <span className="text-xs font-medium text-gray-500 group-hover:text-gray-900 transition-colors">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-auto bg-gradient-to-br from-price-blue-900 to-price-blue-800 rounded-3xl p-6 relative overflow-hidden text-white shadow-xl shadow-price-blue-900/20">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
              <p className="text-[10px] font-bold text-price-blue-300 uppercase tracking-widest mb-2">Ayuda</p>
              <p className="text-sm font-bold mb-4">¿Necesitas ayuda con tu pedido?</p>
              <button className="w-full bg-white/10 hover:bg-white/20 border border-white/20 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-colors">Contactar Soporte</button>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto p-10 bg-[#fbfbfb]">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-[10px] font-bold text-price-pink-600 uppercase tracking-[0.2em] mb-2">{activeCategory !== "Todos los productos" ? activeCategory : "Catálogo Completo"}</p>
                <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-none">Descubre tus Beneficios</h1>
              </div>
              <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-gray-100 shadow-sm shadow-black/[0.02]">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ordenar por</span>
                <select className="bg-transparent text-[10px] font-bold uppercase tracking-widest text-price-blue-900 outline-none cursor-pointer">
                  <option>Relevancia</option>
                  <option>Menor Precio</option>
                  <option>Mayor Precio</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
              {filtered.map((product) => (
                <DesktopProductCard
                  key={product.id}
                  product={product}
                  discount={discount}
                  inCart={state.cart.find((i) => i.product.id === product.id)?.quantity}
                  onAdd={() => addToCart(product)}
                  onBuy={() => buyNow(product)}
                  onDetail={() => openDetail(product)}
                />
              ))}
            </div>
          </main>
        </div>
      </div>
    </>
  )
}

/* ── REUSABLE CARDS ────────────────────────────────────────────────────── */

function MobileProductCard({
  product,
  discount,
  inCart,
  onAdd,
  onBuy,
  onDetail,
  viewMode,
}: {
  product: Product
  discount: number
  inCart?: number
  onAdd: () => void
  onBuy: () => void
  onDetail: () => void
  viewMode: "list" | "grid"
}) {
  const finalPrice = getDiscountedPrice(product.price, discount)

  if (viewMode === "grid") {
    return (
      <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm shadow-black/[0.03] p-3 group active:scale-[0.98] transition-all flex flex-col">
        {/* Image - Full Width */}
        <button
          onClick={onDetail}
          className="relative w-full aspect-square bg-gray-50 rounded-2xl overflow-hidden flex items-center justify-center group-hover:bg-price-blue-50 transition-colors mb-3"
        >
          {getProductImageUrl(product.image, "thumb") ? (
            <Image src={getProductImageUrl(product.image, "thumb")} alt={product.name} fill className="object-contain p-1" unoptimized />
          ) : (
            <span className="text-4xl">{categoryEmoji(product.category)}</span>
          )}
        </button>

        {/* Details */}
        <div className="flex flex-col min-w-0 gap-2">
          <button onClick={onDetail} className="text-left">
            <p className="text-[8px] font-bold text-price-pink-600 uppercase tracking-widest mb-1">{product.category}</p>
            <p className="text-xs font-bold text-gray-900 leading-tight line-clamp-2">{product.name}</p>
          </button>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm font-black text-price-blue-900 tracking-tight">{formatMXN(finalPrice)}</span>
              {discount > 0 && (
                <span className="text-[10px] text-gray-400 line-through font-medium">{formatMXN(product.price)}</span>
              )}
            </div>

            <button
              onClick={onAdd}
              className={`w-full h-8 rounded-lg flex items-center justify-center gap-1.5 transition-all active:scale-90 border ${
                inCart
                  ? "bg-price-blue-900 text-white border-price-blue-900 shadow-lg shadow-price-blue-900/20"
                  : "bg-white text-price-blue-900 border-gray-200"
              }`}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
                {inCart ? <path d="M16 10a4 4 0 01-8 0"/> : <path d="M12 11v4M10 13h4"/>}
              </svg>
              <span className="text-[10px] font-black uppercase tracking-tight">{inCart ? inCart : "Añadir"}</span>
            </button>

            <button
              onClick={onBuy}
              className="w-full h-8 rounded-lg bg-price-pink-600 text-white text-[10px] font-black uppercase tracking-tight shadow-lg shadow-price-pink-600/20 active:scale-95 transition-all"
            >
              Comprar Ahora
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm shadow-black/[0.03] p-3 group active:scale-[0.98] transition-all">
      <div className="flex gap-4">
        {/* Image */}
        <button
          onClick={onDetail}
          className="relative flex-shrink-0 bg-gray-50 rounded-2xl overflow-hidden flex items-center justify-center group-hover:bg-price-blue-50 transition-colors"
          style={{ width: 100, height: 100 }}
        >
          {getProductImageUrl(product.image, "thumb") ? (
            <Image src={getProductImageUrl(product.image, "thumb")} alt={product.name} fill className="object-contain p-1" unoptimized />
          ) : (
            <span className="text-3xl">{categoryEmoji(product.category)}</span>
          )}
        </button>

        {/* Details */}
        <div className="flex-1 py-1 flex flex-col justify-between min-w-0">
          <button onClick={onDetail} className="text-left">
            <p className="text-[10px] font-bold text-price-pink-600 uppercase tracking-widest mb-1">{product.category}</p>
            <p className="text-base font-bold text-gray-900 leading-tight line-clamp-2 mb-2">{product.name}</p>
          </button>

          <div className="mt-auto flex flex-col gap-3">
            {/* Price Row */}
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-black text-price-blue-900 tracking-tight">{formatMXN(finalPrice)}</span>
              {discount > 0 && (
                <span className="text-xs text-gray-400 line-through font-medium">{formatMXN(product.price)}</span>
              )}
            </div>

            {/* Buttons Row - Aligned Right */}
            <div className="flex gap-2 justify-end">
              <button
                onClick={onAdd}
                className={`h-9 rounded-xl flex items-center justify-center gap-1.5 transition-all active:scale-90 border ${
                  inCart 
                    ? "bg-price-blue-900 text-white border-price-blue-900 shadow-lg shadow-price-blue-900/20 px-3" 
                    : "bg-white text-price-blue-900 border-gray-200 hover:bg-price-blue-50 px-3"
                }`}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
                  {inCart ? <path d="M16 10a4 4 0 01-8 0"/> : <path d="M12 11v4M10 13h4"/>}
                </svg>
                {inCart ? (
                  <span className="text-xs font-black">{inCart}</span>
                ) : (
                  <span className="text-xs font-black uppercase tracking-tight">Añadir</span>
                )}
              </button>
              <button
                onClick={onBuy}
                className="px-5 h-9 rounded-xl bg-price-pink-600 text-white text-[10px] font-black uppercase tracking-wider shadow-lg shadow-price-pink-600/20 active:scale-95 transition-all"
              >
                Comprar Ahora
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function DesktopProductCard({
  product,
  discount,
  inCart,
  onAdd,
  onBuy,
  onDetail,
}: {
  product: Product
  discount: number
  inCart?: number
  onAdd: () => void
  onBuy: () => void
  onDetail: () => void
}) {
  const finalPrice = getDiscountedPrice(product.price, discount)

  return (
    <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden flex flex-col p-4 shadow-sm hover:shadow-2xl hover:shadow-price-blue-900/10 transition-all duration-500 group">
      {/* Image */}
      <button onClick={onDetail} className="relative w-full bg-gray-50 rounded-[2rem] overflow-hidden flex items-center justify-center mb-5 group-hover:bg-price-blue-50 transition-colors" style={{ height: 220 }}>
        {getProductImageUrl(product.image, "thumb") ? (
          <Image src={getProductImageUrl(product.image, "thumb")} alt={product.name} fill className="object-contain p-3 transition-transform duration-700" unoptimized />
        ) : (
          <span className="text-7xl group-hover:scale-125 transition-transform duration-700">{categoryEmoji(product.category)}</span>
        )}
      </button>

      {/* Details */}
      <div className="px-2 flex flex-col gap-1 flex-1">
        <button onClick={onDetail} className="text-left group">
          <p className="text-[10px] font-bold text-price-pink-600 uppercase tracking-[0.2em] mb-2">{product.category}</p>
          <p className="text-lg font-bold text-gray-900 leading-tight line-clamp-2 group-hover:text-price-blue-600 transition-colors">{product.name}</p>
        </button>
        
        <div className="mt-4 flex flex-col gap-4">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-price-blue-900 tracking-tighter">{formatMXN(finalPrice)}</span>
            {discount > 0 && (
              <span className="text-sm text-gray-400 line-through font-medium">{formatMXN(product.price)}</span>
            )}
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={onAdd}
              className={`flex-1 h-12 rounded-xl flex items-center justify-center gap-1.5 transition-all active:scale-95 border-2 ${
                inCart
                  ? "bg-price-blue-900 text-white border-price-blue-900 shadow-lg shadow-price-blue-900/20"
                  : "bg-white text-price-blue-900 border-gray-100 hover:bg-price-blue-50 hover:border-price-blue-200"
              }`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
                {inCart ? <path d="M16 10a4 4 0 01-8 0"/> : <path d="M12 11v4M10 13h4"/>}
              </svg>
              {inCart ? (
                <span className="text-xs font-black">{inCart}</span>
              ) : (
                <span className="text-xs font-black uppercase tracking-tight">Añadir</span>
              )}
            </button>
            <button
              onClick={onBuy}
              className="flex-1 h-12 rounded-xl bg-price-pink-600 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-price-pink-600/20 hover:bg-price-pink-700 hover:scale-[1.02] transition-all active:scale-95"
            >
              Comprar Ahora
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function categoryEmoji(category?: string): string {
  switch (category) {
    case "Calzado": return "👟"
    case "Ropa": return "👕"
    case "Accesorios": return "👜"
    default: return "📦"
  }
}
