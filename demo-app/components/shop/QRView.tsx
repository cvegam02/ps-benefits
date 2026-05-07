"use client"

import { useApp } from "@/context/AppContext"
import { tenants, formatMXN, getStoreAvailability } from "@/lib/mock-data"
import { QRCodeSVG } from "qrcode.react"

const PICKUP_STORE_ID = 1

export default function QRView() {
  const { state, dispatch } = useApp()

  const order = state.orders[state.orders.length - 1]

  const tenantName = state.currentUser
    ? tenants.find((t) => t.id === state.currentUser!.tenantId)?.name ?? "Price Shoes Benefits"
    : "Price Shoes Benefits"

  if (!order) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-400 text-sm">Sin orden activa</p>
      </div>
    )
  }

  const isTwoTrips = order.fulfillmentOption === "pickup-two-trips"
  const itemsV1 = isTwoTrips
    ? order.items.filter(i => getStoreAvailability(i.product.sku ?? "", PICKUP_STORE_ID) === "hoy")
    : []
  const itemsV2 = isTwoTrips
    ? order.items.filter(i => getStoreAvailability(i.product.sku ?? "", PICKUP_STORE_ID) === "2-dias")
    : []

  const qrData = JSON.stringify({
    orderId: order.id,
    total: order.total,
    userId: order.userId,
    tenantId: order.tenantId,
  })

  function handleDone() {
    dispatch({ type: "CLEAR_CART" })
    dispatch({ type: "SET_VIEW", payload: "catalog" })
  }

  // ── Shared sub-components ──────────────────────────────────────────────────
  const QRBlock = ({ size }: { size: number }) => (
    <div className="flex flex-col items-center gap-3">
      <div className="p-4 border-2 border-price-blue-100 rounded-2xl bg-white shadow-sm">
        <QRCodeSVG value={qrData} size={size} level="M" includeMargin={false} fgColor="#1e3a8a" />
      </div>
      <div className="flex items-center gap-2 bg-price-blue-50 rounded-xl px-4 py-2 border border-price-blue-100">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
        <span className="text-sm font-bold text-price-blue-900 font-mono">{order.id}</span>
      </div>
      {isTwoTrips
        ? <p className="text-xs text-gray-400 text-center">Válido para <span className="font-bold text-gray-600">ambas visitas</span> · muestra el mismo QR cada vez</p>
        : <p className="text-xs text-gray-400">Válido por <span className="font-bold text-gray-600">24 horas</span></p>
      }
    </div>
  )

  // Timeline de dos visitas (mobile y desktop comparten)
  const TwoTripTimeline = ({ compact = false }: { compact?: boolean }) => (
    <div className={`flex flex-col gap-0 ${compact ? "" : ""}`}>
      {/* Visita 1 */}
      <div className="flex gap-3">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 shadow-sm">
            <span className="text-white text-xs font-black">1</span>
          </div>
          <div className="w-0.5 bg-gray-200 flex-1 my-1" style={{ minHeight: 20 }} />
        </div>
        <div className="flex-1 pb-4">
          <div className="flex items-center gap-2 mb-2">
            <p className="text-sm font-black text-gray-900">Visita 1 — Hoy</p>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wide">Disponible ahora</span>
          </div>
          <div className="flex flex-col gap-1.5">
            {itemsV1.map(i => (
              <div key={i.product.id} className="flex items-center gap-2 text-sm text-gray-600">
                <span className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-700 text-[10px] font-black flex items-center justify-center flex-shrink-0">{i.quantity}</span>
                {i.product.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Visita 2 */}
      <div className="flex gap-3">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center flex-shrink-0 shadow-sm">
            <span className="text-white text-xs font-black">2</span>
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <p className="text-sm font-black text-gray-900">Visita 2 — En 2 días hábiles</p>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 uppercase tracking-wide">Te avisaremos</span>
          </div>
          <div className="flex flex-col gap-1.5">
            {itemsV2.map(i => (
              <div key={i.product.id} className="flex items-center gap-2 text-sm text-gray-500">
                <span className="w-5 h-5 rounded-md bg-amber-100 text-amber-700 text-[10px] font-black flex items-center justify-center flex-shrink-0">{i.quantity}</span>
                {i.product.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* ── MOBILE ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col h-full md:hidden bg-gray-50">

        {/* Header */}
        <div className="relative bg-price-blue-900 pt-6 pb-8 px-4 overflow-hidden shadow-xl shadow-price-blue-900/20 flex-shrink-0">
          <div className="absolute top-0 right-0 w-48 h-48 bg-price-pink-500/10 rounded-full blur-3xl -mr-10 -mt-10" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-price-blue-400/10 rounded-full blur-2xl -ml-10 -mb-10" />
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center flex-shrink-0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] font-bold text-price-blue-300 uppercase tracking-widest leading-none mb-1">Price Shoes Benefits</p>
              <p className="text-white text-lg font-bold leading-none">¡Pago confirmado!</p>
              <p className="text-white/60 text-sm mt-0.5">Orden #{order.id}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-5 pb-28 flex flex-col gap-4">

          {/* QR Card */}
          <div className="bg-white rounded-[2rem] border border-gray-100 p-5 flex flex-col items-center gap-4 shadow-sm shadow-black/[0.03]">
            <div className="text-center">
              <p className="text-[10px] font-bold text-price-pink-600 uppercase tracking-widest mb-0.5">Código de retiro</p>
              <h2 className="text-base font-black text-gray-900">
                {isTwoTrips ? "Muestra este QR en cada visita" : "Muestra este QR en la tienda"}
              </h2>
            </div>
            <QRBlock size={200} />
          </div>

          {/* Two-trip timeline */}
          {isTwoTrips && (
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm shadow-black/[0.03]">
              <div className="px-5 py-4 border-b border-gray-50">
                <p className="text-[10px] font-bold text-price-pink-600 uppercase tracking-widest mb-0.5">Plan de retiro</p>
                <h2 className="text-base font-black text-gray-900">Tus 2 visitas a la tienda</h2>
              </div>
              <div className="px-5 py-4">
                <TwoTripTimeline compact />
              </div>
            </div>
          )}

          {/* Order summary */}
          {!isTwoTrips && (
            <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm shadow-black/[0.03]">
              <div className="px-5 py-4 border-b border-gray-50">
                <p className="text-[10px] font-bold text-price-pink-600 uppercase tracking-widest mb-0.5">Resumen</p>
                <h2 className="text-base font-black text-gray-900">Tu pedido</h2>
              </div>
              {order.items.map((item) => (
                <div key={item.product.id} className="px-5 py-3 flex items-center justify-between border-b border-gray-50 last:border-b-0">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-price-blue-900 text-white text-xs font-black flex items-center justify-center flex-shrink-0">{item.quantity}</span>
                    <span className="text-sm text-gray-700 line-clamp-1">{item.product.name}</span>
                  </div>
                  <span className="text-sm font-black text-gray-900 flex-shrink-0 ml-2">
                    {formatMXN(Math.round(item.product.price * item.quantity * (1 - order.discount / 100)))}
                  </span>
                </div>
              ))}
              <div className="px-5 py-4 bg-gray-50 flex justify-between items-center">
                <span className="text-base font-black text-gray-900">Total pagado</span>
                <span className="text-lg font-black text-price-pink-600">{formatMXN(order.total)}</span>
              </div>
            </div>
          )}

          {/* Total for two-trips */}
          {isTwoTrips && (
            <div className="bg-white rounded-[2rem] border border-gray-100 px-5 py-4 shadow-sm shadow-black/[0.03] flex justify-between items-center">
              <span className="text-base font-black text-gray-900">Total pagado</span>
              <span className="text-lg font-black text-price-pink-600">{formatMXN(order.total)}</span>
            </div>
          )}
        </div>

        {/* Done button */}
        <div className="fixed bottom-0 left-0 right-0 md:hidden px-4 pb-5 pt-2 z-50">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.12)] border border-white/60 p-3">
            <button
              onClick={handleDone}
              className="w-full py-4 rounded-2xl bg-price-pink-600 text-white font-black text-base uppercase tracking-widest shadow-lg shadow-price-pink-600/20 hover:bg-price-pink-700 active:scale-95 transition-all"
            >
              Volver al catálogo
            </button>
          </div>
        </div>
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
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div>
                <p className="text-[9px] font-bold text-price-blue-300 uppercase tracking-widest leading-none mb-1">Price Shoes Benefits</p>
                <p className="text-white text-xl font-black leading-none tracking-tight">{tenantName}</p>
              </div>
            </div>
          </div>
          <div className="flex-1 flex items-center px-8 gap-4">
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">¡Pago confirmado!</h1>
              <p className="text-sm text-gray-400 mt-0.5">Orden #{order.id} procesada exitosamente</p>
            </div>
            <div className="ml-auto w-12 h-12 rounded-2xl bg-price-blue-900 flex items-center justify-center shadow-lg shadow-price-blue-900/20 flex-shrink-0">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          </div>
        </header>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto p-10">
          <div className="max-w-5xl mx-auto">
            <div className={`grid gap-8 ${isTwoTrips ? "grid-cols-2" : "grid-cols-2"}`}>

              {/* QR Card */}
              <div className="bg-white rounded-[2.5rem] border border-gray-100 p-10 flex flex-col items-center gap-6 shadow-sm">
                <div className="text-center">
                  <p className="text-[10px] font-bold text-price-pink-600 uppercase tracking-[0.2em] mb-1">Código de retiro</p>
                  <h2 className="text-xl font-black text-gray-900">
                    {isTwoTrips ? "Un solo QR para tus 2 visitas" : "Muestra este QR en la tienda"}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {isTwoTrips
                      ? "Muestra este mismo código cada vez que vayas a la tienda"
                      : "El operador escaneará el código para confirmar tu pedido"}
                  </p>
                </div>
                <QRBlock size={220} />
              </div>

              {/* Right col: timeline or order details */}
              <div className="flex flex-col gap-6">

                {isTwoTrips ? (
                  /* Two-trip timeline */
                  <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm flex-1">
                    <div className="px-8 py-5 border-b border-gray-100">
                      <p className="text-[10px] font-bold text-price-pink-600 uppercase tracking-[0.2em] mb-1">Plan de retiro</p>
                      <h2 className="text-xl font-black text-gray-900">Tus 2 visitas a la tienda</h2>
                    </div>
                    <div className="px-8 py-6">
                      <TwoTripTimeline />
                    </div>
                  </div>
                ) : (
                  /* Standard order summary */
                  <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm">
                    <div className="px-8 py-5 border-b border-gray-100">
                      <p className="text-[10px] font-bold text-price-pink-600 uppercase tracking-[0.2em] mb-1">Resumen</p>
                      <h2 className="text-xl font-black text-gray-900">Tu pedido</h2>
                    </div>
                    <div className="divide-y divide-gray-50">
                      {order.items.map((item) => (
                        <div key={item.product.id} className="px-8 py-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="w-7 h-7 rounded-lg bg-price-blue-900 text-white text-xs font-black flex items-center justify-center flex-shrink-0">{item.quantity}</span>
                            <span className="text-base text-gray-700">{item.product.name}</span>
                          </div>
                          <span className="text-base font-black text-gray-900">
                            {formatMXN(Math.round(item.product.price * item.quantity * (1 - order.discount / 100)))}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="px-8 py-5 bg-gray-50 flex justify-between items-center border-t border-gray-100">
                      <span className="text-base font-black text-gray-900">Total pagado</span>
                      <span className="text-xl font-black text-price-pink-600">{formatMXN(order.total)}</span>
                    </div>
                  </div>
                )}

                {/* Pickup info */}
                <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
                  <h3 className="text-base font-black text-gray-900 mb-4 flex items-center gap-2">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    Punto de recogida
                  </h3>
                  <div className="flex items-start gap-3 p-4 bg-price-blue-50 rounded-2xl border border-price-blue-100">
                    <div className="w-10 h-10 rounded-xl bg-price-blue-900/10 flex items-center justify-center flex-shrink-0">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-base font-black text-gray-900">Tienda Hermosillo Norte</p>
                      <p className="text-sm text-gray-500 mt-0.5">Av. López Portillo #45, Hermosillo, Sonora</p>
                      <p className="text-xs text-gray-400 mt-1">Horario: Lun-Sab 9:00 AM – 9:00 PM</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={handleDone}
                    className="flex-1 py-4 rounded-2xl bg-price-pink-600 text-white font-black text-sm uppercase tracking-widest shadow-lg shadow-price-pink-600/20 hover:bg-price-pink-700 hover:scale-[1.02] transition-all active:scale-95"
                  >
                    Volver al catálogo
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="px-6 py-4 rounded-2xl border border-gray-200 text-gray-600 font-black text-sm hover:bg-gray-50 transition flex items-center justify-center gap-2"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="6 9 6 2 18 2 18 9"/>
                      <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/>
                      <rect x="6" y="14" width="12" height="8"/>
                    </svg>
                    Imprimir
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  )
}
