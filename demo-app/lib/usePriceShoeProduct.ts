"use client"

import { useState, useEffect } from "react"
import { priceShoeData } from "./priceshoes-data"

export type PriceShoeApiData = {
  sizes: string[]
  color: string
  material: string
  inStock: boolean
  outOfStock: boolean
  images: string[]
  priceCustomer: number
  priceMember: number
  labels: string[]
  darkstoreInventory: number
}

export function usePriceShoeProduct(sku?: string) {
  const [data, setData] = useState<PriceShoeApiData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!sku) return

    setLoading(true)
    setError(null)
    setData(null)

    const cached = priceShoeData[sku]
    if (cached) {
      setData(cached)
    } else {
      setError("Producto no encontrado")
    }
    setLoading(false)
  }, [sku])

  return { data, loading, error }
}
