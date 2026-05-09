"use client"

import Image from "next/image"
import { Order } from "@/lib/types"

interface DeliveryConfirmationModalProps {
  order: Order
  onConfirm: () => void
  onClose: () => void
}

export default function DeliveryConfirmationModal({ order, onConfirm, onClose }: DeliveryConfirmationModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-emerald-900/40 backdrop-blur-md animate-in fade-in duration-300" 
        onClick={onClose} 
      />
      
      {/* Modal */}
      <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-300">
        {/* Header */}
        <div className="bg-emerald-600 px-8 py-8 text-white relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl -mr-16 -mt-16" />
          <div className="relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-5">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </div>
            <h3 className="text-2xl font-black leading-tight mb-2">¿Confirmar entrega?</h3>
            <p className="text-emerald-50 text-sm font-medium leading-relaxed max-w-[280px]">
              Estás a punto de marcar este pedido como <span className="text-white font-bold">&quot;Entregado&quot;</span> al cliente final.
            </p>
          </div>
        </div>

        {/* Customer Info Section */}
        <div className="px-8 pt-6 pb-2">
           <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center gap-4">
             <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center text-white text-lg font-black shadow-sm">
               {order.userName.charAt(0).toUpperCase()}
             </div>
             <div>
               <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest leading-none mb-1">Entregar a:</p>
               <p className="text-base font-black text-gray-900 leading-none">{order.userName}</p>
               <p className="text-xs text-gray-500 font-medium mt-1">{order.tenantName}</p>
             </div>
           </div>
        </div>

        {/* Content */}
        <div className="px-8 py-4 text-gray-900">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Artículos a entregar ({order.items.length})</p>
            <span className="text-[10px] font-mono font-bold bg-gray-100 text-gray-500 px-2 py-1 rounded-md">{order.id}</span>
          </div>

          <div className="max-h-[180px] overflow-y-auto pr-2 mb-6 custom-scrollbar space-y-3">
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
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-600 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-900 truncate">{item.product.name}</p>
                  <p className="text-[10px] text-gray-400 font-medium mt-0.5 uppercase tracking-wider">{item.product.sku || 'SKU-ENTREGADO'}</p>
                </div>
                <div className="text-right">
                   <p className="text-xs font-black text-emerald-700 tabular-nums">
                    Listo
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-4 mt-2">
            <button
              onClick={onClose}
              className="flex-1 py-5 px-6 rounded-[1.5rem] bg-gray-100 text-gray-600 font-bold text-sm hover:bg-gray-200 active:scale-[0.98] transition-all"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="flex-[2] py-5 px-6 rounded-[1.5rem] bg-emerald-600 text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <span>Confirmar entrega</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Footer Info */}
        <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
           <div className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2.5">
                <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
              </svg>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-none">Retiro en Sucursal Finalizado</p>
           </div>
           <p className="text-[10px] font-mono font-bold text-gray-300">#{order.id.split('-')[1] || 'REF'}</p>
        </div>
      </div>
    </div>
  )
}
