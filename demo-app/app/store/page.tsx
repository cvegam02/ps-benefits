"use client"

import { useState } from "react"
import Image from "next/image"
import { useApp } from "@/context/AppContext"
import { Order } from "@/lib/types"
import { formatMXN, timeAgo } from "@/lib/mock-data"
import OrderDetailPanel from "@/components/store/OrderDetailPanel"
import ReadyConfirmationModal from "@/components/store/ReadyConfirmationModal"
import DeliveryConfirmationModal from "@/components/store/DeliveryConfirmationModal"
import QRScanner from "@/components/store/QRScanner"
import { playSound } from "@/lib/sounds"

// ── Order Card ─────────────────────────────────────────────────────────────
function OrderCard({
  order,
  onSelect,
  onScanQR,
  onMarkReady,
}: {
  order: Order
  onSelect: () => void
  onScanQR: (order: Order) => void
  onMarkReady: (order: Order) => void
}) {

  function handleMarkReady(e: React.MouseEvent) {
    e.stopPropagation()
    onMarkReady(order)
  }

  const accentBar = order.status === "pendiente" ? "bg-amber-400"
    : order.status === "listo" ? "bg-price-blue-900"
    : "bg-emerald-500"

  const borderColor = order.status === "pendiente" ? "border-amber-200"
    : order.status === "listo" ? "border-price-blue-300"
    : "border-emerald-200"

  const shadowColor = order.status === "pendiente" ? "shadow-amber-900/5"
    : order.status === "listo" ? "shadow-price-blue-900/10"
    : "shadow-emerald-900/5"

  return (
    <div
      onClick={onSelect}
      className={`group bg-white rounded-3xl border-2 ${borderColor} ${shadowColor} shadow-xl hover:shadow-2xl hover:border-price-pink-300 cursor-pointer transition-all duration-300 active:scale-[0.98] flex relative z-10`}
    >
      {/* Status Accent Bar with subtle gradient - Rounded corners added for non-overflow parent */}
      <div className={`w-2.5 flex-shrink-0 ${accentBar} bg-gradient-to-b from-white/20 to-black/10 rounded-l-[1.4rem]`} />

      <div className="flex-1 p-6 min-w-0">

        {/* Top row: order ID + time */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-black text-gray-400 tracking-widest uppercase">{order.id}</span>
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-tight">{order.items.length} Artículos</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 border border-gray-200 shadow-sm">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            <span className="text-[10px] font-black text-gray-600">{timeAgo(order.createdAt).toUpperCase()}</span>
          </div>
        </div>

        {/* Customer row */}
        <div className="flex items-center gap-4 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-price-blue-900 flex items-center justify-center text-white text-base font-black flex-shrink-0 shadow-lg shadow-price-blue-900/20 ring-4 ring-price-blue-50">
            {order.userName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-base font-black text-gray-900 leading-tight truncate tracking-tight">{order.userName}</p>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-[11px] font-bold text-gray-500 truncate">{order.tenantName}</p>
              <span className="inline-flex items-center gap-1 text-[10px] font-black text-price-pink-600 bg-price-pink-50 border border-price-pink-100 rounded-lg px-2 py-0.5 flex-shrink-0">
                💎 {order.discount}%
              </span>
            </div>
          </div>
        </div>

        {/* Mini Product Preview - NO OVERLAP + TOOLTIP */}
        <div className="flex flex-wrap gap-2 mb-5">
          {order.items.slice(0, 4).map((item) => (
            <div 
              key={item.product.id} 
              className="group/prod relative w-11 h-11 rounded-xl bg-white border border-gray-100 shadow-sm flex-shrink-0 hover:border-price-blue-400 hover:scale-110 transition-all duration-300"
            >
              <div className="relative w-full h-full rounded-xl overflow-hidden">
                {item.product.image && <Image src={item.product.image} alt={item.product.name} fill className="object-cover" unoptimized />}
              </div>
              
              {/* Premium Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 p-3 bg-price-blue-900 text-white rounded-2xl opacity-0 group-hover/prod:opacity-100 translate-y-2 group-hover/prod:translate-y-0 transition-all duration-300 z-50 pointer-events-none shadow-2xl border border-white/10">
                <div className="relative z-10">
                  <p className="text-[10px] font-black text-price-pink-400 uppercase tracking-widest mb-1">{item.product.brand || 'Price Shoes'}</p>
                  <p className="text-xs font-bold leading-tight mb-1.5">{item.product.name}</p>
                  <p className="text-[10px] text-white/60 leading-relaxed line-clamp-3 italic">
                    {item.product.description || 'Detalles premium seleccionados para este pedido.'}
                  </p>
                </div>
                {/* Tooltip Arrow */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-price-blue-900" />
              </div>
            </div>
          ))}
          {order.items.length > 4 && (
            <div className="relative w-11 h-11 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center shadow-sm">
              <span className="text-[10px] font-black text-gray-400">+{order.items.length - 4}</span>
            </div>
          )}
        </div>

        {/* Footer: total + CTA */}
        <div className="flex items-center gap-4 pt-5 border-t border-gray-50">
          <div className="flex-1">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] leading-none mb-1">Total Orden</p>
            <p className="text-lg font-black text-price-blue-900 leading-none tabular-nums tracking-tighter">{formatMXN(order.total)}</p>
          </div>

          {order.status === "pendiente" && (
            <button
              onClick={handleMarkReady}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-price-blue-900 text-white text-xs font-black uppercase tracking-widest hover:bg-price-blue-800 active:scale-95 transition-all shadow-xl shadow-price-blue-900/20"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Listo
            </button>
          )}

          {order.status === "listo" && (
            <button
              onClick={(e) => { e.stopPropagation(); onScanQR(order) }}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-price-pink-600 text-white text-xs font-black uppercase tracking-widest hover:bg-price-pink-500 active:scale-95 transition-all shadow-xl shadow-price-pink-600/30"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="3" height="3"/>
              </svg>
              Escanear
            </button>
          )}

          {order.status === "entregado" && (
            <div className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-emerald-50 border-2 border-emerald-100 text-emerald-600">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span className="text-[11px] font-black uppercase tracking-wider">Entregado</span>
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
  onMarkReady,
}: {
  status: "pendiente" | "listo" | "entregado"
  label: string
  orders: Order[]
  onSelect: (o: Order) => void
  onScanQR: (order: Order) => void
  onMarkReady: (order: Order) => void
}) {
  const styles = {
    pendiente: { dot: "bg-amber-400 animate-pulse", text: "text-amber-600",      count: "bg-amber-100 text-amber-600" },
    listo:     { dot: "bg-price-blue-900",           text: "text-price-blue-900", count: "bg-price-blue-100 text-price-blue-900" },
    entregado: { dot: "bg-emerald-500",              text: "text-emerald-600",    count: "bg-emerald-100 text-emerald-700" },
  }
  const s = styles[status]

  return (
    <div className="flex flex-col min-h-0 overflow-y-auto no-scrollbar pb-10">
      {/* Column header */}
      <div className="flex items-center justify-between px-2 mb-4 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${s.dot}`} />
          <p className={`text-xs font-black uppercase tracking-widest ${s.text}`}>{label}</p>
        </div>
        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full tabular-nums ${s.count}`}>
          {orders.length}
        </span>
      </div>

      {/* Cards Area - Overflow handled by parent */}
      <div className="space-y-4 pr-1">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-center opacity-40">
            <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/>
              </svg>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Sin órdenes</p>
          </div>
        ) : (
          orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onSelect={() => onSelect(order)}
              onScanQR={onScanQR}
              onMarkReady={onMarkReady}
            />
          ))
        )}
      </div>
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function StorePage() {
  const { state, dispatch } = useApp()
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [orderToMarkReady, setOrderToMarkReady] = useState<Order | null>(null)
  const [orderToDeliver, setOrderToDeliver] = useState<Order | null>(null)
  const [showScanner, setShowScanner] = useState(false)
  const [mobileTab, setMobileTab] = useState<"pendiente" | "listo" | "entregado">("pendiente")
  const [search, setSearch] = useState("")

  function confirmMarkReady() {
    if (orderToMarkReady) {
      dispatch({ type: "UPDATE_ORDER_STATUS", payload: { orderId: orderToMarkReady.id, status: "listo" } })
      playSound('success')
      setOrderToMarkReady(null)
    }
  }

  function confirmDelivery() {
    if (orderToDeliver) {
      dispatch({ type: "UPDATE_ORDER_STATUS", payload: { orderId: orderToDeliver.id, status: "entregado" } })
      playSound('delivery')
      setOrderToDeliver(null)
    }
  }

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
        if (order.status === "listo") {
          setOrderToDeliver(order)
        } else {
          setSelectedOrderId(order.id)
        }
      }
    } catch { /* invalid QR */ }
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden relative">

      {/* ── NAVBAR ──────────────────────────────────────────────────────── */}
      <header className="relative z-20 bg-price-blue-900 border-b border-white/10 flex-shrink-0 shadow-xl shadow-price-blue-900/20 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-price-pink-500/10 rounded-full blur-3xl -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-price-blue-400/10 rounded-full blur-2xl -ml-20 -mb-20" />

        {/* Mobile compact header */}
        <div className="md:hidden relative z-10 flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg flex-shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            </div>
            <div>
              <p className="text-[9px] font-bold text-price-blue-300 uppercase tracking-widest leading-none mb-0.5">Price Shoes Benefits</p>
              <p className="text-white text-base font-black leading-none tracking-tight">Panel de Tienda</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 h-9 px-3 bg-white/5 border border-white/10 rounded-xl">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-[10px] font-black text-white tabular-nums">{byStatus.pendiente.length}</span>
            </div>
            <button
              onClick={() => setShowScanner(true)}
              className="w-11 h-11 rounded-xl bg-price-pink-600 hover:bg-price-pink-500 text-white shadow-lg shadow-price-pink-600/30 transition-all active:scale-90 flex items-center justify-center"
              title="Escáner"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/>
                <rect x="7" y="7" width="3" height="3"/><rect x="14" y="7" width="3" height="3"/><rect x="7" y="14" width="3" height="3"/><rect x="14" y="14" width="3" height="3"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Desktop header */}
        <div className="hidden md:flex items-stretch h-24 w-full">

        {/* Brand block */}
        <div className="w-80 flex items-center px-8 relative border-r border-white/5">
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] font-bold text-price-blue-300 uppercase tracking-widest leading-none mb-1">Price Shoes Benefits</p>
              <p className="text-white text-xl font-black leading-none tracking-tight">Panel de Tienda</p>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">Sucursal Activa</span>
              </div>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex-1 flex items-center px-10 gap-10">
          <div className="hidden xl:block">
            <p className="text-[9px] font-bold text-price-blue-300 uppercase tracking-widest leading-none mb-1">Sucursal Terminal</p>
            <p className="text-sm font-bold text-white leading-none">Hermosillo Norte — <span className="text-price-blue-300">HMO-01</span></p>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-xl relative group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-price-blue-300 group-focus-within:text-white transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </div>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filtrar por orden, cliente o ID..."
              className="w-full bg-white/10 border border-white/20 rounded-2xl pl-12 pr-6 py-3.5 text-sm font-medium text-white placeholder:text-price-blue-300 outline-none focus:bg-white/20 focus:border-white/40 transition-all duration-300"
            />
          </div>

          <div className="flex items-center gap-6 ml-auto">
            {/* Status counts */}
            <div className="hidden lg:flex items-center gap-3">
              <div className="h-10 px-4 bg-white/5 border border-white/10 rounded-xl flex items-center gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-[11px] font-black text-white uppercase tracking-wider">{byStatus.pendiente.length} Pendientes</span>
              </div>
              <div className="h-10 px-4 bg-white/10 border border-white/20 rounded-xl flex items-center gap-2.5 shadow-lg shadow-black/10">
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
                <span className="text-[11px] font-black text-white uppercase tracking-wider">{byStatus.listo.length} Listos</span>
              </div>
            </div>

            {/* Scan button — Brand Pink */}
            <button
              onClick={() => setShowScanner(true)}
              className="w-14 h-14 rounded-2xl bg-price-pink-600 hover:bg-price-pink-500 text-white shadow-xl shadow-price-pink-600/30 transition-all duration-300 active:scale-90 flex items-center justify-center group ring-4 ring-price-pink-600/20"
              title="Escáner Terminal"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform">
                <path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/>
                <rect x="7" y="7" width="3" height="3"/><rect x="14" y="7" width="3" height="3"/><rect x="7" y="14" width="3" height="3"/><rect x="14" y="14" width="3" height="3"/>
              </svg>
            </button>
          </div>
        </div>
        </div>{/* end Desktop header */}
      </header>

      {/* ── DESKTOP: 3-column kanban ─────────────────────────────────────── */}
      <div className="hidden md:grid grid-cols-3 gap-6 flex-1 px-8 pt-8 pb-8 relative z-10">
        <KanbanColumn status="pendiente" label="Pendientes"          orders={byStatus.pendiente} onSelect={(o) => setSelectedOrderId(o.id)} onScanQR={(o) => setOrderToDeliver(o)} onMarkReady={setOrderToMarkReady} />
        <KanbanColumn status="listo"     label="Listos para recoger" orders={byStatus.listo}     onSelect={(o) => setSelectedOrderId(o.id)} onScanQR={(o) => setOrderToDeliver(o)} onMarkReady={setOrderToMarkReady} />
        <KanbanColumn status="entregado" label="Entregados"          orders={byStatus.entregado} onSelect={(o) => setSelectedOrderId(o.id)} onScanQR={(o) => setOrderToDeliver(o)} onMarkReady={setOrderToMarkReady} />
      </div>

      {/* ── MOBILE: tabs ────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden md:hidden">
        {/* Mobile search */}
        <div className="px-4 py-4 bg-white border-b border-gray-100">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </div>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar órdenes..."
              className="w-full bg-gray-50 border border-gray-100 pl-10 pr-4 py-2.5 rounded-xl text-xs font-bold outline-none"
            />
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex bg-white border-b border-gray-200 flex-shrink-0">
          {(["pendiente", "listo", "entregado"] as const).map((tab) => {
            const labels = { pendiente: "PENDIENTES", listo: "LISTOS", entregado: "ENTREGADOS" }
            const colors = { 
              pendiente: "text-amber-500", 
              listo: "text-price-blue-900", 
              entregado: "text-emerald-500" 
            }
            const active = mobileTab === tab
            return (
              <button
                key={tab}
                onClick={() => setMobileTab(tab)}
                className={`flex-1 flex flex-col items-center justify-center gap-1.5 py-4 text-[10px] tracking-widest transition-all duration-300 relative ${
                  active ? colors[tab] + " font-black" : "text-gray-400 font-bold"
                }`}
              >
                {active && (
                  <span className={`absolute bottom-0 left-4 right-4 h-1 bg-current rounded-t-full shadow-[0_-4px_10px_rgba(0,0,0,0.1)]`} />
                )}
                {labels[tab]}
                <span className={`px-2 py-0.5 rounded-full text-[9px] ${active ? "bg-gray-100" : "bg-gray-50"} tabular-nums`}>
                  {byStatus[tab].length}
                </span>
              </button>
            )
          })}
        </div>

        {/* Mobile card list */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 no-scrollbar bg-gray-50/50">
          {byStatus[mobileTab].length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-20 text-center opacity-40">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/>
              </svg>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Sin órdenes aquí</p>
            </div>
          ) : (
            byStatus[mobileTab].map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onSelect={() => setSelectedOrderId(order.id)}
                onScanQR={(o) => setOrderToDeliver(o)}
                onMarkReady={setOrderToMarkReady}
              />
            ))
          )}
        </div>
      </div>

      {selectedOrder && (
        <OrderDetailPanel order={selectedOrder} onClose={() => setSelectedOrderId(null)} />
      )}
      {orderToMarkReady && (
        <ReadyConfirmationModal 
          order={orderToMarkReady} 
          onConfirm={confirmMarkReady} 
          onClose={() => setOrderToMarkReady(null)} 
        />
      )}
      {orderToDeliver && (
        <DeliveryConfirmationModal
          order={orderToDeliver}
          onConfirm={confirmDelivery}
          onClose={() => setOrderToDeliver(null)}
        />
      )}
      {showScanner && (
        <QRScanner onScan={handleQRScan} onClose={() => setShowScanner(false)} />
      )}
    </div>
  )
}
