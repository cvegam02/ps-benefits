"use client"

import { useEffect, useRef, useState } from "react"

interface QRScannerProps {
  onScan: (data: string) => void
  onClose: () => void
}

export default function QRScanner({ onScan, onClose }: QRScannerProps) {
  const scannerRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState("")
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const scannerInstanceRef = useRef<any>(null)

  useEffect(() => {
    let mounted = true

    async function initScanner() {
      try {
        const { Html5Qrcode } = await import("html5-qrcode")
        if (!mounted || !scannerRef.current) return

        const scannerId = "qr-scanner-container"
        const scanner = new Html5Qrcode(scannerId)
        scannerInstanceRef.current = scanner

        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 220, height: 220 } },
          (decodedText) => {
            onScan(decodedText)
          },
          () => {} // ignore errors during scanning
        )
      } catch {
        if (mounted) {
          setError("No se pudo acceder a la cámara. Verifica los permisos.")
        }
      }
    }

    initScanner()

    return () => {
      mounted = false
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      scannerInstanceRef.current?.clear?.().catch?.(() => {})
    }
  }, [onScan])

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" onClick={onClose} />

      {/* Scanner modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl overflow-hidden shadow-2xl w-full max-w-sm">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">Escanear QR de orden</h2>
            <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className="p-4">
            {error ? (
              <div className="flex flex-col items-center gap-3 py-8 text-center">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <p className="text-sm text-red-500">{error}</p>
              </div>
            ) : (
              <div
                id="qr-scanner-container"
                ref={scannerRef}
                className="w-full rounded-xl overflow-hidden bg-black"
                style={{ minHeight: 280 }}
              />
            )}
            <p className="text-xs text-gray-400 text-center mt-3">
              Apunta la cámara al código QR del cliente
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
