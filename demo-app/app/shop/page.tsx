"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useApp } from "@/context/AppContext"
import CatalogView from "@/components/shop/CatalogView"
import CartView from "@/components/shop/CartView"
import CheckoutView from "@/components/shop/CheckoutView"
import PaymentView from "@/components/shop/PaymentView"
import ProcessingView from "@/components/shop/ProcessingView"
import QRView from "@/components/shop/QRView"
import DetailView from "@/components/shop/ProductDetailView"
import StoresView from "@/components/shop/StoresView"
import ProfileView from "@/components/shop/ProfileView"

export default function ShopPage() {
  const { state } = useApp()
  const router = useRouter()

  useEffect(() => {
    if (!state.currentUser) {
      router.push("/login")
    }
  }, [state.currentUser, router])

  if (!state.currentUser) return null

  const views = {
    catalog: <CatalogView />,
    cart: <CartView />,
    checkout: <CheckoutView />,
    payment: <PaymentView />,
    processing: <ProcessingView />,
    qr: <QRView />,
    detail: <DetailView />,
    stores: <StoresView />,
    profile: <ProfileView />,
  }

  return (
    // h-screen + overflow-hidden gives views a stable full-height container
    // so flex-1 scroll areas and pinned navbars work correctly
    <div className="h-screen overflow-hidden">
      {views[state.currentView] ?? <CatalogView />}
    </div>
  )
}
