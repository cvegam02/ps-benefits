"use client"

import { useState } from "react"
import { useApp } from "@/context/AppContext"
import { products, tenants, getDiscountedPrice, formatMXN, getProductImageUrl } from "@/lib/mock-data"
import { usePriceShoeProduct } from "@/lib/usePriceShoeProduct"
import Image from "next/image"

export default function ProductDetailView() {
  const { state, dispatch } = useApp()
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)

  const tenant = state.currentUser
    ? tenants.find((t) => t.id === state.currentUser!.tenantId)
    : null
  const discount = tenant?.discount ?? 0
  const tenantName = tenant?.name ?? "Price Shoes Benefits"

  const cartCount = state.cart.reduce((sum, i) => sum + i.quantity, 0)
  const selectedProduct = state.selectedProduct
  const { data: apiData, loading: apiLoading } = usePriceShoeProduct(selectedProduct?.sku)

  if (!selectedProduct) {
    dispatch({ type: "SET_VIEW", payload: "catalog" })
    return null
  }

  // Prices: use base price from API/mock, apply only our tenant discount
  const basePrice = apiData?.priceCustomer ?? selectedProduct.price
  const finalPrice = getDiscountedPrice(basePrice, discount)
  const totalSavingsPct = basePrice > 0
    ? Math.round(((basePrice - finalPrice) / basePrice) * 100)
    : discount

  // Images: only use API images
  const apiImages = apiData?.images?.length ? apiData.images : []
  const productImages = apiImages
  const thumbnailImages = apiImages

  function addToCart() {
    for (let i = 0; i < quantity; i++) {
      dispatch({ type: "ADD_TO_CART", payload: selectedProduct! })
    }
  }

  function buyNow() {
    addToCart()
    dispatch({ type: "SET_VIEW", payload: "cart" })
  }

  function goBack() {
    dispatch({ type: "SELECT_PRODUCT", payload: null })
    dispatch({ type: "SET_VIEW", payload: "catalog" })
  }

  function selectRelated(product: typeof selectedProduct) {
    dispatch({ type: "SELECT_PRODUCT", payload: product })
    setSelectedImage(0)
    setQuantity(1)
    setSelectedSize(null)
  }

  return (
    <>
      {/* ── MOBILE ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col h-full md:hidden bg-gray-50">

        {/* Atmospheric Header */}
        <div className="relative bg-price-blue-900 pt-6 pb-8 px-4 overflow-hidden shadow-xl shadow-price-blue-900/20 flex-shrink-0">
          <div className="absolute top-0 right-0 w-48 h-48 bg-price-pink-500/10 rounded-full blur-3xl -mr-10 -mt-10" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-price-blue-400/10 rounded-full blur-2xl -ml-10 -mb-10" />

          <div className="relative z-10 flex items-center gap-3">
            <button
              onClick={goBack}
              className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white active:scale-90 transition-transform"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
            </button>
            <div className="flex-1">
              <p className="text-[10px] font-bold text-price-blue-300 uppercase tracking-widest leading-none mb-1">Price Shoes Benefits</p>
              <p className="text-white text-lg font-bold leading-none">Detalle del producto</p>
            </div>
            <button
              onClick={() => dispatch({ type: "SET_VIEW", payload: "cart" })}
              className="relative w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white active:scale-90 transition-transform"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-price-pink-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white/20">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pb-36">
          {/* Image gallery */}
          <div className="relative bg-gray-100 aspect-square">
            {getProductImageUrl(selectedProduct.image, "full") ? (
              <Image src={productImages[selectedImage] ?? ""} alt={selectedProduct.name} fill className="object-contain" unoptimized />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl">
                {categoryEmoji(selectedProduct.category)}
              </div>
            )}
          </div>

          {/* Thumbnails */}
          <div className="flex gap-2 p-4 bg-white border-b border-gray-100">
            {thumbnailImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`w-16 h-16 rounded-2xl overflow-hidden border-2 transition-all flex items-center justify-center ${
                  selectedImage === idx ? "border-price-blue-900 shadow-md shadow-price-blue-900/10" : "border-gray-100"
                }`}
              >
                {img ? (
                  <Image src={img} alt="" width={64} height={64} className="w-full h-full object-contain" unoptimized />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xl bg-gray-50">
                    {categoryEmoji(selectedProduct.category)}
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Product info */}
          <div className="bg-white px-4 py-5 flex flex-col gap-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="text-[10px] font-bold text-price-pink-600 uppercase tracking-widest">{selectedProduct.category}</p>
                {apiData?.labels?.map((label) => (
                  <span key={label} className="text-[9px] font-black uppercase tracking-widest bg-amber-400 text-amber-900 px-2 py-0.5 rounded-full">
                    {label}
                  </span>
                ))}
                {!apiData?.outOfStock && apiData?.inStock && (
                  <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    Disponible
                  </span>
                )}
                {apiData?.outOfStock && (
                  <span className="text-[9px] font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                    Agotado
                  </span>
                )}
              </div>
              <h2 className="text-xl font-black text-gray-900 leading-tight">{selectedProduct.name}</h2>
            </div>

            {/* Prices */}
            <div className="flex flex-col gap-1">
              {apiData && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 font-medium">Precio público</span>
                  <span className="text-sm text-gray-400 line-through">{formatMXN(apiData.priceCustomer)}</span>
                </div>
              )}
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-price-blue-900 tracking-tight">{formatMXN(finalPrice)}</span>
                {!apiData && discount > 0 && (
                  <span className="text-sm text-gray-400 line-through font-medium">{formatMXN(selectedProduct.price)}</span>
                )}
                {(apiData ? totalSavingsPct > 0 : discount > 0) && (
                  <span className="text-xs font-black text-white bg-price-pink-600 px-2 py-0.5 rounded-full uppercase tracking-tight">
                    {apiData ? totalSavingsPct : discount}% OFF
                  </span>
                )}
              </div>
            </div>

            {discount > 0 && (
              <div className="bg-price-blue-50 border border-price-blue-100 rounded-2xl px-4 py-3 flex items-center gap-2">
                <span className="text-sm">💎</span>
                <span className="text-sm font-bold text-price-blue-900">
                  {apiData
                    ? `Precio catálogo $${apiData.priceCustomer.toFixed(0)} → tu precio $${formatMXN(finalPrice)} (${totalSavingsPct}% OFF)`
                    : `Beneficio Exclusivo: ${discount}% OFF aplicado`}
                </span>
              </div>
            )}

            {/* Sizes */}
            {apiData?.sizes && apiData.sizes.length > 0 && (
              <div>
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-3">Talla</h3>
                <div className="flex flex-wrap gap-2">
                  {apiData.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(selectedSize === size ? null : size)}
                      className={`px-3 py-1.5 rounded-xl text-sm font-semibold border-2 transition-all ${
                        selectedSize === size
                          ? "border-price-blue-900 bg-price-blue-900 text-white"
                          : "border-gray-200 text-gray-700 hover:border-price-blue-300"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-3">Descripción</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {selectedProduct.description ?? `${selectedProduct.name} es un producto de alta calidad en la categoría de ${(selectedProduct.category ?? "producto").toLowerCase()}.`}
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-2">
                {selectedProduct.brand && (
                  <p className="text-xs text-gray-400">Marca: <span className="font-semibold text-gray-600">{selectedProduct.brand}</span></p>
                )}
                {selectedProduct.sku && (
                  <p className="text-xs text-gray-400">SKU: <span className="font-mono text-gray-500">{selectedProduct.sku}</span></p>
                )}
                {apiData?.material && (
                  <p className="text-xs text-gray-400">Material: <span className="font-semibold text-gray-600">{apiData.material}</span></p>
                )}
                {apiData?.color && (
                  <p className="text-xs text-gray-400">Color: <span className="font-semibold text-gray-600">{apiData.color}</span></p>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-3">Características</h3>
              <ul className="flex flex-col gap-2">
                {(selectedProduct.features ?? ["Calidad premium garantizada", "Envío inmediato disponible", "Garantía de satisfacción"]).map((feat) => (
                  <li key={feat} className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-lg bg-price-pink-600/10 flex items-center justify-center flex-shrink-0">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#db2777" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                    <span className="text-sm text-gray-600">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {apiLoading && (
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <div className="w-3 h-3 rounded-full border-2 border-gray-300 border-t-price-blue-500 animate-spin" />
                Cargando datos actualizados…
              </div>
            )}

            <div>
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-3">Cantidad</h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 font-black text-base active:scale-90 transition-transform"
                >
                  −
                </button>
                <span className="text-lg font-black text-gray-900 w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-xl bg-price-blue-900 text-white flex items-center justify-center font-black text-base active:scale-90 transition-transform"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Related products */}
          <div className="px-4 py-5">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4">Productos relacionados</h3>
            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
              {products
                .filter((p) => p.id !== selectedProduct.id && p.category === selectedProduct.category)
                .slice(0, 4)
                .map((product) => (
                  <button
                    key={product.id}
                    onClick={() => selectRelated(product)}
                    className="flex-shrink-0 w-36 bg-white rounded-[1.5rem] border border-gray-100 p-2.5 shadow-sm active:scale-95 transition-transform"
                  >
                    <div className="w-full aspect-square bg-gray-50 rounded-xl mb-2 overflow-hidden">
                      {getProductImageUrl(product.image, "thumb") ? (
                        <Image src={getProductImageUrl(product.image, "thumb")} alt="" width={128} height={128} className="w-full h-full object-cover" unoptimized />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">{categoryEmoji(product.category)}</div>
                      )}
                    </div>
                    <p className="text-[10px] font-bold text-price-pink-600 uppercase tracking-widest mb-0.5">{product.category}</p>
                    <p className="text-sm font-bold text-gray-900 line-clamp-2 leading-tight">{product.name}</p>
                    <p className="text-sm font-black text-price-blue-900 mt-1">{formatMXN(getDiscountedPrice(product.price, discount))}</p>
                  </button>
                ))}
            </div>
          </div>
        </div>

        {/* Floating action bar */}
        <div className="fixed bottom-0 left-0 right-0 md:hidden px-4 pb-5 pt-2 z-50">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.12)] border border-white/60 px-4 py-3 flex gap-3">
            <button
              onClick={addToCart}
              className="flex-1 h-12 rounded-2xl border-2 border-gray-100 text-price-blue-900 text-xs font-black uppercase tracking-wider hover:bg-price-blue-50 hover:border-price-blue-200 transition-all active:scale-95"
            >
              Añadir al carrito
            </button>
            <button
              onClick={buyNow}
              className="flex-1 h-12 rounded-2xl bg-price-pink-600 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-price-pink-600/20 active:scale-95 transition-all"
            >
              Comprar Ahora
            </button>
          </div>
        </div>
      </div>

      {/* ── DESKTOP ────────────────────────────────────────────────────── */}
      <div className="hidden md:flex flex-col h-full bg-gray-50 overflow-hidden">

        {/* Header — mismo estilo que CatalogView */}
        <header className="bg-white border-b border-gray-100 flex items-stretch h-24 z-20 flex-shrink-0">
          {/* Brand Block */}
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
                <p className="text-white text-xl font-black leading-none tracking-tight">{tenantName}</p>
              </div>
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex-1 flex items-center px-8 gap-8">
            <button
              onClick={goBack}
              className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-price-blue-900 transition-colors group"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-0.5 transition-transform">
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
              Volver al catálogo
            </button>

            <div className="flex items-center gap-3 ml-auto">
              <button
                onClick={() => dispatch({ type: "SET_VIEW", payload: "cart" })}
                className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center relative hover:bg-white hover:border-price-blue-200 hover:shadow-lg hover:shadow-price-blue-900/5 transition-all group"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-gray-500 group-hover:text-price-blue-600 transition-colors" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-price-pink-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                    {cartCount}
                  </span>
                )}
              </button>
              <button className="w-12 h-12 rounded-2xl bg-price-blue-900 flex items-center justify-center text-white shadow-lg shadow-price-blue-900/20 hover:scale-105 transition-transform active:scale-95">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto p-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 gap-10">

              {/* Image gallery */}
              <div className="flex flex-col gap-4">
                <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm">
                  <div className="aspect-square relative bg-gray-50">
                    {getProductImageUrl(selectedProduct.image, "full") ? (
                      <Image src={productImages[selectedImage] ?? ""} alt={selectedProduct.name} fill className="object-contain" unoptimized />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-8xl">
                        {categoryEmoji(selectedProduct.category)}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-3">
                  {thumbnailImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all flex items-center justify-center ${
                        selectedImage === idx ? "border-price-blue-900 shadow-md shadow-price-blue-900/10" : "border-gray-100 hover:border-gray-200"
                      }`}
                    >
                      {img ? (
                        <Image src={img} alt="" width={80} height={80} className="w-full h-full object-contain" unoptimized />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl bg-gray-50">
                          {categoryEmoji(selectedProduct.category)}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Product info */}
              <div className="flex flex-col gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-[10px] font-bold text-price-pink-600 uppercase tracking-[0.2em]">{selectedProduct.category}</p>
                    {apiData?.labels?.map((label) => (
                      <span key={label} className="text-[9px] font-black uppercase tracking-widest bg-amber-400 text-amber-900 px-2 py-0.5 rounded-full">
                        {label}
                      </span>
                    ))}
                    {!apiData?.outOfStock && apiData?.inStock && (
                      <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        En stock
                      </span>
                    )}
                    {apiData?.outOfStock && (
                      <span className="text-[9px] font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                        Agotado
                      </span>
                    )}
                  </div>
                  <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-tight">{selectedProduct.name}</h1>
                </div>

                {/* Prices */}
                <div className="flex flex-col gap-1.5">
                  {apiData && (
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-400 font-medium">Precio catálogo</span>
                      <span className="text-base text-gray-400 line-through">{formatMXN(apiData.priceCustomer)}</span>
                    </div>
                  )}
                  <div className="flex items-baseline gap-3 mt-1">
                    <span className="text-4xl font-black text-price-blue-900 tracking-tighter">{formatMXN(finalPrice)}</span>
                    {!apiData && discount > 0 && (
                      <span className="text-lg text-gray-400 line-through font-medium">{formatMXN(selectedProduct.price)}</span>
                    )}
                    {(apiData ? totalSavingsPct > 0 : discount > 0) && (
                      <span className="text-xs font-black text-white bg-price-pink-600 px-3 py-1 rounded-full uppercase tracking-tight">
                        {apiData ? totalSavingsPct : discount}% OFF
                      </span>
                    )}
                  </div>
                </div>

                {discount > 0 && (
                  <div className="bg-price-blue-50 border border-price-blue-100 rounded-2xl px-5 py-3.5 flex items-center gap-3">
                    <span className="text-lg">💎</span>
                    <span className="text-sm font-bold text-price-blue-900">
                      {apiData
                        ? `Precio catálogo $${apiData.priceCustomer.toFixed(0)} → tu precio $${formatMXN(finalPrice)} (${totalSavingsPct}% OFF)`
                        : `Beneficio Exclusivo: ${discount}% OFF aplicado`}
                    </span>
                  </div>
                )}

                {/* Sizes */}
                {apiData?.sizes && apiData.sizes.length > 0 && (
                  <div>
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Talla</h3>
                    <div className="flex flex-wrap gap-2">
                      {apiData.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(selectedSize === size ? null : size)}
                          className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${
                            selectedSize === size
                              ? "border-price-blue-900 bg-price-blue-900 text-white"
                              : "border-gray-200 text-gray-700 hover:border-price-blue-300"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Descripción</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {selectedProduct.description ?? `${selectedProduct.name} es un producto de alta calidad en la categoría de ${(selectedProduct.category ?? "producto").toLowerCase()}.`}
                  </p>
                  <div className="flex flex-wrap gap-x-5 gap-y-1 mt-2">
                    {selectedProduct.brand && (
                      <p className="text-xs text-gray-400">Marca: <span className="font-semibold text-gray-600">{selectedProduct.brand}</span></p>
                    )}
                    {selectedProduct.sku && (
                      <p className="text-xs text-gray-400">SKU: <span className="font-mono text-gray-500">{selectedProduct.sku}</span></p>
                    )}
                    {apiData?.material && (
                      <p className="text-xs text-gray-400">Material: <span className="font-semibold text-gray-600">{apiData.material}</span></p>
                    )}
                    {apiData?.color && (
                      <p className="text-xs text-gray-400">Color: <span className="font-semibold text-gray-600">{apiData.color}</span></p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Características principales</h3>
                  <ul className="flex flex-col gap-3">
                    {(selectedProduct.features ?? ["Calidad premium garantizada", "Envío inmediato disponible", "Garantía de satisfacción"]).map((feat) => (
                      <li key={feat} className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-xl bg-price-pink-600/10 flex items-center justify-center flex-shrink-0">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#db2777" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </span>
                        <span className="text-sm text-gray-600">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {apiLoading && (
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <div className="w-3 h-3 rounded-full border-2 border-gray-300 border-t-price-blue-500 animate-spin" />
                    Cargando datos actualizados del producto…
                  </div>
                )}

                <div>
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Cantidad</h3>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 font-black text-lg hover:bg-gray-200 transition-colors active:scale-90"
                    >
                      −
                    </button>
                    <span className="text-2xl font-black text-gray-900 w-16 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-12 h-12 rounded-xl bg-price-blue-900 text-white flex items-center justify-center font-black text-lg hover:bg-price-blue-800 transition-colors active:scale-90"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex gap-4 pt-2">
                  <button
                    onClick={addToCart}
                    className="flex-1 h-14 rounded-2xl border-2 border-gray-100 text-price-blue-900 font-black text-sm uppercase tracking-wider hover:bg-price-blue-50 hover:border-price-blue-200 transition-all active:scale-95"
                  >
                    Añadir al carrito
                  </button>
                  <button
                    onClick={buyNow}
                    className="flex-1 h-14 rounded-2xl bg-price-pink-600 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-price-pink-600/20 hover:bg-price-pink-700 hover:scale-[1.02] transition-all active:scale-95"
                  >
                    Comprar Ahora
                  </button>
                </div>

                <div className="border-t border-gray-100 pt-5 flex items-center gap-6 text-xs text-gray-400 font-medium">
                  <div className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/>
                    </svg>
                    Envío gratis en compras mayores a $5,000
                  </div>
                  <div className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                    Compra protegida
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function categoryEmoji(category?: string): string {
  switch (category) {
    case "Calzado": return "👟"
    case "Ropa": return "👕"
    case "Accesorios": return "👜"
    default: return "📦"
  }
}
