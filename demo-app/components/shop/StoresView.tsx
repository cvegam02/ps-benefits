"use client"

import { useApp } from "@/context/AppContext"
import { useState } from "react"

const STORES = [
  {
    id: 1,
    name: "Tienda Hermosillo Norte",
    address: "Blvd. José María Morelos #345, Col. Bachoco",
    hours: "Lun - Dom: 9:00 AM - 9:00 PM",
    phone: "(662) 214-5566",
    lat: 29.1234,
    lng: -110.9567,
  },
  {
    id: 2,
    name: "Tienda Hermosillo Poniente",
    address: "Blvd. Colosio #789, Col. Los Arcos",
    hours: "Lun - Dom: 10:00 AM - 10:00 PM",
    phone: "(662) 218-4422",
    lat: 29.0876,
    lng: -111.0123,
  },
  {
    id: 3,
    name: "Tienda Galerías Mall",
    address: "Cultura #55, Proyecto Río Sonora",
    hours: "Lun - Dom: 11:00 AM - 9:00 PM",
    phone: "(662) 212-3344",
    lat: 29.0745,
    lng: -110.9632,
  },
  {
    id: 4,
    name: "Tienda Hermosillo Sur",
    address: "Carr. a Sahuaripa #12, Col. Parque Industrial",
    hours: "Lun - Sáb: 8:00 AM - 8:00 PM",
    phone: "(662) 250-1122",
    lat: 29.0521,
    lng: -110.9312,
  },
  {
    id: 5,
    name: "Tienda Centro Histórico",
    address: "Av. Serdán #201, Col. Centro",
    hours: "Lun - Dom: 9:00 AM - 8:00 PM",
    phone: "(662) 213-9988",
    lat: 29.0789,
    lng: -110.9543,
  },
]

type Store = (typeof STORES)[number]

// Hermosillo city center coordinates
const HERMOSILLO_CENTER = { lat: 29.0729, lng: -110.9559 }

function GoogleMapFrame({ store, overview }: { store: Store; overview: boolean }) {
  const src = overview
    ? `https://maps.google.com/maps?q=${HERMOSILLO_CENTER.lat},${HERMOSILLO_CENTER.lng}&z=12&output=embed&hl=es`
    : `https://maps.google.com/maps?q=${store.lat},${store.lng}&z=15&output=embed&hl=es`
  return (
    <iframe
      key={overview ? "overview" : store.id}
      src={src}
      className="absolute inset-0 w-full h-full border-0"
      title={overview ? "Hermosillo" : `Mapa ${store.name}`}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    />
  )
}

