"use client"

import { useEffect } from "react"
import { useApp } from "@/context/AppContext"
import { tenants } from "@/lib/mock-data"

export default function ProcessingView() {
  const { state, dispatch } = useApp()

  const tenantName = state.currentUser
    ? tenants.find((t) => t.id === state.currentUser!.tenantId)?.name ?? "Price Shoes Benefits"
    : "Price Shoes Benefits"

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch({ type: "SET_VIEW", payload: "qr" })
    }, 2500)
    return () => clearTimeout(timer)
  }, [dispatch])

  return (
    <>
      {/* ── MOBILE ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col h-full md:hidden bg-gray-50">

        {/* Atmospheric Header */}
        <div className="relative bg-price-blue-900 pt-6 pb-8 px-4 overflow-hidden shadow-xl shadow-price-blue-900/20 flex-shrink-0">
          <div className="absolute top-0 right-0 w-48 h-48 bg-price-pink-500/10 rounded-full blur-3xl -mr-10 -mt-10" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-price-blue-400/10 rounded-full blur-2xl -ml-10 -mb-10" />
          <div className="relative z-10">
            <p className="text-[10px] font-bold text-price-blue-300 uppercase tracking-widest leading-none mb-1">Price Shoes Benefits</p>
            <p className="text-white text-lg font-bold leading-none">Procesando pago</p>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center gap-6 px-8">
          {/* Spinner */}
          <div className="relative w-24 h-24">
            <svg className="animate-spin w-24 h-24" viewBox="0 0 96 96" fill="none">
              <circle cx="48" cy="48" r="40" stroke="#e2e8f0" strokeWidth="6" />
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="#1e3a8a"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray="100 151"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
              </svg>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-xl font-black text-gray-900 mb-1">Procesando pago</h2>
            <p className="text-base text-gray-500">Por favor espera un momento...</p>
          </div>

          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2.5 h-2.5 rounded-full bg-price-blue-900 animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>

          <div className="flex items-center gap-2 bg-white rounded-2xl px-4 py-3 border border-gray-100 shadow-sm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
            <span className="text-sm text-price-blue-900 font-medium">Transacción segura y encriptada</span>
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
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <line x1="2" y1="10" x2="22" y2="10" />
                </svg>
              </div>
              <div>
                <p className="text-[9px] font-bold text-price-blue-300 uppercase tracking-widest leading-none mb-1">Price Shoes Benefits</p>
                <p className="text-white text-xl font-black leading-none tracking-tight">{tenantName}</p>
              </div>
            </div>
          </div>
          <div className="flex-1 flex items-center px-8">
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Procesando pago</h1>
          </div>
        </header>

        {/* Main content */}
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-white rounded-[2.5rem] border border-gray-100 p-16 flex flex-col items-center gap-8 shadow-sm">
            <div className="relative w-28 h-28">
              <svg className="animate-spin w-28 h-28" viewBox="0 0 112 112" fill="none">
                <circle cx="56" cy="56" r="48" stroke="#e2e8f0" strokeWidth="8" />
                <circle
                  cx="56"
                  cy="56"
                  r="48"
                  stroke="#1e3a8a"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray="120 181"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <line x1="2" y1="10" x2="22" y2="10" />
                </svg>
              </div>
            </div>

            <div className="text-center">
              <h2 className="text-2xl font-black text-gray-900 mb-2">Procesando pago</h2>
              <p className="text-gray-500 text-base">Verificando tu información de pago...</p>
              <p className="text-gray-400 text-sm mt-1">Por favor espera un momento</p>
            </div>

            <div className="flex gap-2.5">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-3 h-3 rounded-full bg-price-blue-900 animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>

            <div className="flex items-center gap-2 text-sm text-price-blue-900 bg-price-blue-50 rounded-2xl px-5 py-3 border border-price-blue-100">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0110 0v4"/>
              </svg>
              Transacción segura y encriptada
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
