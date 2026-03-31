"use client"

import { useState, useEffect } from "react"

const CLOUDINARY_BASE =
  "https://res.cloudinary.com/priceshoes/w_750,q_auto:best,f_auto,e_trim"

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

    const token = process.env.NEXT_PUBLIC_PS_API_TOKEN
    const headers: HeadersInit = token
      ? { Authorization: `Bearer ${token}` }
      : {}

    fetch(`https://api.priceshoes.digital/v1/search/products/${sku}`, { headers })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((json) => {
        setData({
          sizes: json.sizes ?? [],
          color: (json.color ?? "").split("|")[0],
          material: json.material ?? "",
          inStock: json.inventory === true && !json.out_of_stock,
          outOfStock: json.out_of_stock === true,
          images: (json.images ?? []).map(
            (path: string) => `${CLOUDINARY_BASE}${path}`
          ),
          priceCustomer: json.price_customer ?? 0,
          priceMember: json.price_member ?? 0,
          labels: json.labels ?? [],
          darkstoreInventory: json.darkstore_inventory ?? 0,
        })
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Error al cargar")
      })
      .finally(() => setLoading(false))
  }, [sku])

  return { data, loading, error }
}