export default function StoresView() {
  const { dispatch } = useApp()
  const [selectedStore, setSelectedStore] = useState<Store>(STORES[0])
  const [showList, setShowList] = useState(false)
  const [mapOverview, setMapOverview] = useState(true)

  function selectStore(store: Store) {
    setSelectedStore(store)
    setMapOverview(false)
    setShowList(false)
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50">

      {/* ── HEADER ────────────────────────────────────────────────────── */}
      {/* Mobile */}
      <div className="relative bg-price-blue-900 pt-6 pb-8 px-4 overflow-hidden shadow-xl shadow-price-blue-900/20 md:hidden flex-shrink-0">
        <div className="absolute top-0 right-0 w-48 h-48 bg-price-pink-500/10 rounded-full blur-3xl -mr-10 -mt-10" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-price-blue-400/10 rounded-full blur-2xl -ml-10 -mb-10" />
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] font-bold text-price-blue-300 uppercase tracking-widest leading-none mb-1">Localizador</p>
              <p className="text-white text-lg font-bold leading-none">Nuestras Tiendas</p>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20">
            <p className="text-[8px] font-bold text-price-blue-300 uppercase tracking-widest leading-none mb-0.5">Hermosillo</p>
            <p className="text-white text-[10px] font-bold leading-none">Sonora, MX</p>
          </div>
        </div>
      </div>

      {/* Desktop */}
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
        <div className="flex-1 flex items-center px-8 gap-8">
          <button
            onClick={() => dispatch({ type: "SET_VIEW", payload: "catalog" })}
            className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-price-blue-900 transition-colors group"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-0.5 transition-transform">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Volver al catálogo
          </button>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Nuestras Tiendas</h1>
          <div className="flex items-center gap-3 ml-auto">
            <div className="bg-price-blue-50 px-4 py-2 rounded-xl border border-price-blue-100">
              <p className="text-[8px] font-bold text-price-blue-400 uppercase tracking-widest leading-none mb-1">Ubicación</p>
              <p className="text-price-blue-900 text-xs font-black leading-none">Hermosillo, Sonora</p>
            </div>
          </div>
        </div>
      </header>

      {/* ── MOBILE LAYOUT ─────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden md:hidden">

        {/* Map — takes all remaining space above the detail card */}
        <div className="flex-1 relative overflow-hidden">
          <GoogleMapFrame store={selectedStore} overview={mapOverview} />

          {/* Backdrop for list panel */}
          {showList && (
            <div
              className="absolute inset-0 z-20 bg-black/30 backdrop-blur-[2px]"
              onClick={() => setShowList(false)}
            />
          )}

          {/* Sliding store list panel */}
          <div
            className={`absolute inset-y-0 left-0 z-30 w-[82vw] max-w-xs bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
              showList ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            {/* Panel header */}
            <div className="bg-price-blue-900 px-5 pt-5 pb-6 relative overflow-hidden flex-shrink-0">
              <div className="absolute top-0 right-0 w-24 h-24 bg-price-pink-500/10 rounded-full blur-2xl -mr-6 -mt-6" />
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-bold text-price-blue-300 uppercase tracking-widest leading-none mb-1">{STORES.length} tiendas</p>
                  <p className="text-white text-lg font-black leading-none">Hermosillo</p>
                </div>
                <button
                  onClick={() => setShowList(false)}
                  className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-gray-100 flex-shrink-0">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                </div>
                <input
                  placeholder="Buscar tienda..."
                  className="w-full bg-gray-50 pl-8 pr-4 py-2.5 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-price-blue-500/20 border border-gray-100"
                />
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto no-scrollbar">
              {STORES.map((store) => (
                <button
                  key={store.id}
                  onClick={() => selectStore(store)}
                  className={`w-full px-4 py-4 flex gap-3 text-left border-b border-gray-50 transition-all active:bg-gray-50 ${
                    selectedStore.id === store.id
                      ? "bg-price-blue-50/60 border-l-[3px] border-l-price-blue-900"
                      : "border-l-[3px] border-l-transparent"
                  }`}
                >
                  <div className={`w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                    selectedStore.id === store.id ? "bg-price-blue-900 text-white" : "bg-gray-100 text-gray-500"
                  }`}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-black text-gray-900 leading-snug mb-0.5">{store.name}</p>
                    <p className="text-[10px] font-medium text-gray-500 truncate leading-tight">{store.address}</p>
                    <p className="text-[10px] font-medium text-gray-400 mt-0.5">{store.hours}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* List toggle button */}
          {!showList && (
            <button
              onClick={() => setShowList(true)}
              className="absolute top-3 left-3 z-10 bg-white/95 backdrop-blur-xl shadow-lg shadow-black/10 border border-white/60 rounded-2xl px-3.5 py-2 flex items-center gap-2"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
              <span className="text-xs font-black text-price-blue-900">Tiendas</span>
              <span className="w-5 h-5 rounded-full bg-price-blue-900 text-white text-[9px] font-black flex items-center justify-center">{STORES.length}</span>
            </button>
          )}
        </div>

        {/* Store detail — below the map, above the fixed nav */}
        <div className="flex-shrink-0 bg-white border-t border-gray-100 px-4 pt-4 pb-28">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0 pr-3">
              <p className="text-[9px] font-bold text-price-pink-600 uppercase tracking-widest leading-none mb-1.5">Tienda Seleccionada</p>
              <h3 className="text-base font-black text-gray-900 leading-tight">{selectedStore.name}</h3>
            </div>
            <div className="flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1.5 rounded-xl border border-emerald-100 flex-shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-[10px] font-bold text-emerald-700">Abierto</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-gray-500 mb-1.5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            <p className="text-xs font-medium truncate">{selectedStore.address}</p>
          </div>
          <div className="flex items-center gap-2 text-gray-400 mb-4">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            <p className="text-[11px] font-medium">{selectedStore.hours}</p>
          </div>

          <div className="flex gap-2.5">
            <button className="flex-1 bg-price-blue-900 text-white py-3.5 rounded-2xl text-[11px] font-bold uppercase tracking-widest shadow-lg shadow-price-blue-900/20 active:scale-95 transition-all flex items-center justify-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="3 11 22 2 13 21 11 13 3 11"/>
              </svg>
              Cómo llegar
            </button>
            <button className="px-4 border border-gray-100 bg-gray-50 text-gray-500 py-3.5 rounded-2xl active:scale-95 transition-all flex items-center justify-center">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ── DESKTOP LAYOUT ────────────────────────────────────────────── */}
      <div className="flex-1 hidden md:flex overflow-hidden">

        {/* Store list panel */}
        <div className="w-96 flex flex-col border-r border-gray-200 bg-white overflow-hidden flex-shrink-0">
          {/* Search */}
          <div className="p-4 border-b border-gray-100 flex-shrink-0">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </div>
              <input
                placeholder="Buscar tienda o CP..."
                className="w-full bg-gray-50 pl-8 pr-4 py-2.5 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-price-blue-500/20 border border-gray-100"
              />
            </div>
          </div>

          {/* Store list */}
          <div className="flex-1 overflow-y-auto no-scrollbar">
            {STORES.map((store) => (
              <button
                key={store.id}
                onClick={() => selectStore(store)}
                className={`w-full px-5 py-4 flex gap-3 text-left border-b border-gray-50 transition-all hover:bg-gray-50/80 ${
                  selectedStore.id === store.id
                    ? "bg-price-blue-50/60 border-l-[3px] border-l-price-blue-900"
                    : "border-l-[3px] border-l-transparent"
                }`}
              >
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                  selectedStore.id === store.id ? "bg-price-blue-900 text-white" : "bg-gray-100 text-gray-500"
                }`}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-black text-gray-900 leading-snug mb-0.5">{store.name}</p>
                  <p className="text-[11px] font-medium text-gray-500 truncate leading-tight mb-0.5">{store.address}</p>
                  <p className="text-[10px] font-medium text-gray-400">{store.hours}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Selected store detail */}
          <div className="border-t border-gray-100 p-5 bg-gray-50/50 flex-shrink-0">
            <div className="flex items-center justify-between mb-3">
              <div className="min-w-0 flex-1 pr-3">
                <p className="text-[9px] font-bold text-price-pink-600 uppercase tracking-widest leading-none mb-1">Seleccionada</p>
                <p className="text-base font-black text-gray-900 leading-snug truncate">{selectedStore.name}</p>
              </div>
              <div className="flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1.5 rounded-xl border border-emerald-100 flex-shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-[10px] font-bold text-emerald-700">Abierto</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="flex-shrink-0"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <p className="text-[11px] font-medium truncate">{selectedStore.address}</p>
            </div>
            <div className="flex items-center gap-2 text-gray-400 mb-4">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="flex-shrink-0"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <p className="text-[10px] font-medium">{selectedStore.hours}</p>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 bg-price-blue-900 text-white py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-price-blue-900/20 hover:bg-price-blue-800 transition-colors flex items-center justify-center gap-2">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="3 11 22 2 13 21 11 13 3 11"/>
                </svg>
                Cómo llegar
              </button>
              <button className="px-4 border border-gray-200 bg-white text-gray-400 py-3 rounded-2xl hover:bg-gray-50 transition-colors flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="flex-1 relative">
          <GoogleMapFrame store={selectedStore} overview={mapOverview} />
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

          <button className="flex-1 flex flex-col items-center justify-center gap-1 py-1">
            <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-price-blue-900 shadow-lg shadow-price-blue-900/30">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <span className="text-[10px] font-black text-price-blue-900 tracking-tight">Tiendas</span>
          </button>

          <button onClick={() => dispatch({ type: "SET_VIEW", payload: "cart" })} className="flex-1 flex flex-col items-center justify-center gap-1 py-1 group">
            <div className="flex items-center justify-center w-10 h-10 rounded-2xl group-active:bg-gray-100 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
              </svg>
            </div>
            <span className="text-[10px] font-bold text-gray-400 tracking-tight">Carrito</span>
          </button>

          <button onClick={() => dispatch({ type: "SET_VIEW", payload: "profile" })} className="flex-1 flex flex-col items-center justify-center gap-1 py-1 group">
            <div className="flex items-center justify-center w-10 h-10 rounded-2xl group-active:bg-gray-100 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <span className="text-[10px] font-bold text-gray-400 tracking-tight">Cuenta</span>
          </button>
        </div>
      </div>
    </div>
  )
}
