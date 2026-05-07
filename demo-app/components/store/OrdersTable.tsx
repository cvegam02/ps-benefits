"use client"

import { Order, OrderStatus } from "@/lib/types"
import { formatMXN, timeAgo } from "@/lib/mock-data"
import { useApp } from "@/context/AppContext"

interface OrdersTableProps {
  orders: Order[]
  onSelectOrder: (order: Order) => void
  onScanQR: (order: Order) => void
  onMarkReady: (order: Order) => void
  onDeliver: (order: Order) => void
}

const STATUS_CONFIG = {
  pendiente: { label: "Pendiente", text: "text-amber-700",       iconBg: "bg-amber-500",       icon: "dot" },
  listo:     { label: "Listo",     text: "text-price-blue-900",  iconBg: "bg-price-blue-900",  icon: "check" },
  entregado: { label: "Entregado", text: "text-emerald-700",     iconBg: "bg-emerald-500",     icon: "check" },
}

const PAYMENT_LABELS: Record<string, string> = {
  tarjeta:     "💳 Tarjeta",
  oxxo:        "🏪 OXXO Pay",
  spei:        "🏦 SPEI",
  meses:       "📆 MSI",
  mercadopago: "🔵 Mercado Pago",
}

export default function OrdersTable({ orders, onSelectOrder, onScanQR, onMarkReady, onDeliver }: OrdersTableProps) {
  const { dispatch } = useApp()

  function handleMarkReady(e: React.MouseEvent, order: Order) {
    e.stopPropagation()
    onMarkReady(order)
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center gap-3">
        <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/>
          </svg>
        </div>
        <div>
          <p className="text-base font-black text-gray-400">No hay órdenes en este filtro</p>
          <p className="text-sm text-gray-300 mt-1">Aparecerán aquí cuando los empleados realicen compras</p>
        </div>
      </div>
    )
  }

  return (
    <table className="w-full">
      <thead>
        <tr className="border-b border-gray-100 bg-gray-50/80">
          <th className="text-left text-xs font-black text-gray-400 uppercase tracking-wider px-7 py-4">Cliente</th>
          <th className="text-left text-xs font-black text-gray-400 uppercase tracking-wider px-5 py-4">Organización</th>
          <th className="text-left text-xs font-black text-gray-400 uppercase tracking-wider px-5 py-4">Productos</th>
          <th className="text-left text-xs font-black text-gray-400 uppercase tracking-wider px-5 py-4">Total</th>
          <th className="text-left text-xs font-black text-gray-400 uppercase tracking-wider px-5 py-4">Estado</th>
          <th className="text-left text-xs font-black text-gray-400 uppercase tracking-wider px-5 py-4">Pago</th>
          <th className="px-5 py-4" />
        </tr>
      </thead>
      <tbody>
        {[...orders].reverse().map((order, idx) => {
          const status = STATUS_CONFIG[order.status]

          return (
            <tr
              key={order.id}
              className={`border-b border-gray-50 last:border-b-0 hover:bg-price-blue-50/40 cursor-pointer transition-colors group ${
                idx % 2 === 1 ? "bg-gray-50/40" : ""
              }`}
              onClick={() => onSelectOrder(order)}
            >
              {/* Cliente */}
              <td className="px-7 py-5">
                <p className="text-base font-black text-gray-900">{order.userName}</p>
                <p className="text-xs font-mono text-gray-400 mt-0.5">{order.id} · hace {timeAgo(order.createdAt)}</p>
              </td>

              {/* Organización */}
              <td className="px-5 py-5">
                <p className="text-sm font-bold text-gray-700">{order.tenantName}</p>
                <p className="text-xs text-price-pink-600 font-black mt-0.5">💎 {order.discount}% OFF</p>
              </td>

              {/* Productos */}
              <td className="px-5 py-5 max-w-xs">
                <div className="flex flex-wrap gap-1.5">
                  {order.items.map((item) => (
                    <span
                      key={item.product.id}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 rounded-lg text-xs font-bold text-gray-600"
                    >
                      {item.product.name.length > 20 ? item.product.name.slice(0, 18) + "…" : item.product.name}
                      <span className="bg-gray-200 text-gray-500 rounded-md px-1 font-black">×{item.quantity}</span>
                    </span>
                  ))}
                </div>
              </td>

              {/* Total */}
              <td className="px-5 py-5">
                <p className="text-base font-black text-gray-900">{formatMXN(order.total)}</p>
                <p className="text-xs text-gray-400 mt-0.5 line-through">{formatMXN(order.subtotal)}</p>
              </td>

              {/* Estado */}
              <td className="px-5 py-5">
                <span className={`inline-flex items-center gap-[7px] text-[13px] font-bold leading-none ${status.text}`}>
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-white flex-shrink-0 ${status.iconBg}`}>
                    {status.icon === "dot"
                      ? <svg width="6" height="6" viewBox="0 0 6 6"><circle cx="3" cy="3" r="2" fill="currentColor"/></svg>
                      : <svg width="9" height="9" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="2,5 4,7 8,3"/></svg>}
                  </span>
                  {status.label}
                </span>
              </td>

              {/* Pago */}
              <td className="px-5 py-5">
                <span className="text-sm font-medium text-gray-500">
                  {PAYMENT_LABELS[order.paymentMethod] ?? order.paymentMethod}
                </span>
              </td>

              {/* Acción */}
              <td className="px-5 py-5" onClick={(e) => e.stopPropagation()}>
                {order.status === "pendiente" && (
                  <button
                    onClick={(e) => handleMarkReady(e, order)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-price-blue-900 text-white text-sm font-black hover:bg-price-blue-800 active:scale-95 transition shadow-sm shadow-price-blue-900/20 whitespace-nowrap"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    Marcar listo
                  </button>
                )}
                {order.status === "listo" && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onScanQR(order) }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-price-pink-600 text-white text-sm font-black hover:bg-price-pink-700 active:scale-95 transition shadow-sm shadow-price-pink-600/20 whitespace-nowrap"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                      <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="3" height="3"/>
                      <rect x="18" y="18" width="3" height="3"/>
                    </svg>
                    Escanear QR
                  </button>
                )}
                {order.status === "entregado" && (
                  <span className="flex items-center gap-2 px-4 py-2.5 text-green-600 text-sm font-black">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    Completado
                  </span>
                )}
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
