"use client"

import { useApp } from "@/context/AppContext"
import { tenants, formatMXN, timeAgo } from "@/lib/mock-data"
import { Order } from "@/lib/types"

const STATUS_CONFIG = {
  pendiente: { label: "Pendiente",  bg: "bg-amber-50",   text: "text-amber-700",  dot: "bg-amber-500"  },
  listo:     { label: "Listo",      bg: "bg-blue-50",    text: "text-blue-700",   dot: "bg-blue-500"   },
  entregado: { label: "Entregado",  bg: "bg-emerald-50", text: "text-emerald-700",dot: "bg-emerald-500"},
}

const PAYMENT_LABELS: Record<string, string> = {
  tarjeta:     "💳 Tarjeta",
  oxxo:        "🏪 OXXO",
  spei:        "🏦 SPEI",
  mercadopago: "💰 Mercado Pago",
  meses:       "📅 Meses sin intereses",
}

function OrderCard({ order }: { order: Order }) {
  const cfg = STATUS_CONFIG[order.status]
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Card header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
        <div>
          <p className="text-xs font-black text-gray-900 leading-none mb-1">{order.id}</p>
          <p className="text-[10px] font-medium text-gray-400">{timeAgo(order.createdAt)}</p>
        </div>
        <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl ${cfg.bg}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
          <p className={`text-[10px] font-bold ${cfg.text}`}>{cfg.label}</p>
        </div>
      </div>

      {/* Products */}
      <div className="px-5 py-3 space-y-2">
        {order.items.map((item) => (
          <div key={item.product.id} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gray-100 overflow-hidden flex-shrink-0">
              {item.product.image ? (
                <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-900 truncate">{item.product.name}</p>
              <p className="text-[10px] text-gray-400">×{item.quantity} · {formatMXN(item.product.price)} c/u</p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-5 py-4 border-t border-gray-50 bg-gray-50/40">
        <div>
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Total pagado</p>
          <p className="text-base font-black text-price-blue-900">{formatMXN(order.total)}</p>
          <p className="text-[10px] text-gray-400 line-through">{formatMXN(order.subtotal)}</p>
        </div>
        <div className="text-right">
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Pago</p>
          <p className="text-[11px] font-semibold text-gray-600">{PAYMENT_LABELS[order.paymentMethod] ?? order.paymentMethod}</p>
          <p className="text-[10px] font-bold text-price-pink-600">-{order.discount}% OFF</p>
        </div>
      </div>
    </div>
  )
}

export default function ProfileView() {
  const { state, dispatch } = useApp()
  const user = state.currentUser!
  const tenant = tenants.find((t) => t.id === user.tenantId)

  const myOrders = state.orders
    .filter((o) => o.userId === user.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const totalSpent = myOrders.filter(o => o.status === "entregado").reduce((s, o) => s + o.total, 0)
  const totalSaved = myOrders.filter(o => o.status === "entregado").reduce((s, o) => s + (o.subtotal - o.total), 0)
  const activeOrders = myOrders.filter(o => o.status !== "entregado").length

  const initials = user.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">

      {/* ── HEADER ────────────────────────────────────────────────────── */}
      {/* Mobile */}
      <div className="relative bg-price-blue-900 pt-6 pb-8 px-5 overflow-hidden shadow-xl shadow-price-blue-900/20 md:hidden flex-shrink-0">
        <div className="absolute top-0 right-0 w-56 h-56 bg-price-pink-500/10 rounded-full blur-3xl -mr-14 -mt-14" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-price-blue-400/10 rounded-full blur-2xl -ml-14 -mb-14" />

        <div className="relative z-10">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-3xl bg-price-pink-600 flex items-center justify-center shadow-xl shadow-price-pink-600/40 flex-shrink-0">
              <span className="text-white text-xl font-black tracking-tight">{initials}</span>
            </div>
            <div className="min-w-0">
              <p className="text-white text-xl font-black leading-tight truncate">{user.name}</p>
              <p className="text-price-blue-300 text-xs font-medium truncate">{user.email}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <div className="bg-white/10 border border-white/20 px-2.5 py-1 rounded-lg">
                  <p className="text-white text-[10px] font-bold leading-none">{tenant?.name ?? user.tenantId}</p>
                </div>
                <div className="bg-price-pink-600/30 border border-price-pink-600/40 px-2.5 py-1 rounded-lg">
                  <p className="text-white text-[10px] font-bold leading-none">{tenant?.discount}% OFF</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop header */}
      <header className="hidden md:flex bg-white border-b border-gray-100 items-stretch h-24 z-20 flex-shrink-0">
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
              <p className="text-white text-xl font-black leading-none tracking-tight">Price Shoes Benefits</p>
            </div>
          </div>
        </div>
        <div className="flex-1 flex items-center px-8 gap-6">
          <button
            onClick={() => dispatch({ type: "SET_VIEW", payload: "catalog" })}
            className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-price-blue-900 transition-colors group"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-0.5 transition-transform">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Volver
          </button>

          {/* Desktop user summary in header */}
          <div className="flex items-center gap-4 ml-2">
            <div className="w-12 h-12 rounded-2xl bg-price-pink-600 flex items-center justify-center shadow-lg shadow-price-pink-600/30 flex-shrink-0">
              <span className="text-white text-base font-black">{initials}</span>
            </div>
            <div>
              <p className="text-lg font-black text-gray-900 leading-tight">{user.name}</p>
              <p className="text-xs font-medium text-gray-400">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <div className="bg-price-blue-50 border border-price-blue-100 px-4 py-2 rounded-xl">
              <p className="text-[8px] font-bold text-price-blue-400 uppercase tracking-widest leading-none mb-1">Empresa</p>
              <p className="text-price-blue-900 text-xs font-black leading-none">{tenant?.name ?? user.tenantId}</p>
            </div>
            <div className="bg-price-pink-50 border border-price-pink-100 px-4 py-2 rounded-xl">
              <p className="text-[8px] font-bold text-price-pink-400 uppercase tracking-widest leading-none mb-1">Beneficio</p>
              <p className="text-price-pink-600 text-xs font-black leading-none">{tenant?.discount}% OFF</p>
            </div>
          </div>
        </div>
      </header>

      {/* ── CONTENT ───────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="md:flex md:gap-0">

          {/* ── LEFT / MAIN COLUMN ──────────────────────────────────── */}
          <div className="flex-1 px-4 md:px-8 pt-6 md:pt-8 pb-32 md:pb-12 space-y-5">

            {/* Stat cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex flex-col gap-1">
                <div className="w-8 h-8 rounded-2xl bg-price-blue-900/10 flex items-center justify-center mb-1">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
                  </svg>
                </div>
                <p className="text-xl font-black text-price-blue-900 leading-none">{myOrders.length}</p>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-tight">Pedidos totales</p>
              </div>

              <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex flex-col gap-1">
                <div className="w-8 h-8 rounded-2xl bg-price-pink-600/10 flex items-center justify-center mb-1">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#db2777" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
                  </svg>
                </div>
                <p className="text-xl font-black text-price-pink-600 leading-none truncate">{totalSaved > 0 ? formatMXN(totalSaved) : "$0"}</p>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-tight">Ahorro total</p>
              </div>

              <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex flex-col gap-1">
                <div className="w-8 h-8 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-1">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                </div>
                <p className="text-xl font-black text-amber-600 leading-none">{activeOrders}</p>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-tight">En proceso</p>
              </div>
            </div>

            {/* Orders section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-black text-gray-900">Mis pedidos</p>
                {myOrders.length > 0 && (
                  <span className="text-[10px] font-bold text-gray-400">{myOrders.length} pedido{myOrders.length !== 1 ? "s" : ""}</span>
                )}
              </div>

              {myOrders.length === 0 ? (
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10 flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-3xl bg-gray-100 flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
                    </svg>
                  </div>
                  <p className="text-sm font-black text-gray-400">Sin pedidos aún</p>
                  <button
                    onClick={() => dispatch({ type: "SET_VIEW", payload: "catalog" })}
                    className="text-xs font-bold text-price-blue-900 underline underline-offset-2"
                  >
                    Ir al catálogo
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {myOrders.map((order) => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                </div>
              )}
            </div>

            {/* Account info */}
            <div>
              <p className="text-sm font-black text-gray-900 mb-3">Información de cuenta</p>
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                {[
                  {
                    icon: <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>,
                    icon2: <circle cx="12" cy="7" r="4"/>,
                    label: "Nombre completo",
                    value: user.name,
                  },
                  {
                    icon: <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>,
                    icon2: <polyline points="22,6 12,13 2,6"/>,
                    label: "Correo electrónico",
                    value: user.email,
                  },
                  {
                    icon: <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>,
                    icon2: null,
                    label: "Teléfono",
                    value: user.phone,
                  },
                  {
                    icon: <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>,
                    icon2: <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/>,
                    label: "Número de empleado",
                    value: user.employeeNumber,
                  },
                ].map((row, i, arr) => (
                  <div
                    key={row.label}
                    className={`flex items-center gap-4 px-5 py-4 ${i < arr.length - 1 ? "border-b border-gray-50" : ""}`}
                  >
                    <div className="w-9 h-9 rounded-2xl bg-gray-100 flex items-center justify-center flex-shrink-0 text-gray-500">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        {row.icon}
                        {row.icon2}
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">{row.label}</p>
                      <p className="text-sm font-semibold text-gray-900 truncate">{row.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Company / Tenant */}
            <div>
              <p className="text-sm font-black text-gray-900 mb-3">Mi empresa</p>
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-3xl bg-price-blue-900 flex items-center justify-center shadow-lg shadow-price-blue-900/20">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                        <polyline points="9 22 9 12 15 12 15 22"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-base font-black text-gray-900 leading-tight">{tenant?.name ?? user.tenantId}</p>
                      <p className="text-[10px] font-medium text-gray-400">Beneficio corporativo activo</p>
                    </div>
                  </div>
                  <div className="bg-price-pink-50 border border-price-pink-100 px-3.5 py-2 rounded-2xl flex-shrink-0">
                    <p className="text-[9px] font-bold text-price-pink-400 uppercase tracking-widest leading-none mb-0.5">Descuento</p>
                    <p className="text-xl font-black text-price-pink-600 leading-none">{tenant?.discount}%</p>
                  </div>
                </div>

                {/* Spent with company */}
                {totalSpent > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                    <p className="text-xs font-medium text-gray-500">Total aprovechado con beneficio</p>
                    <p className="text-sm font-black text-price-blue-900">{formatMXN(totalSpent)}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Settings / Actions */}
            <div>
              <p className="text-sm font-black text-gray-900 mb-3">Configuración</p>
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                {[
                  { label: "Notificaciones", icon: <><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></> },
                  { label: "Privacidad y términos", icon: <><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></> },
                  { label: "Ayuda y soporte", icon: <><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></> },
                ].map((item, i) => (
                  <button
                    key={item.label}
                    className={`w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-gray-50 active:bg-gray-100 transition-colors ${i < 2 ? "border-b border-gray-50" : ""}`}
                  >
                    <div className="w-9 h-9 rounded-2xl bg-gray-100 flex items-center justify-center flex-shrink-0 text-gray-500">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        {item.icon}
                      </svg>
                    </div>
                    <p className="flex-1 text-sm font-semibold text-gray-700">{item.label}</p>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 18l6-6-6-6"/>
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={() => dispatch({ type: "LOGOUT" })}
              className="w-full bg-white border border-red-100 rounded-3xl py-4 flex items-center justify-center gap-3 shadow-sm active:scale-[0.98] transition-all group"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              <span className="text-sm font-bold text-red-500">Cerrar sesión</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── BOTTOM NAV (mobile) ───────────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-5 pt-2 pointer-events-none md:hidden">
        <div className="pointer-events-auto bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.12)] border border-white/60 px-3 py-2 flex items-center">
          <button onClick={() => dispatch({ type: "SET_VIEW", payload: "catalog" })} className="flex-1 flex flex-col items-center justify-center gap-1 py-1 group">
            <div className="flex items-center justify-center w-10 h-10 rounded-2xl group-active:bg-gray-100 transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
              </svg>
            </div>
            <span className="text-[10px] font-bold text-gray-400 tracking-tight">Inicio</span>
          </button>

          <button onClick={() => dispatch({ type: "SET_VIEW", payload: "stores" })} className="flex-1 flex flex-col items-center justify-center gap-1 py-1 group">
            <div className="flex items-center justify-center w-10 h-10 rounded-2xl group-active:bg-gray-100 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <span className="text-[10px] font-bold text-gray-400 tracking-tight">Tiendas</span>
          </button>

          <button onClick={() => dispatch({ type: "SET_VIEW", payload: "cart" })} className="flex-1 flex flex-col items-center justify-center gap-1 py-1 group">
            <div className="flex items-center justify-center w-10 h-10 rounded-2xl group-active:bg-gray-100 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
              </svg>
            </div>
            <span className="text-[10px] font-bold text-gray-400 tracking-tight">Carrito</span>
          </button>

          <button className="flex-1 flex flex-col items-center justify-center gap-1 py-1">
            <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-price-blue-900 shadow-lg shadow-price-blue-900/30">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <span className="text-[10px] font-black text-price-blue-900 tracking-tight">Cuenta</span>
          </button>
        </div>
      </div>
    </div>
  )
}
