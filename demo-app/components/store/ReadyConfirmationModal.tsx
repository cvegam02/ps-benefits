"use client"

import Image from "next/image"
import { Order } from "@/lib/types"
import { formatMXN } from "@/lib/mock-data"

interface ReadyConfirmationModalProps {
  order: Order
  onConfirm: () => void
  onClose: () => void
}

export default function ReadyConfirmationModal({ order, onConfirm, onClose }: ReadyConfirmationModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-price-blue-900/40 backdrop-blur-md animate-in fade-in duration-300" 
        onClick={onClose} 
      />
      
      {/* Modal */}
      <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-300">
        {/* Header */}
        <div className="bg-price-blue-900 px-8 py-8 text-white relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-price-pink-500/20 rounded-full blur-3xl -mr-16 -mt-16" />
          <div className="relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-5">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h3 className="text-2xl font-black leading-tight mb-2">¿Confirmar pedido listo?</h3>
            <p className="text-price-blue-100 text-sm font-medium leading-relaxed max-w-[280px]">
              Al confirmar, el pedido pasará a <span className="text-white font-bold">"Listo para Recoger"</span> y notificaremos al cliente.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-6 text-gray-900">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Artículos en esta orden ({order.items.length})</p>
            <span className="text-[10px] font-mono font-bold bg-gray-100 text-gray-500 px-2 py-1 rounded-md">{order.id}</span>
          </div>

          <div className="max-h-[220px] overflow-y-auto pr-2 mb-6 custom-scrollbar space-y-3">
            {order.items.map((item) => (
              <div key={item.product.id} className="flex items-center gap-4 p-3 rounded-2xl bg-gray-50 border border-gray-100/50">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white border border-gray-100 flex-shrink-0">
                  {item.product.image && (
                    <Image 
                      src={item.product.image} 
                      alt={item.product.name} 
                      fill 
                      className="object-cover" 
                      unoptimized 
                    />
                  )}
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-price-blue-900 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-900 truncate">{item.product.name}</p>
                  <p className="text-[10px] text-gray-400 font-medium mt-0.5 uppercase tracking-wider">{item.product.sku || 'SKU-PENDIENTE'}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black text-price-blue-900 tabular-nums">
                    {formatMXN(Math.round(item.product.price * (1 - order.discount / 100)) * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-4 mt-4">
            <button
              onClick={onClose}
              className="flex-1 py-5 px-6 rounded-[1.5rem] bg-gray-100 text-gray-600 font-bold text-sm hover:bg-gray-200 active:scale-[0.98] transition-all"
            >
              Regresar
            </button>
            <button
              onClick={onConfirm}
              className="flex-[2] py-5 px-6 rounded-[1.5rem] bg-price-pink-600 text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-price-pink-600/20 hover:bg-price-pink-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <span>Sí, está listo</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Demo Hint */}
        <div className="px-8 py-4 bg-price-blue-50/50 border-t border-price-blue-100/30 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-price-blue-100 flex items-center justify-center text-price-blue-600">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </div>
          <p className="text-[10px] text-price-blue-700 font-bold uppercase tracking-widest leading-none">Se enviará notificación PUSH y Email</p>
        </div>
      </div>
    </div>
  )
}
