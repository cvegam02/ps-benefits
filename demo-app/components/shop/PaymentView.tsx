"use client"

import { useRef, useState } from "react"
import { useApp } from "@/context/AppContext"
import { tenants, formatMXN, getDiscountedPrice } from "@/lib/mock-data"

const PAYMENT_METHODS = [
  { id: "tarjeta",      label: "Tarjeta crédito / débito", icon: "💳" },
  { id: "oxxo",         label: "OXXO Pay",                  icon: "🏪" },
  { id: "spei",         label: "SPEI / Transferencia",      icon: "🏦" },
  { id: "meses",        label: "Meses sin intereses",        icon: "📆" },
  { id: "mercadopago",  label: "Mercado Pago",               icon: "🔵" },
]

export default function PaymentView() {
  const { state, dispatch } = useApp()
  const [selectedMethod, setSelectedMethod] = useState("tarjeta")
  const [installments, setInstallments] = useState(3)

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

  // Swipe state
  const trackRef = useRef<HTMLDivElement>(null)
  const [swipeX, setSwipeX] = useState(0)
  const [swiping, setSwiping] = useState(false)
  const startXRef = useRef(0)
  const HANDLE_SIZE = 52
  const THRESHOLD = 0.75

  function getTrackWidth() {
    return (trackRef.current?.offsetWidth ?? 300) - HANDLE_SIZE - 8
  }

  function onPointerDown(e: React.PointerEvent) {
    setSwiping(true)
    startXRef.current = e.clientX - swipeX
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!swiping) return
    const newX = Math.max(0, Math.min(e.clientX - startXRef.current, getTrackWidth()))
    setSwipeX(newX)
  }

  function onPointerUp() {
    if (!swiping) return
    setSwiping(false)
    if (swipeX / getTrackWidth() >= THRESHOLD) {
      confirmPayment()
    } else {
      setSwipeX(0)
    }
  }

  function confirmPayment() {
    if (!state.currentUser) return
    const tenant = tenants.find((t) => t.id === state.currentUser!.tenantId)
    dispatch({
      type: "CREATE_ORDER",
      payload: {
        userId: state.currentUser.id,
        userName: state.currentUser.name,
        tenantId: state.currentUser.tenantId,
        tenantName: tenant?.name ?? "",
        items: state.cart,
        paymentMethod: selectedMethod,
      },
    })
    dispatch({ type: "SET_VIEW", payload: "processing" })
  }

  const swipeRatio = swipeX / Math.max(getTrackWidth(), 1)

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
              onClick={() => dispatch({ type: "SET_VIEW", payload: "checkout" })}
              className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white active:scale-90 transition-transform"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
            </button>
            <div className="flex-1">
              <p className="text-[10px] font-bold text-price-blue-300 uppercase tracking-widest leading-none mb-1">Price Shoes Benefits</p>
              <p className="text-white text-lg font-bold leading-none">Método de pago</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 pb-36 flex flex-col gap-4">

          {/* Payment method selection — accordion */}
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm shadow-black/[0.03]">
            <div className="px-5 py-4 border-b border-gray-50">
              <p className="text-[10px] font-bold text-price-pink-600 uppercase tracking-widest mb-0.5">Pago</p>
              <h2 className="text-base font-black text-gray-900">Selecciona un método</h2>
            </div>
            {PAYMENT_METHODS.map((method, idx) => (
              <div key={method.id} className={idx < PAYMENT_METHODS.length - 1 ? "border-b border-gray-50" : ""}>
                <button
                  onClick={() => setSelectedMethod(method.id)}
                  className={`w-full px-5 py-4 flex items-center gap-3 text-left transition-colors ${
                    selectedMethod === method.id ? "bg-price-blue-50" : "hover:bg-gray-50 active:bg-gray-100"
                  }`}
                >
                  <span className="text-xl w-7 text-center flex-shrink-0">{method.icon}</span>
                  <span className="text-base font-medium text-gray-800 flex-1">{method.label}</span>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                    selectedMethod === method.id ? "border-price-blue-900 bg-price-blue-900" : "border-gray-200"
                  }`}>
                    {selectedMethod === method.id && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </button>

                {/* Inline detail panel */}
                {selectedMethod === method.id && (
                  <div className="px-5 pb-5 pt-1 bg-price-blue-50 flex flex-col gap-3">
                    {method.id === "tarjeta" && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1.5">Número de tarjeta</label>
                          <input type="text" placeholder="•••• •••• •••• ••••" maxLength={19}
                            className="w-full px-4 py-3 rounded-2xl border border-gray-100 text-base outline-none focus:border-price-blue-400 transition font-mono tracking-wider bg-white" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1.5">Vencimiento</label>
                            <input type="text" placeholder="MM / AA" maxLength={7}
                              className="w-full px-4 py-3 rounded-2xl border border-gray-100 text-base outline-none focus:border-price-blue-400 transition bg-white" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1.5">CVV</label>
                            <input type="text" placeholder="•••" maxLength={4}
                              className="w-full px-4 py-3 rounded-2xl border border-gray-100 text-base outline-none focus:border-price-blue-400 transition bg-white" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1.5">Nombre en la tarjeta</label>
                          <input type="text" placeholder="NOMBRE APELLIDO"
                            className="w-full px-4 py-3 rounded-2xl border border-gray-100 text-base outline-none focus:border-price-blue-400 transition bg-white uppercase" />
                        </div>
                      </>
                    )}
                    {method.id === "oxxo" && (
                      <>
                        <p className="text-sm text-gray-500">Presenta este número en cualquier tienda OXXO.</p>
                        <div className="bg-white rounded-2xl px-5 py-4 border border-gray-100">
                          <span className="text-xl font-black text-price-blue-900 tracking-widest font-mono">8512 7634 9021 4857</span>
                        </div>
                        <p className="text-xs text-gray-400">Válido por 48 horas · Costo adicional de $13.00</p>
                      </>
                    )}
                    {method.id === "spei" && (
                      <>
                        <div className="bg-white rounded-2xl px-5 py-3 border border-gray-100">
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">CLABE interbancaria</p>
                          <p className="text-base font-black text-price-blue-900 font-mono tracking-wider">0021 8000 1234 5678 90</p>
                        </div>
                        <div className="bg-white rounded-2xl px-5 py-3 border border-gray-100">
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Banco</p>
                          <p className="text-base font-bold text-gray-900">BBVA Bancomer</p>
                        </div>
                        <div className="bg-white rounded-2xl px-5 py-3 border border-gray-100">
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Concepto</p>
                          <p className="text-base font-bold text-gray-900">Price Shoes Benefits · {state.currentUser?.name}</p>
                        </div>
                      </>
                    )}
                    {method.id === "meses" && (
                      <>
                        <div className="flex gap-3">
                          {[3, 6, 12].map((m) => (
                            <button
                              key={m}
                              onClick={(e) => { e.stopPropagation(); setInstallments(m) }}
                              className={`flex-1 py-3 rounded-2xl font-black text-base transition-all active:scale-95 ${
                                installments === m
                                  ? "bg-price-blue-900 text-white shadow-lg shadow-price-blue-900/20"
                                  : "bg-white text-gray-500 border border-gray-100"
                              }`}
                            >
                              {m}m
                            </button>
                          ))}
                        </div>
                        <div className="bg-white rounded-2xl px-5 py-3 border border-price-blue-100 flex justify-between items-center">
                          <span className="text-sm font-bold text-price-blue-900">Pago mensual</span>
                          <span className="text-lg font-black text-price-blue-900">{formatMXN(Math.ceil(total / installments))}</span>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1.5">Número de tarjeta</label>
                          <input type="text" placeholder="•••• •••• •••• ••••" maxLength={19}
                            className="w-full px-4 py-3 rounded-2xl border border-gray-100 text-base outline-none focus:border-price-blue-400 transition font-mono tracking-wider bg-white" />
                        </div>
                      </>
                    )}
                    {method.id === "mercadopago" && (
                      <>
                        <p className="text-sm text-gray-500">Serás redirigido a Mercado Pago para completar tu pago de forma segura.</p>
                        <button
                          onClick={confirmPayment}
                          className="w-full py-4 rounded-2xl font-black text-base text-white shadow-lg active:scale-95 transition-all"
                          style={{ backgroundColor: "#009ee3" }}
                        >
                          🔵 Pagar con Mercado Pago
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="bg-white rounded-[2rem] border border-gray-100 px-5 py-4 shadow-sm shadow-black/[0.03] flex justify-between items-center">
            <span className="text-base text-gray-500 font-medium">Total a pagar</span>
            <span className="text-xl font-black text-price-pink-600">{formatMXN(total)}</span>
          </div>
        </div>

        {/* Swipe to confirm */}
        {selectedMethod !== "mercadopago" && (
          <div className="fixed bottom-0 left-0 right-0 md:hidden px-4 pb-5 pt-2 z-50">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.12)] border border-white/60 p-3">
              <div
                ref={trackRef}
                className="relative h-14 rounded-2xl overflow-hidden select-none"
                style={{ backgroundColor: "#db2777" }}
              >
                <div
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  style={{ opacity: 1 - swipeRatio * 1.5 }}
                >
                  <span className="text-white/80 text-base font-black tracking-wide pl-10">
                    Desliza para confirmar →
                  </span>
                </div>
                <div
                  className="absolute left-0 top-0 bottom-0 rounded-2xl transition-none"
                  style={{ width: swipeX + HANDLE_SIZE + 4, backgroundColor: "#be185d" }}
                />
                <div
                  className="absolute top-1 bottom-1 rounded-xl bg-white flex items-center justify-center cursor-grab active:cursor-grabbing shadow-md"
                  style={{ left: swipeX + 4, width: HANDLE_SIZE, transition: swiping ? "none" : "left 0.3s ease", touchAction: "none" }}
                  onPointerDown={onPointerDown}
                  onPointerMove={onPointerMove}
                  onPointerUp={onPointerUp}
                  onPointerCancel={onPointerUp}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#db2777" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── DESKTOP ────────────────────────────────────────────────────── */}
      <div className="hidden md:flex flex-col h-full bg-gray-50 overflow-hidden">

        {/* Header */}
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
              onClick={() => dispatch({ type: "SET_VIEW", payload: "checkout" })}
              className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-price-blue-900 transition-colors group"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-0.5 transition-transform">
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
              Volver
            </button>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Método de pago</h1>
            <div className="flex items-center gap-3 ml-auto">
              <button className="w-12 h-12 rounded-2xl bg-price-blue-900 flex items-center justify-center text-white shadow-lg shadow-price-blue-900/20 hover:scale-105 transition-transform active:scale-95">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </button>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-3 gap-8">

              {/* Payment form */}
              <div className="col-span-2 flex flex-col gap-6">

                {/* Method selection */}
                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm">
                  <div className="px-8 py-5 border-b border-gray-100">
                    <p className="text-[10px] font-bold text-price-pink-600 uppercase tracking-[0.2em] mb-1">Pago</p>
                    <h2 className="text-xl font-black text-gray-900">Selecciona un método</h2>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {PAYMENT_METHODS.map((method) => (
                      <button
                        key={method.id}
                        onClick={() => setSelectedMethod(method.id)}
                        className={`w-full px-8 py-5 flex items-center gap-4 text-left transition-colors ${
                          selectedMethod === method.id ? "bg-price-blue-50" : "hover:bg-gray-50"
                        }`}
                      >
                        <span className="text-2xl w-8 text-center flex-shrink-0">{method.icon}</span>
                        <span className="text-base font-bold text-gray-900 flex-1">{method.label}</span>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                          selectedMethod === method.id ? "border-price-blue-900 bg-price-blue-900" : "border-gray-200"
                        }`}>
                          {selectedMethod === method.id && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tarjeta form */}
                {selectedMethod === "tarjeta" && (
                  <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm flex flex-col gap-5">
                    <h3 className="text-xl font-black text-gray-900">Datos de la tarjeta</h3>
                    <div>
                      <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Número de tarjeta</label>
                      <input type="text" placeholder="•••• •••• •••• ••••" maxLength={19}
                        className="w-full px-5 py-4 rounded-2xl border border-gray-100 text-base outline-none focus:border-price-blue-400 focus:ring-4 focus:ring-price-blue-900/5 transition font-mono tracking-wider bg-gray-50" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Vencimiento</label>
                        <input type="text" placeholder="MM / AA" maxLength={7}
                          className="w-full px-5 py-4 rounded-2xl border border-gray-100 text-base outline-none focus:border-price-blue-400 focus:ring-4 focus:ring-price-blue-900/5 transition bg-gray-50" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">CVV</label>
                        <input type="text" placeholder="•••" maxLength={4}
                          className="w-full px-5 py-4 rounded-2xl border border-gray-100 text-base outline-none focus:border-price-blue-400 focus:ring-4 focus:ring-price-blue-900/5 transition bg-gray-50" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Nombre en la tarjeta</label>
                      <input type="text" placeholder="NOMBRE APELLIDO"
                        className="w-full px-5 py-4 rounded-2xl border border-gray-100 text-base outline-none focus:border-price-blue-400 focus:ring-4 focus:ring-price-blue-900/5 transition bg-gray-50 uppercase" />
                    </div>
                  </div>
                )}

                {/* OXXO */}
                {selectedMethod === "oxxo" && (
                  <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm flex flex-col gap-4">
                    <h3 className="text-xl font-black text-gray-900">Referencia OXXO Pay</h3>
                    <p className="text-gray-500">Presenta este número en cualquier tienda OXXO para completar tu pago.</p>
                    <div className="bg-gray-50 rounded-2xl px-6 py-5 border border-gray-100 flex items-center justify-between">
                      <span className="text-2xl font-black text-price-blue-900 tracking-widest font-mono">8512 7634 9021 4857</span>
                    </div>
                    <p className="text-sm text-gray-400">Válido por 48 horas · Costo adicional de $13.00</p>
                  </div>
                )}

                {/* SPEI */}
                {selectedMethod === "spei" && (
                  <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm flex flex-col gap-4">
                    <h3 className="text-xl font-black text-gray-900">Datos para transferencia SPEI</h3>
                    <div className="flex flex-col gap-3">
                      <div className="bg-gray-50 rounded-2xl px-6 py-4 border border-gray-100">
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">CLABE interbancaria</p>
                        <p className="text-xl font-black text-price-blue-900 font-mono tracking-wider">0021 8000 1234 5678 90</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gray-50 rounded-2xl px-6 py-4 border border-gray-100">
                          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Banco</p>
                          <p className="text-base font-bold text-gray-900">BBVA Bancomer</p>
                        </div>
                        <div className="bg-gray-50 rounded-2xl px-6 py-4 border border-gray-100">
                          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Concepto</p>
                          <p className="text-base font-bold text-gray-900">Price Shoes Benefits · {state.currentUser?.name}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Meses sin intereses */}
                {selectedMethod === "meses" && (
                  <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm flex flex-col gap-5">
                    <h3 className="text-xl font-black text-gray-900">Meses sin intereses</h3>
                    <div className="flex gap-4">
                      {[3, 6, 12].map((m) => (
                        <button
                          key={m}
                          onClick={() => setInstallments(m)}
                          className={`flex-1 py-4 rounded-2xl font-black text-base transition-all active:scale-95 ${
                            installments === m
                              ? "bg-price-blue-900 text-white shadow-lg shadow-price-blue-900/20"
                              : "bg-gray-50 text-gray-500 border border-gray-100 hover:bg-gray-100"
                          }`}
                        >
                          {m} meses
                        </button>
                      ))}
                    </div>
                    <div className="bg-price-blue-50 rounded-2xl px-6 py-4 border border-price-blue-100 flex justify-between items-center">
                      <span className="text-sm font-bold text-price-blue-900">Pago mensual aproximado</span>
                      <span className="text-2xl font-black text-price-blue-900">{formatMXN(Math.ceil(total / installments))}</span>
                    </div>
                    <div>
                      <label className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-2">Número de tarjeta</label>
                      <input type="text" placeholder="•••• •••• •••• ••••" maxLength={19}
                        className="w-full px-5 py-4 rounded-2xl border border-gray-100 text-base outline-none focus:border-price-blue-400 focus:ring-4 focus:ring-price-blue-900/5 transition font-mono tracking-wider bg-gray-50" />
                    </div>
                  </div>
                )}

                {/* Mercado Pago */}
                {selectedMethod === "mercadopago" && (
                  <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm flex flex-col gap-5">
                    <h3 className="text-xl font-black text-gray-900">Mercado Pago</h3>
                    <p className="text-gray-500">Serás redirigido a Mercado Pago para completar tu pago de forma segura.</p>
                    <button
                      onClick={confirmPayment}
                      className="w-full py-5 rounded-2xl font-black text-lg text-white shadow-xl active:scale-95 transition-all"
                      style={{ backgroundColor: "#009ee3" }}
                    >
                      🔵 Pagar con Mercado Pago
                    </button>
                  </div>
                )}
              </div>

              {/* Order summary */}
              <div className="col-span-1">
                <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 sticky top-6 shadow-sm flex flex-col gap-6">
                  <div>
                    <p className="text-[10px] font-bold text-price-pink-600 uppercase tracking-[0.2em] mb-1">Detalle</p>
                    <h2 className="text-xl font-black text-gray-900">Tu pedido</h2>
                  </div>

                  <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
                    {state.cart.map((item) => {
                      const finalPrice = getDiscountedPrice(item.product.price, discount)
                      return (
                        <div key={item.product.id} className="flex justify-between text-sm">
                          <span className="text-gray-500">{item.quantity}× {item.product.name}</span>
                          <span className="font-bold text-gray-900">{formatMXN(finalPrice * item.quantity)}</span>
                        </div>
                      )
                    })}
                  </div>

                  <div className="flex flex-col gap-3 pt-3 border-t border-gray-100">
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Subtotal</span>
                      <span>{formatMXN(subtotal)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-sm font-bold text-price-pink-600">
                        <span>💎 Beneficio {discount}%</span>
                        <span>-{formatMXN(discountAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-black text-gray-900 pt-3 border-t border-gray-100">
                      <span>Total</span>
                      <span className="text-price-pink-600">{formatMXN(total)}</span>
                    </div>
                  </div>

                  {discount > 0 && (
                    <div className="bg-price-blue-50 border border-price-blue-100 rounded-2xl px-4 py-3 flex items-center gap-2">
                      <span className="text-sm">💎</span>
                      <span className="text-xs font-bold text-price-blue-900">Beneficio Exclusivo: {discount}% OFF aplicado</span>
                    </div>
                  )}

                  {selectedMethod !== "mercadopago" && (
                    <button
                      onClick={confirmPayment}
                      className="w-full py-4 rounded-2xl bg-price-pink-600 text-white font-black text-sm uppercase tracking-widest shadow-lg shadow-price-pink-600/20 hover:bg-price-pink-700 hover:scale-[1.02] transition-all active:scale-95"
                    >
                      Confirmar pago
                    </button>
                  )}

                  <p className="text-xs text-gray-400 text-center flex items-center justify-center gap-1.5">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                    </svg>
                    Pago seguro y encriptado
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  )
}
