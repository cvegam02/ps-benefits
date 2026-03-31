import type { Metadata } from "next"
import { Montserrat } from "next/font/google"
import "./globals.css"
import { AppProvider } from "@/context/AppContext"

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Price Shoes Benefits",
  description: "Demo Institucional Bancario",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${montserrat.variable} font-sans antialiased bg-gray-50`}>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  )
}
