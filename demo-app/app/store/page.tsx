"use client"

import { useState } from "react"
import Image from "next/image"
import { useApp } from "@/context/AppContext"
import { Order, OrderStatus } from "@/lib/types"
import { formatMXN, timeAgo } from "@/lib/mock-data"
import OrderDetailPanel from "@/components/store/OrderDetailPanel"
import QRScanner from "@/components/store/QRScanner"

// ── Order Card ─────────────────────────────────────────────────────────────
function OrderCard({
  order,
  onSelect,
  onScanQR,
}: {
  order: Order
  onSelect: () => void
  onScanQR: () => void
}) {
  const { dispatch } = useApp()

  function markReady(e: React.MouseEvent) {
    e.stopPropagation()
    dispatch({ type: "UPDATE_ORDER_STATUS", payload: { orderId: order.id, status: "listo" as OrderStatus } })
  }

  const accentBar = order.status === "pendiente" ? "bg-amber-400"
    : order.status === "listo" ? "bg-price-blue-900"
    : "bg-emerald-500"

  return (
    <div
      onClick={onSelect}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-gray-200 cursor-pointer transition-all active:scale-[0.99] overflow-hidden flex"
    >
      {/* Left status bar */}
      <div className={`w-1 flex-shrink-0 ${accentBar}`} />

      <div className="flex-1 p-4 min-w-0">

        {/* Top row: order ID + time */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-mono text-gray-400 tracking-wide">{order.id}</span>
          <div className="flex items-center gap-1 text-gray-400">
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            <span className="text-[10px]">{timeAgo(order.createdAt)}</span>
          </div>
        </div>

        {/* Customer row */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-2xl bg-price-blue-900 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-sm shadow-price-blue-900/20">
            {order.userName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-gray-900 leading-tight truncate">{order.userName}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <p className="text-[11px] text-gray-400 truncate">{order.tenantName}</p>
              <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-price-pink-600 bg-price-pink-50 border border-price-pink-100 rounded-md px-1.5 py-px flex-shrink-0">
                💎 {order.discount}% OFF
              </span>
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {order.items.map((item) => (
            <span
              key={item.product.id}
              className="inline-flex items-center gap-1.5 px-1.5 py-1 bg-gray-50 border border-gray-100 rounded-xl text-[11px] text-gray-600"
            >
              <span className="relative w-6 h-6 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200">
                {item.product.image && <Image src={item.product.image} alt={item.product.name} fill className="object-cover" unoptimized />}
              </span>
              <span className="truncate max-w-[90px]">
                {item.product.name.length > 16 ? item.product.name.slice(0, 14) + "…" : item.product.name}
              </span>
              <span className="text-gray-400 font-medium">×{item.quantity}</span>
            </span>
          ))}
        </div>

        {/* Footer: total + CTA */}
        <div className="flex items-center gap-3 pt-3 border-t border-gray-50">
          <div className="flex-1">
            <p className="text-[9px] text-gray-400 uppercase tracking-widest leading-none mb-0.5">Total</p>
            <p className="text-base font-bold text-price-blue-900 leading-none tabular-nums">{formatMXN(order.total)}</p>
          </div>

          {order.status === "pendiente" && (
            <button
              onClick={markReady}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-price-blue-900 text-white text-xs font-semibold hover:bg-price-blue-800 active:scale-95 transition-all shadow-sm shadow-price-blue-900/20"
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Marcar listo
            </button>
          )}

          {order.status === "listo" && (
            <button
              onClick={(e) => { e.stopPropagation(); onScanQR() }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-price-pink-600 text-white text-xs font-semibold hover:bg-price-pink-700 active:scale-95 transition-all shadow-sm shadow-price-pink-600/20"
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="3" height="3"/>
                <rect x="18" y="18" width="3" height="3"/>
              </svg>
              Escanear QR
            </button>
          )}

          {order.status === "entregado" && (
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-100">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span className="text-xs font-medium text-emerald-700">Entregado</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Kanban Column ──────────────────────────────────────────────────────────
function KanbanColumn({
  status,
  label,
  orders,
  onSelect,
  onScanQR,
}: {
  status: "pendiente" | "listo" | "entregado"
  label: string
  orders: Order[]
  onSelect: (o: Order) => void
  onScanQR: () => void
}) {
  const styles = {
    pendiente: { dot: "bg-amber-400 animate-pulse", text: "text-amber-600",      count: "bg-amber-100 text-amber-600" },
    listo:     { dot: "bg-price-blue-900",           text: "text-price-blue-900", count: "bg-price-blue-100 text-price-blue-900" },
    entregado: { dot: "bg-emerald-500",              text: "text-emerald-600",    count: "bg-emerald-100 text-emerald-700" },
  }
  const s = styles[status]

  return (
    <div className="flex flex-col min-h-0">
      {/* Column header */}
      <div className="flex items-center justify-between px-1 mb-3 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${s.dot}`} />
          <p className={`text-xs font-semibold uppercase tracking-wide ${s.text}`}>{label}</p>
        </div>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full tabular-nums ${s.count}`}>
          {orders.length}
        </span>
      </div>

      {/* Cards */}
      <div className="flex-1 overflow-y-auto no-scrollbar space-y-2 pr-0.5">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-12 text-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/>
            </svg>
            <p className="text-xs text-gray-300">Sin órdenes</p>
          </div>
        ) : (
          orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onSelect={() => onSelect(order)}
              onScanQR={onScanQR}
            />
          ))
        )}
      </div>
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function StorePage() {
  const { state } = useApp()
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [showScanner, setShowScanner] = useState(false)
  const [mobileTab, setMobileTab] = useState<"pendiente" | "listo" | "entregado">("pendiente")
  const [search, setSearch] = useState("")

  // Derive from live state so the panel always reflects latest status
  const selectedOrder = selectedOrderId
    ? state.orders.find((o) => o.id === selectedOrderId) ?? null
    : null

  const allOrders = [...state.orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  const filtered = search.trim()
    ? allOrders.filter((o) =>
        o.userName.toLowerCase().includes(search.toLowerCase()) ||
        o.id.toLowerCase().includes(search.toLowerCase())
      )
    : allOrders

  const byStatus = {
    pendiente: filtered.filter((o) => o.status === "pendiente"),
    listo:     filtered.filter((o) => o.status === "listo"),
    entregado: filtered.filter((o) => o.status === "entregado"),
  }

  function handleQRScan(data: string) {
    try {
      const parsed = JSON.parse(data)
      const order = state.orders.find((o) => o.id === parsed.orderId)
      if (order) {
        setShowScanner(false)
        setSelectedOrderId(order.id)
      }
    } catch { /* invalid QR */ }
  }

  return (
    <div className="h-screen bg-[#f0f2f7] flex flex-col overflow-hidden">

      {/* ── NAVBAR ──────────────────────────────────────────────────────── */}
      <header className="bg-white border-b border-gray-100 flex items-stretch h-24 z-20 flex-shrink-0">

        {/* Brand block — mirrors shop */}
        <div className="bg-price-blue-900 w-80 flex items-center px-8 relative overflow-hidden flex-shrink-0">
          <div className="absolute top-0 right-0 w-32 h-32 bg-price-pink-500/10 rounded-full blur-2xl -mr-16 -mt-16" />
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center flex-shrink-0">
              <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
                <rect x="4" y="8" width="24" height="16" rx="3" stroke="white" strokeWidth="2.5" fill="none"/>
                <path d="M4 13h24" stroke="white" strokeWidth="2.5"/>
                <rect x="8" y="17" width="6" height="3" rx="1" fill="white"/>
              </svg>
            </div>
            <div>
              <p className="text-[9px] font-bold text-price-blue-300 uppercase tracking-widest leading-none mb-1">Price Shoes Benefits</p>
              <p className="text-white text-xl font-black leading-none tracking-tight">Panel de Tienda</p>
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <span className="text-[9px] font-bold text-price-blue-300 uppercase tracking-widest">En vivo</span>
              </div>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex-1 flex items-center px-8 gap-8">
          {/* Store name */}
          <div>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Sucursal activa</p>
            <p className="text-base font-black text-gray-900 leading-none">Hermosillo Norte</p>
          </div>

          {/* Search — same style as shop */}
          <div className="flex-1 max-w-2xl relative group flex items-center bg-gray-50 border-2 border-price-blue-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-price-blue-400 transition-all focus-within:bg-white focus-within:border-price-pink-500 focus-within:ring-8 focus-within:ring-price-pink-500/5">
            <div className="pl-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-price-blue-600 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </div>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por cliente u orden…"
              className="flex-1 bg-transparent pl-4 pr-6 py-4 text-sm placeholder:text-gray-400 outline-none"
            />
          </div>

          <div className="flex items-center gap-3 ml-auto">
            {/* Order counts */}
            <div className="hidden lg:flex items-center gap-2">
              <div className="flex items-center gap-2 px-3.5 py-2 bg-amber-50 border border-amber-200 rounded-xl">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-xs font-bold text-amber-700 tabular-nums">{byStatus.pendiente.length} pendientes</span>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-2 bg-price-blue-50 border border-price-blue-200 rounded-xl">
                <span className="w-2 h-2 rounded-full bg-price-blue-900" />
                <span className="text-xs font-bold text-price-blue-900 tabular-nums">{byStatus.listo.length} listos</span>
              </div>
            </div>

            {/* Scan QR — same style as shop action buttons */}
            <button
              onClick={() => setShowScanner(true)}
              className="w-12 h-12 rounded-2xl bg-price-blue-900 flex items-center justify-center text-white shadow-lg shadow-price-blue-900/20 hover:scale-105 transition-transform active:scale-95"
              title="Escanear QR"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="3" height="3" rx="0.5"/>
                <rect x="18" y="14" width="3" height="3" rx="0.5"/><rect x="14" y="18" width="3" height="3" rx="0.5"/>
                <rect x="18" y="18" width="3" height="3" rx="0.5"/>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* ── DESKTOP: 3-column kanban ─────────────────────────────────────── */}
      <div className="hidden md:grid grid-cols-3 gap-5 flex-1 overflow-hidden px-6 pt-5 pb-5">
        <KanbanColumn status="pendiente" label="Pendientes"          orders={byStatus.pendiente} onSelect={(o) => setSelectedOrderId(o.id)} onScanQR={() => setShowScanner(true)} />
        <KanbanColumn status="listo"     label="Listos para recoger" orders={byStatus.listo}     onSelect={(o) => setSelectedOrderId(o.id)} onScanQR={() => setShowScanner(true)} />
        <KanbanColumn status="entregado" label="Entregados"          orders={byStatus.entregado} onSelect={(o) => setSelectedOrderId(o.id)} onScanQR={() => setShowScanner(true)} />
      </div>

      {/* ── MOBILE: tabs ────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden md:hidden">
        {/* Mobile search */}
        <div className="px-4 pt-3 pb-2 bg-white border-b border-gray-100">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </div>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar…"
              className="w-full bg-gray-50 border border-gray-100 pl-9 pr-3 py-2 rounded-lg text-xs outline-none"
            />
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex bg-white border-b border-gray-100 flex-shrink-0">
          {(["pendiente", "listo", "entregado"] as const).map((tab) => {
            const labels = { pendiente: "Pendientes", listo: "Listos", entregado: "Entregados" }
            const dotColors = { pendiente: "bg-amber-400", listo: "bg-price-blue-900", entregado: "bg-emerald-500" }
            const active = mobileTab === tab
            return (
              <button
                key={tab}
                onClick={() => setMobileTab(tab)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs transition-colors relative ${
                  active ? "text-price-blue-900 font-medium" : "text-gray-400"
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${dotColors[tab]} ${tab === "pendiente" ? "animate-pulse" : ""}`} />
                {labels[tab]}
                <span className="text-[9px] bg-gray-100 text-gray-400 rounded-full w-4 h-4 flex items-center justify-center">
                  {byStatus[tab].length}
                </span>
                {active && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-price-blue-900 rounded-full" />
                )}
              </button>
            )
          })}
        </div>

        {/* Mobile card list */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 no-scrollbar">
          {byStatus[mobileTab].length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-16 text-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/>
              </svg>
              <p className="text-xs text-gray-300">Sin órdenes aquí</p>
            </div>
          ) : (
            byStatus[mobileTab].map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onSelect={() => setSelectedOrderId(order.id)}
                onScanQR={() => setShowScanner(true)}
              />
            ))
          )}
        </div>
      </div>

      {selectedOrder && (
        <OrderDetailPanel order={selectedOrder} onClose={() => setSelectedOrderId(null)} />
      )}
      {showScanner && (
        <QRScanner onScan={handleQRScan} onClose={() => setShowScanner(false)} />
      )}
    </div>
  )
}
