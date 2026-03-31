"use client"

import { useApp } from "@/context/AppContext"
import { tenants, formatMXN, getDiscountedPrice, getProductImageUrl } from "@/lib/mock-data"
import Image from "next/image"

export default function CheckoutView() {
  const { state, dispatch } = useApp()

  const discount = state.currentUser
    ? (tenants.find((t) => t.id === state.currentUser!.tenantId)?.discount ?? 0)
    : 0

  const subtotal = state.cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )
  const discountAmount = Math.round(subtotal * (discount / 100))
  const total = subtotal - discountAmount

  const tenantName = state.currentUser
    ? tenants.find((t) => t.id === state.currentUser!.tenantId)?.name ?? "Price Shoes Benefits"
    : "Price Shoes Benefits"

  const cartCount = state.cart.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <>
      {/* ── MOBILE ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col h-full md:hidden bg-gray-50">

        {/* Atmospheric Header */}
        <div className="relative bg-price-blue-900 pt-6 pb-8 px-4 overflow-hidden shadow-xl shadow-price-blue-900/20 flex-shrink-0">
          <div className="absolute top-0 right-0 w-48 h-48 bg-price-pink-500/10 rounded-full blur-3xl -mr-10 -mt-10" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-price-blue-400/10 rounded-full blur-2xl -ml-10 -mb-10" />

          <div className="relative z-10 flex items-center gap-3">
            <button
              onClick={() => dispatch({ type: "SET_VIEW", payload: "cart" })}
              className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white active:scale-90 transition-transform"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
            </button>
            <div className="flex-1">
              <p className="text-[10px] font-bold text-price-blue-300 uppercase tracking-widest leading-none mb-1">Price Shoes Benefits</p>
              <p className="text-white text-lg font-bold leading-none">Tu Orden</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center">
              <span className="text-white text-sm font-black">{cartCount}</span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 pb-36 flex flex-col gap-4">

          {/* Order items */}
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm shadow-black/[0.03]">
            <div className="px-5 py-4 border-b border-gray-50 rounded-t-[2rem]">
              <p className="text-[10px] font-bold text-price-pink-600 uppercase tracking-widest mb-0.5">Resumen</p>
              <h2 className="text-base font-black text-gray-900">Productos en tu orden</h2>
            </div>
            {state.cart.map((item) => {
              const finalPrice = getDiscountedPrice(item.product.price, discount)
              return (
                <div key={item.product.id} className="px-5 py-4 flex items-center gap-3 border-b border-gray-50 last:border-b-0">
                  {/* Thumbnail */}
                  <div className="relative w-14 h-14 rounded-2xl bg-gray-50 flex-shrink-0 overflow-hidden border border-gray-100">
                    {getProductImageUrl(item.product.image, "thumb") ? (
                      <Image src={getProductImageUrl(item.product.image, "thumb")} alt={item.product.name} fill className="object-cover" unoptimized />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl">📦</div>
                    )}
                  </div>
                  {/* Name + quantity */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-800 line-clamp-2 leading-tight">{item.product.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      <span className="font-black text-price-blue-900">×{item.quantity}</span>
                      {" · "}{formatMXN(finalPrice)} c/u
                    </p>
                  </div>
                  <span className="text-sm font-black text-price-blue-900 flex-shrink-0 whitespace-nowrap">
                    {formatMXN(finalPrice * item.quantity)}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Delivery method */}
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm shadow-black/[0.03]">
            <div className="px-5 py-4 border-b border-gray-50">
              <p className="text-[10px] font-bold text-price-pink-600 uppercase tracking-widest mb-0.5">Entrega</p>
              <h2 className="text-base font-black text-gray-900">Método de entrega</h2>
            </div>
            <div className="px-5 py-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-price-blue-50 flex items-center justify-center flex-shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-base font-black text-gray-900">Retiro en tienda</p>
                <p className="text-sm text-gray-500">Tienda Hermosillo Norte</p>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          </div>

          {/* AI Availability recommendation */}
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm shadow-black/[0.03]">
            <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-price-blue-900 flex items-center justify-center flex-shrink-0">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
                </svg>
              </div>
              <div>
                <p className="text-[10px] font-bold text-price-pink-600 uppercase tracking-widest leading-none mb-0.5">Recomendación</p>
                <h2 className="text-base font-black text-gray-900 leading-none">Disponibilidad en tienda</h2>
              </div>
            </div>
            <div className="px-5 py-4 flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-price-pink-500 flex-shrink-0 mt-1.5" />
                <p className="text-sm text-gray-600">Laptop Pro y Smartphone X están <span className="font-bold text-gray-900">disponibles hoy</span>.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 flex-shrink-0 mt-1.5" />
                <p className="text-sm text-gray-600">Audífonos Premium disponible en <span className="font-bold text-gray-900">2 días hábiles</span>.</p>
              </div>
            </div>
          </div>

          {/* Totals */}
          <div className="bg-white rounded-[2rem] border border-gray-100 p-5 shadow-sm shadow-black/[0.03] flex flex-col gap-3">
            <div className="flex justify-between text-base text-gray-500">
              <span>Subtotal</span>
              <span>{formatMXN(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-base font-bold text-price-pink-600">
                <span>💎 Beneficio {discount}%</span>
                <span>-{formatMXN(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-black text-gray-900 pt-2 border-t border-gray-100">
              <span>Total</span>
              <span className="text-price-pink-600">{formatMXN(total)}</span>
            </div>
          </div>
        </div>

        {/* Floating CTA */}
        <div className="fixed bottom-0 left-0 right-0 md:hidden px-4 pb-5 pt-2 z-50">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.12)] border border-white/60 px-4 py-3">
            <button
              onClick={() => dispatch({ type: "SET_VIEW", payload: "payment" })}
              className="w-full py-4 rounded-2xl bg-price-pink-600 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-price-pink-600/20 active:scale-95 transition-all"
            >
              Ir a pagar · {formatMXN(total)}
            </button>
          </div>
        </div>
      </div>

      {/* ── DESKTOP ────────────────────────────────────────────────────── */}
      <div className="hidden md:flex flex-col h-full bg-gray-50 overflow-hidden">

        {/* Header — mismo estilo que CatalogView */}
        <header className="bg-white border-b border-gray-100 flex items-stretch h-24 z-20 flex-shrink-0">
          <div className="bg-price-blue-900 w-80 flex items-center px-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-price-pink-500/10 rounded-full blur-2xl -mr-16 -mt-16" />
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

          <div className="flex-1 flex items-center px-8 gap-8">
            <button
              onClick={() => dispatch({ type: "SET_VIEW", payload: "cart" })}
              className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-price-blue-900 transition-colors group"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-0.5 transition-transform">
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
              Volver al carrito
            </button>

            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Tu Orden</h1>

            <div className="flex items-center gap-3 ml-auto">
              <button className="w-12 h-12 rounded-2xl bg-price-blue-900 flex items-center justify-center text-white shadow-lg shadow-price-blue-900/20 hover:scale-105 transition-transform active:scale-95">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto p-10">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-3 gap-8">

              {/* Left col */}
              <div className="col-span-2 flex flex-col gap-6">

                {/* Order items */}
                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm">
                  <div className="px-8 py-5 border-b border-gray-100">
                    <p className="text-[10px] font-bold text-price-pink-600 uppercase tracking-[0.2em] mb-1">Resumen</p>
                    <h2 className="text-xl font-black text-gray-900">Productos en tu orden</h2>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {state.cart.map((item) => {
                      const finalPrice = getDiscountedPrice(item.product.price, discount)
                      return (
                        <div key={item.product.id} className="px-8 py-5 flex items-center justify-between group hover:bg-gray-50/50 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="relative w-14 h-14 rounded-2xl bg-gray-50 flex-shrink-0 overflow-hidden">
                              {getProductImageUrl(item.product.image, "thumb") ? (
                                <Image src={getProductImageUrl(item.product.image, "thumb")} alt={item.product.name} fill className="object-cover" unoptimized />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-900 line-clamp-1 group-hover:text-price-blue-600 transition-colors">{item.product.name}</p>
                              <p className="text-xs text-gray-400 mt-0.5">Cantidad: {item.quantity} · {formatMXN(finalPrice)} c/u</p>
                            </div>
                          </div>
                          <span className="text-sm font-black text-gray-900">{formatMXN(finalPrice * item.quantity)}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Delivery method */}
                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm">
                  <div className="px-8 py-5 border-b border-gray-100">
                    <p className="text-[10px] font-bold text-price-pink-600 uppercase tracking-[0.2em] mb-1">Entrega</p>
                    <h2 className="text-xl font-black text-gray-900">Método de entrega</h2>
                  </div>
                  <div className="px-8 py-6">
                    <div className="flex items-center gap-5 p-5 bg-price-blue-50 rounded-2xl border border-price-blue-100">
                      <div className="w-14 h-14 rounded-2xl bg-price-blue-900/10 flex items-center justify-center flex-shrink-0">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-black text-gray-900">Retiro en tienda</p>
                        <p className="text-xs text-gray-500 mt-0.5">Tienda Hermosillo Norte · Av. López Portillo #45</p>
                      </div>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* AI Availability recommendation */}
                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm">
                  <div className="px-8 py-5 border-b border-gray-100 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-price-blue-900 flex items-center justify-center flex-shrink-0">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-price-pink-600 uppercase tracking-[0.2em] leading-none mb-1">Recomendación</p>
                      <h2 className="text-xl font-black text-gray-900 leading-none">Disponibilidad en tienda</h2>
                    </div>
                  </div>
                  <div className="px-8 py-6 flex flex-col gap-4">
                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl">
                      <span className="w-3 h-3 rounded-full bg-price-pink-500 flex-shrink-0 mt-1" />
                      <p className="text-sm text-gray-600">Laptop Pro y Smartphone X están <span className="font-black text-gray-900">disponibles hoy</span> para retiro inmediato.</p>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl">
                      <span className="w-3 h-3 rounded-full bg-amber-400 flex-shrink-0 mt-1" />
                      <p className="text-sm text-gray-600">Audífonos Premium disponible en <span className="font-black text-gray-900">2 días hábiles</span>.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order summary */}
              <div className="col-span-1">
                <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 sticky top-6 shadow-sm flex flex-col gap-6">
                  <div>
                    <p className="text-[10px] font-bold text-price-pink-600 uppercase tracking-[0.2em] mb-1">Detalle</p>
                    <h2 className="text-xl font-black text-gray-900">Tu pedido</h2>
                  </div>

                  {/* Items list — scrollable si hay muchos */}
                  <div className="flex flex-col gap-2 max-h-48 overflow-y-auto -mx-2 px-2">
                    {state.cart.map((item) => {
                      const finalPrice = getDiscountedPrice(item.product.price, discount)
                      return (
                        <div key={item.product.id} className="flex items-center gap-3 py-1.5">
                          <div className="relative w-10 h-10 rounded-xl bg-gray-50 flex-shrink-0 overflow-hidden border border-gray-100">
                            {getProductImageUrl(item.product.image, "thumb") ? (
                              <Image src={getProductImageUrl(item.product.image, "thumb")} alt={item.product.name} fill className="object-cover" unoptimized />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-base">📦</div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-gray-800 truncate">{item.product.name}</p>
                            <p className="text-xs text-gray-400"><span className="font-black text-price-blue-900">×{item.quantity}</span></p>
                          </div>
                          <span className="text-xs font-black text-gray-900 flex-shrink-0">{formatMXN(finalPrice * item.quantity)}</span>
                        </div>
                      )
                    })}
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between text-base text-gray-500">
                      <span>Subtotal</span>
                      <span>{formatMXN(subtotal)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-base font-bold text-price-pink-600">
                        <span>💎 Beneficio {discount}%</span>
                        <span>-{formatMXN(discountAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-xl font-black text-gray-900 pt-3 border-t border-gray-100">
                      <span>Total</span>
                      <span className="text-price-pink-600">{formatMXN(total)}</span>
                    </div>
                  </div>

                  {discount > 0 && (
                    <div className="bg-price-blue-50 border border-price-blue-100 rounded-2xl px-4 py-3 flex items-center gap-2">
                      <span className="text-sm">💎</span>
                      <span className="text-xs font-bold text-price-blue-900">
                        Beneficio Exclusivo: {discount}% OFF aplicado
                      </span>
                    </div>
                  )}

                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => dispatch({ type: "SET_VIEW", payload: "payment" })}
                      className="w-full py-4 rounded-2xl bg-price-pink-600 text-white font-black text-sm uppercase tracking-widest shadow-lg shadow-price-pink-600/20 hover:bg-price-pink-700 hover:scale-[1.02] transition-all active:scale-95"
                    >
                      Ir a pagar
                    </button>
                    <button
                      onClick={() => dispatch({ type: "SET_VIEW", payload: "cart" })}
                      className="w-full py-3.5 rounded-2xl border-2 border-gray-100 text-gray-500 font-bold text-sm hover:bg-gray-50 hover:border-gray-200 transition-all"
                    >
                      Volver al carrito
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  )
}
