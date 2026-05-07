"use client"

import Image from "next/image"
import { Order } from "@/lib/types"
import { formatMXN, timeAgo, getProductImageUrl, getStoreAvailability } from "@/lib/mock-data"
import { useApp } from "@/context/AppContext"
import { useState } from "react"
import ReadyConfirmationModal from "./ReadyConfirmationModal"
import DeliveryConfirmationModal from "./DeliveryConfirmationModal"
import { playSound } from "@/lib/sounds"

interface OrderDetailPanelProps {
  order: Order
  onClose: () => void
}

const STATUS_CONFIG = {
  pendiente: { label: "Pendiente", text: "text-amber-700",       iconBg: "bg-amber-500",       icon: "dot" },
  listo:     { label: "Listo para recoger",     text: "text-price-blue-900",  iconBg: "bg-price-blue-900",  icon: "check" },
  entregado: { label: "Entregado", text: "text-emerald-700",     iconBg: "bg-emerald-500",     icon: "check" },
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

const PICKUP_STORE_ID = 1

export default function OrderDetailPanel({ order, onClose }: OrderDetailPanelProps) {
  const { dispatch } = useApp()
  const [showConfirm, setShowConfirm] = useState(false)
  const [showDeliverConfirm, setShowDeliverConfirm] = useState(false)
  const status = STATUS_CONFIG[order.status]
  const discountAmount = Math.round(order.subtotal * (order.discount / 100))

  const isTwoTrips = order.fulfillmentOption === "pickup-two-trips"
  const visit1Done = order.visitStatus === "v1-done"

  const itemsV1 = isTwoTrips
    ? order.items.filter(i => getStoreAvailability(i.product.sku ?? "", PICKUP_STORE_ID) === "hoy")
    : []
  const itemsV2 = isTwoTrips
    ? order.items.filter(i => getStoreAvailability(i.product.sku ?? "", PICKUP_STORE_ID) === "2-dias")
    : []

  function markAsReady() {
    setShowConfirm(true)
  }

  function confirmMarkAsReady() {
    dispatch({ type: "UPDATE_ORDER_STATUS", payload: { orderId: order.id, status: "listo" } })
    playSound('success')
    setShowConfirm(false)
  }

  function confirmDeliverOrder() {
    dispatch({ type: "UPDATE_ORDER_STATUS", payload: { orderId: order.id, status: "entregado" } })
    playSound('delivery')
    setShowDeliverConfirm(false)
  }

  function completeVisit1() {
    dispatch({ type: "COMPLETE_VISIT1", payload: { orderId: order.id } })
  }

  function markAsDelivered() {
    setShowDeliverConfirm(true)
  }

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-price-blue-900/40 backdrop-blur-sm z-40 animate-in fade-in duration-300" onClick={onClose} />

      {/* Slide panel */}
      <div className="fixed inset-0 md:inset-auto md:right-0 md:top-0 md:bottom-0 md:w-[460px] z-50 flex flex-col bg-white shadow-2xl animate-in slide-in-from-right duration-300">

        {showConfirm && (
          <ReadyConfirmationModal 
            order={order} 
            onConfirm={confirmMarkAsReady} 
            onClose={() => setShowConfirm(false)} 
          />
        )}

        {showDeliverConfirm && (
          <DeliveryConfirmationModal
            order={order}
            onConfirm={confirmDeliverOrder}
            onClose={() => setShowDeliverConfirm(false)}
          />
        )}

        {/* Header - Glass style with brand blue */}
        <div className="bg-price-blue-900 text-white px-5 py-5 md:px-8 md:py-8 relative overflow-hidden flex-shrink-0">
          <div className="absolute top-0 right-0 w-48 h-48 bg-price-pink-500/10 rounded-full blur-3xl -mr-12 -mt-12" />
          
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/>
                </svg>
              </div>
              <div>
                <p className="text-[10px] font-bold text-price-blue-300 uppercase tracking-widest leading-none mb-1">Detalle de orden</p>
                <p className="text-lg font-black leading-none tracking-tight uppercase">{order.id}</p>
              </div>
            </div>
            <button onClick={onClose} className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 md:p-8 space-y-6 md:space-y-8 no-scrollbar bg-gray-50/30">

          {/* Live Status Card */}
          <section className={`p-6 rounded-[2rem] border-2 transition-all duration-500 shadow-sm ${
            order.status === 'pendiente' ? 'bg-amber-50 border-amber-200' :
            order.status === 'listo'     ? 'bg-price-blue-50 border-price-blue-200' :
            'bg-emerald-50 border-emerald-200'
          }`}>
             <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Estado actual</p>
                  <h3 className={`text-xl font-black tracking-tight ${status.text}`}>{status.label}</h3>
                </div>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg ${status.iconBg} ring-4 ring-white`}>
                  {status.icon === 'dot' 
                    ? <div className="w-3 h-3 rounded-full bg-white animate-pulse" />
                    : <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                </div>
             </div>
          </section>

          {/* Customer & Payment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-[2rem] border border-gray-100 p-6 shadow-sm">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Cliente</p>
              <p className="text-sm font-bold text-gray-900 mb-1">{order.userName}</p>
              <p className="text-[11px] text-gray-500 font-medium truncate">{order.tenantName}</p>
            </div>
            <div className="bg-white rounded-[2rem] border border-gray-100 p-6 shadow-sm">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Pago</p>
              <p className="text-sm font-bold text-gray-900 mb-1 truncate">{PAYMENT_ICONS[order.paymentMethod]} {PAYMENT_LABELS[order.paymentMethod]}</p>
              <p className="text-[11px] text-emerald-600 font-bold tracking-widest uppercase">Validado</p>
            </div>
          </div>

          {/* Fulfillment Section */}
          <section className="bg-white rounded-[2rem] border border-gray-100 p-6 shadow-sm">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Detalle de entrega</p>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 mb-4">
              <div className="w-10 h-10 rounded-xl bg-price-blue-900/10 flex items-center justify-center text-price-blue-900">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              </div>
              <p className="text-sm font-bold text-gray-700">
                {order.fulfillmentOption === "pickup" ? "Retiro inmediato" : 
                 order.fulfillmentOption === "pickup-two-trips" ? "Retiro en dos visitas" :
                 order.fulfillmentOption === "wait-pickup" ? "Retiro orden completa" :
                 "Envío a domicilio"}
              </p>
            </div>

            {isTwoTrips && (
              <div className="space-y-3">
                <div className={`p-4 rounded-2xl border flex items-center justify-between ${visit1Done ? 'bg-emerald-50 border-emerald-100' : 'bg-amber-50 border-amber-100'}`}>
                   <span className="text-xs font-bold text-gray-700">Visita 1: Artículos hoy</span>
                   <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg ${visit1Done ? 'bg-emerald-500 text-white shadow-sm' : 'bg-amber-500 text-white shadow-sm'}`}>
                     {visit1Done ? 'ENTREGADO' : 'PENDIENTE'}
                   </span>
                </div>
                <div className={`p-4 rounded-2xl border flex items-center justify-between ${order.status === 'entregado' ? 'bg-emerald-50 border-emerald-100' : 'bg-gray-50 border-gray-100 opacity-60'}`}>
                   <span className="text-xs font-bold text-gray-700">Visita 2: Resto de la orden</span>
                   <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg ${order.status === 'entregado' ? 'bg-emerald-500 text-white shadow-sm' : 'bg-gray-400 text-white shadow-sm'}`}>
                     {order.status === 'entregado' ? 'ENTREGADO' : 'EN ESPERA'}
                   </span>
                </div>
              </div>
            )}
          </section>

          {/* Items Section */}
          <section className="bg-white rounded-[2rem] border border-gray-100 p-6 shadow-sm">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Productos ({order.items.length})</p>
            
            <div className="space-y-4">
              {order.items.map((item) => {
                const unitPrice = Math.round(item.product.price * (1 - order.discount / 100))
                return (
                  <div key={item.product.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-2xl border border-gray-100/50">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white border border-gray-100 flex-shrink-0 shadow-sm">
                      {getProductImageUrl(item.product.image, "thumb") && (
                        <Image src={getProductImageUrl(item.product.image, "thumb")} alt={item.product.name} fill className="object-cover" unoptimized />
                      )}
                      <div className="absolute top-0 right-0 w-6 h-6 bg-price-blue-900 text-white text-[10px] font-black flex items-center justify-center rounded-bl-xl border-l border-b border-white/20 shadow-md">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 tracking-tight truncate">{item.product.name}</p>
                      <p className="text-[11px] text-gray-400 font-bold mt-1 uppercase tracking-wider">{formatMXN(unitPrice)} <span className="mx-1 opacity-20">|</span> Unit</p>
                    </div>
                    <div className="text-right">
                       <p className="text-sm font-black text-price-blue-900 tabular-nums">{formatMXN(unitPrice * item.quantity)}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Resumen */}
          <section className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-price-pink-600/5 rounded-full blur-3xl" />
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-5">Resumen financiero</p>
            <div className="space-y-4">
              <div className="flex justify-between items-center opacity-50">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Precio lista</span>
                <span className="text-xs font-bold text-gray-500 line-through tabular-nums">{formatMXN(order.subtotal)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-price-pink-600 uppercase tracking-widest">Beneficio ({order.discount}%)</span>
                <span className="text-xs font-black text-price-pink-600 tabular-nums">−{formatMXN(discountAmount)}</span>
              </div>
              <div className="h-px bg-gray-100 my-4" />
              <div className="flex justify-between items-center">
                <span className="text-sm font-black text-gray-900 uppercase tracking-widest">Total cobrado</span>
                <span className="text-2xl font-black text-price-blue-900 tabular-nums tracking-tighter">{formatMXN(order.total)}</span>
              </div>
            </div>
          </section>

          {/* Footer Metadata */}
          <div className="text-center pb-8 pt-4">
             <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2 opacity-50">Orden autenticada el</p>
             <p className="text-[10px] font-black text-gray-400 tracking-widest">
               {new Date(order.createdAt).toLocaleString("es-MX", {
                 weekday: "short", day: "2-digit", month: "short",
                 hour: "2-digit", minute: "2-digit",
               }).toUpperCase()}
             </p>
          </div>
        </div>

        {/* Footer CTA - Brand Pink for primary actions */}
        <div className="px-5 py-5 md:px-8 md:py-8 border-t border-gray-100 bg-white flex-shrink-0 flex flex-col gap-4">
          {!isTwoTrips && order.status === "pendiente" && (
            <button onClick={markAsReady} className="group w-full py-5 rounded-[1.5rem] bg-price-blue-900 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-price-blue-900/20 hover:bg-price-blue-800 transition-all active:scale-95 flex items-center justify-center gap-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform"><polyline points="20 6 9 17 4 12"/></svg>
              MARCAR COMO LISTO
            </button>
          )}
          {!isTwoTrips && order.status === "listo" && (
            <button onClick={markAsDelivered} className="group w-full py-5 rounded-[1.5rem] bg-price-pink-600 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-price-pink-600/20 hover:bg-price-pink-500 transition-all active:scale-95 flex items-center justify-center gap-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-y-1 transition-transform">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              CONFIRMAR ENTREGA
            </button>
          )}

          {/* Two-trip flows */}
          {isTwoTrips && order.status !== "entregado" && !visit1Done && (
            <button onClick={completeVisit1} className="w-full py-5 rounded-[1.5rem] bg-emerald-600 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all active:scale-95 flex items-center justify-center gap-3">
              CONFIRMAR VISITA 1 — PARCIAL
            </button>
          )}
          {isTwoTrips && visit1Done && order.status !== "entregado" && (
            <button onClick={markAsDelivered} className="w-full py-5 rounded-[1.5rem] bg-price-pink-600 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-price-pink-600/20 hover:bg-price-pink-500 transition-all active:scale-95 flex items-center justify-center gap-3">
              CONFIRMAR VISITA 2 — COMPLETA
            </button>
          )}

          {/* Completed */}
          {order.status === "entregado" && (
            <div className="w-full py-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center gap-3 text-emerald-700 shadow-sm shadow-emerald-600/5">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              <span className="font-black text-xs uppercase tracking-widest">TRANSACCIÓN FINALIZADA</span>
            </div>
          )}
        </div>

      </div>
    </>
  )
}
