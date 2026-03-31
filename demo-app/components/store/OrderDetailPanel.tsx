"use client"

import Image from "next/image"
import { Order } from "@/lib/types"
import { formatMXN, timeAgo, getProductImageUrl } from "@/lib/mock-data"
import { useApp } from "@/context/AppContext"

interface OrderDetailPanelProps {
  order: Order
  onClose: () => void
}

const STATUS_CONFIG = {
  pendiente: { label: "Pendiente", bg: "bg-amber-50",      text: "text-amber-700",      border: "border-amber-200",      dot: "bg-amber-400 animate-pulse" },
  listo:     { label: "Listo",     bg: "bg-price-blue-50", text: "text-price-blue-900", border: "border-price-blue-200", dot: "bg-price-blue-900" },
  entregado: { label: "Entregado", bg: "bg-emerald-50",    text: "text-emerald-700",    border: "border-emerald-200",    dot: "bg-emerald-500" },
}

const PAYMENT_LABELS: Record<string, string> = {
  tarjeta:     "Tarjeta crédito / débito",
  oxxo:        "OXXO Pay",
  spei:        "SPEI / Transferencia",
  meses:       "Meses sin intereses",
  mercadopago: "Mercado Pago",
}

const PAYMENT_ICONS: Record<string, string> = {
  tarjeta:     "💳",
  oxxo:        "🏪",
  spei:        "🏦",
  meses:       "📆",
  mercadopago: "🔵",
}

export default function OrderDetailPanel({ order, onClose }: OrderDetailPanelProps) {
  const { dispatch } = useApp()
  const status = STATUS_CONFIG[order.status]
  const discountAmount = Math.round(order.subtotal * (order.discount / 100))

  function markAsReady() {
    dispatch({ type: "UPDATE_ORDER_STATUS", payload: { orderId: order.id, status: "listo" } })
  }

  function markAsDelivered() {
    dispatch({ type: "UPDATE_ORDER_STATUS", payload: { orderId: order.id, status: "entregado" } })
    onClose()
  }

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm" onClick={onClose} />

      {/* Slide panel */}
      <div className="fixed right-0 top-0 bottom-0 z-50 flex flex-col bg-white shadow-2xl" style={{ width: 460 }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-price-blue-900 flex items-center justify-center flex-shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/>
              </svg>
            </div>
            <div>
              <p className="text-base font-semibold text-gray-900 leading-none">Detalle de orden</p>
              <p className="text-xs font-mono text-gray-400 mt-0.5">{order.id} · {timeAgo(order.createdAt)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border ${status.bg} ${status.text} ${status.border}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
              {status.label}
            </span>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">

          {/* Cliente */}
          <section className="bg-gray-50 rounded-2xl p-4">
            <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest mb-3">Cliente</p>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-price-blue-900 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-sm shadow-price-blue-900/20">
                {order.userName.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 leading-none">{order.userName}</p>
                <p className="text-xs text-gray-400 mt-0.5">{order.tenantName}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-1.5 bg-price-blue-50 border border-price-blue-100 rounded-xl px-3 py-1.5">
                <span className="text-xs">💎</span>
                <span className="text-xs font-medium text-price-blue-900">{order.discount}% de descuento</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white border border-gray-100 rounded-xl px-3 py-1.5">
                <span className="text-xs">{PAYMENT_ICONS[order.paymentMethod] ?? "💰"}</span>
                <span className="text-xs text-gray-600">{PAYMENT_LABELS[order.paymentMethod] ?? order.paymentMethod}</span>
              </div>
            </div>
          </section>

          {/* Productos */}
          <section className="bg-gray-50 rounded-2xl p-4">
            <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest mb-3">Productos</p>
            <div className="flex flex-col gap-2.5">
              {order.items.map((item) => {
                const unitPrice = Math.round(item.product.price * (1 - order.discount / 100))
                return (
                  <div key={item.product.id} className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                      {getProductImageUrl(item.product.image, "thumb") && (
                        <Image src={getProductImageUrl(item.product.image, "thumb")} alt={item.product.name} fill className="object-cover" unoptimized />
                      )}
                      <span className="absolute bottom-0 right-0 w-4 h-4 bg-price-blue-900 text-white text-[9px] font-bold flex items-center justify-center rounded-tl-md">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{item.product.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {formatMXN(unitPrice)} c/u
                        <span className="line-through text-gray-300 ml-1.5">{formatMXN(item.product.price)}</span>
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-gray-800 flex-shrink-0 tabular-nums">
                      {formatMXN(unitPrice * item.quantity)}
                    </p>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Resumen */}
          <section className="bg-white rounded-2xl border border-gray-100 p-4">
            <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest mb-3">Resumen</p>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500">Subtotal (precio lista)</span>
              <span className="text-sm text-gray-400 line-through tabular-nums">{formatMXN(order.subtotal)}</span>
            </div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-price-pink-600">💎 Beneficio {order.discount}%</span>
              <span className="text-sm font-semibold text-price-pink-600 tabular-nums">−{formatMXN(discountAmount)}</span>
            </div>
            <div className="h-px bg-gray-100 mb-3" />
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Total cobrado</span>
              <span className="text-xl font-bold text-price-blue-900 tabular-nums">{formatMXN(order.total)}</span>
            </div>
          </section>

          {/* Fecha */}
          <p className="text-xs text-gray-400 text-center pb-1">
            {new Date(order.createdAt).toLocaleString("es-MX", {
              weekday: "long", day: "2-digit", month: "long",
              hour: "2-digit", minute: "2-digit",
            })}
          </p>

        </div>

        {/* Footer CTA */}
        <div className="px-6 py-4 border-t border-gray-100 flex-shrink-0">
          {order.status === "pendiente" && (
            <button
              onClick={markAsReady}
              className="w-full py-3.5 rounded-2xl bg-price-blue-900 text-white font-semibold text-sm shadow-lg shadow-price-blue-900/20 hover:bg-price-blue-800 active:scale-[0.98] transition flex items-center justify-center gap-2.5"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Marcar como Listo
            </button>
          )}
          {order.status === "listo" && (
            <button
              onClick={markAsDelivered}
              className="w-full py-3.5 rounded-2xl bg-price-pink-600 text-white font-semibold text-sm shadow-lg shadow-price-pink-600/20 hover:bg-price-pink-700 active:scale-[0.98] transition flex items-center justify-center gap-2.5"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/>
              </svg>
              Marcar como Entregado
            </button>
          )}
          {order.status === "entregado" && (
            <div className="w-full py-3.5 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center gap-2 text-emerald-700">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span className="font-medium text-sm">Orden entregada</span>
            </div>
          )}
        </div>

      </div>
    </>
  )
}
