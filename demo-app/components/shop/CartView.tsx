"use client"

import { useApp } from "@/context/AppContext"
import { tenants, formatMXN, getDiscountedPrice, getProductImageUrl } from "@/lib/mock-data"
import Image from "next/image"

export default function CartView() {
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
              onClick={() => dispatch({ type: "SET_VIEW", payload: "catalog" })}
              className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white active:scale-90 transition-transform"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
            </button>
            <div className="flex-1">
              <p className="text-[10px] font-bold text-price-blue-300 uppercase tracking-widest leading-none mb-1">Price Shoes Benefits</p>
              <p className="text-white text-lg font-bold leading-none">Mi Carrito</p>
            </div>
            {cartCount > 0 && (
              <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center">
                <span className="text-white text-sm font-black">{cartCount}</span>
              </div>
            )}
          </div>
        </div>

        {state.cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-6 px-8 text-center">
            <div className="w-24 h-24 rounded-3xl bg-white border border-gray-100 shadow-sm flex items-center justify-center">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
            </div>
            <div>
              <p className="text-gray-900 font-bold mb-1">Tu carrito está vacío</p>
              <p className="text-gray-400 text-sm">Agrega productos desde el catálogo</p>
            </div>
            <button
              onClick={() => dispatch({ type: "SET_VIEW", payload: "catalog" })}
              className="px-8 py-3.5 rounded-2xl bg-price-pink-600 text-white text-base font-black uppercase tracking-wider shadow-lg shadow-price-pink-600/20 active:scale-95 transition-all"
            >
              Ver catálogo
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-4 py-4 pb-48 flex flex-col gap-3">
              {state.cart.map((item) => {
                const finalPrice = getDiscountedPrice(item.product.price, discount)
                return (
                  <div key={item.product.id} className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm shadow-black/[0.03] p-3">
                    <div className="flex gap-4">
                      <div className="relative flex-shrink-0 bg-gray-50 rounded-2xl overflow-hidden flex items-center justify-center" style={{ width: 80, height: 80 }}>
                        {getProductImageUrl(item.product.image, "thumb") ? (
                          <Image src={getProductImageUrl(item.product.image, "thumb")} alt={item.product.name} fill className="object-cover" unoptimized />
                        ) : (
                          <span className="text-2xl">📦</span>
                        )}
                      </div>
                      <div className="flex-1 py-1 flex flex-col justify-between min-w-0">
                        <div>
                          <p className="text-[10px] font-bold text-price-pink-600 uppercase tracking-widest mb-1">{item.product.category}</p>
                          <p className="text-base font-bold text-gray-900 leading-tight line-clamp-2">{item.product.name}</p>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-baseline gap-2">
                            <span className="text-base font-black text-price-blue-900 tracking-tight">{formatMXN(finalPrice)}</span>
                            {discount > 0 && (
                              <span className="text-xs text-gray-400 line-through">{formatMXN(item.product.price)}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => dispatch({ type: "UPDATE_QUANTITY", payload: { productId: item.product.id, quantity: item.quantity - 1 } })}
                              className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 font-black text-base active:scale-90 transition-transform"
                            >
                              −
                            </button>
                            <span className="text-sm font-black text-gray-900 w-5 text-center">{item.quantity}</span>
                            <button
                              onClick={() => dispatch({ type: "UPDATE_QUANTITY", payload: { productId: item.product.id, quantity: item.quantity + 1 } })}
                              className="w-8 h-8 rounded-xl bg-price-blue-900 text-white flex items-center justify-center font-black text-base active:scale-90 transition-transform"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Summary + CTA */}
            <div className="fixed bottom-0 left-0 right-0 md:hidden px-4 pb-5 pt-2 z-50">
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.12)] border border-white/60 px-5 py-4 flex flex-col gap-3">
                <div className="flex flex-col gap-2">
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
                <button
                  onClick={() => dispatch({ type: "SET_VIEW", payload: "checkout" })}
                  className="w-full py-4 rounded-2xl bg-price-pink-600 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-price-pink-600/20 active:scale-95 transition-all"
                >
                  Continuar · {formatMXN(total)}
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── DESKTOP ────────────────────────────────────────────────────── */}
      <div className="hidden md:flex flex-col h-full bg-gray-50 overflow-hidden">

        {/* Header — mismo estilo que CatalogView */}
        <header className="bg-white border-b border-gray-100 flex items-stretch h-24 z-20 flex-shrink-0">
          {/* Brand Block */}
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

          {/* Toolbar */}
          <div className="flex-1 flex items-center px-8 gap-8">
            <button
              onClick={() => dispatch({ type: "SET_VIEW", payload: "catalog" })}
              className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-price-blue-900 transition-colors group"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-0.5 transition-transform">
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
              Seguir comprando
            </button>

            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Mi Carrito</h1>

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
          <div className="max-w-6xl mx-auto">

            {state.cart.length === 0 ? (
              <div className="bg-white rounded-[2.5rem] border border-gray-100 p-16 flex flex-col items-center justify-center gap-6 text-center shadow-sm">
                <div className="w-28 h-28 rounded-3xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                  <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 01-8 0" />
                  </svg>
                </div>
                <div>
                  <p className="text-xl font-black text-gray-900 mb-2">Tu carrito está vacío</p>
                  <p className="text-gray-400 text-sm">Agrega productos desde el catálogo para comenzar</p>
                </div>
                <button
                  onClick={() => dispatch({ type: "SET_VIEW", payload: "catalog" })}
                  className="px-10 py-4 rounded-2xl bg-price-pink-600 text-white font-black text-sm uppercase tracking-widest shadow-lg shadow-price-pink-600/20 hover:bg-price-pink-700 hover:scale-[1.02] transition-all active:scale-95"
                >
                  Ver catálogo
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-8">

                {/* Cart items */}
                <div className="col-span-2 bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm">
                  <div className="px-8 py-5 border-b border-gray-100">
                    <p className="text-[10px] font-bold text-price-pink-600 uppercase tracking-[0.2em] mb-1">Resumen</p>
                    <h2 className="text-xl font-black text-gray-900">Productos <span className="text-gray-400 font-bold">({cartCount})</span></h2>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {state.cart.map((item) => {
                      const finalPrice = getDiscountedPrice(item.product.price, discount)
                      return (
                        <div key={item.product.id} className="px-8 py-5 flex items-center gap-6 group hover:bg-gray-50/50 transition-colors">
                          <div className="relative w-20 h-20 rounded-2xl bg-gray-50 flex-shrink-0 overflow-hidden group-hover:bg-price-blue-50 transition-colors">
                            {getProductImageUrl(item.product.image, "thumb") ? (
                              <Image src={getProductImageUrl(item.product.image, "thumb")} alt={item.product.name} fill className="object-cover" unoptimized />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-3xl">📦</div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-bold text-price-pink-600 uppercase tracking-widest mb-1">{item.product.category}</p>
                            <p className="text-sm font-bold text-gray-900 line-clamp-2 group-hover:text-price-blue-600 transition-colors">{item.product.name}</p>
                            <div className="flex items-baseline gap-2 mt-1">
                              <span className="text-base font-black text-price-blue-900">{formatMXN(finalPrice)}</span>
                              {discount > 0 && (
                                <span className="text-xs text-gray-400 line-through">{formatMXN(item.product.price)}</span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            <button
                              onClick={() => dispatch({ type: "UPDATE_QUANTITY", payload: { productId: item.product.id, quantity: item.quantity - 1 } })}
                              className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 font-black text-base transition-colors active:scale-90"
                            >
                              −
                            </button>
                            <span className="text-base font-black text-gray-900 w-6 text-center">{item.quantity}</span>
                            <button
                              onClick={() => dispatch({ type: "UPDATE_QUANTITY", payload: { productId: item.product.id, quantity: item.quantity + 1 } })}
                              className="w-9 h-9 rounded-xl bg-price-blue-900 text-white flex items-center justify-center font-black text-base hover:bg-price-blue-800 transition-colors active:scale-90"
                            >
                              +
                            </button>
                          </div>
                          <div className="text-right min-w-[90px]">
                            <p className="text-sm font-black text-gray-900">{formatMXN(finalPrice * item.quantity)}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Order summary */}
                <div className="col-span-1">
                  <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 sticky top-6 shadow-sm flex flex-col gap-6">
                    <div>
                      <p className="text-[10px] font-bold text-price-pink-600 uppercase tracking-[0.2em] mb-1">Detalle</p>
                      <h2 className="text-xl font-black text-gray-900">Tu pedido</h2>
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
                        onClick={() => dispatch({ type: "SET_VIEW", payload: "checkout" })}
                        className="w-full py-4 rounded-2xl bg-price-pink-600 text-white font-black text-sm uppercase tracking-widest shadow-lg shadow-price-pink-600/20 hover:bg-price-pink-700 hover:scale-[1.02] transition-all active:scale-95"
                      >
                        Continuar a pagar
                      </button>
                      <button
                        onClick={() => dispatch({ type: "SET_VIEW", payload: "catalog" })}
                        className="w-full py-3.5 rounded-2xl border-2 border-gray-100 text-gray-500 font-bold text-sm hover:bg-gray-50 hover:border-gray-200 transition-all"
                      >
                        Seguir comprando
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
