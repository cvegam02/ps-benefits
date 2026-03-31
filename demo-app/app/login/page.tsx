"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useApp } from "@/context/AppContext"
import { users } from "@/lib/mock-data"

export default function LoginPage() {
  const router = useRouter()
  const { dispatch } = useApp()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    const user = users.find((u) => u.email === email && u.password === password)
    if (!user) {
      setError("Correo o contraseña incorrectos")
      return
    }
    dispatch({ type: "LOGIN", payload: user })
    router.push("/shop")
  }

  return (
    <div className="min-h-screen relative flex flex-col md:flex-row overflow-hidden bg-price-blue-900">
      {/* Decorative Circles Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-price-blue-600/20 blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -right-48 w-[500px] h-[500px] rounded-full bg-price-blue-400/10 blur-3xl" />
        <div className="absolute -bottom-48 left-1/4 w-[600px] h-[600px] rounded-full bg-price-blue-800/30 blur-3xl" />
      </div>

      {/* Left Side: Brand & Info (Desktop Only) */}
      <div className="hidden md:flex flex-1 flex-col justify-center px-12 lg:px-24 z-10 text-white">
        <div className="mb-12">
          <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center mb-6 shadow-2xl">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
            Beneficios <br />
            <span className="text-price-blue-300">Price Shoes</span>
          </h1>
          <p className="text-lg text-price-blue-100/80 max-w-md">
            Tu portal exclusivo de beneficios para empleados. Descuentos, promociones y más en un solo lugar.
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-4 group">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-white/10 transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
            </div>
            <div>
              <p className="font-bold">Datos Seguros</p>
              <p className="text-sm text-price-blue-200/70">Protección de tu información personal</p>
            </div>
          </div>
          <div className="flex items-center gap-4 group">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-white/10 transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
            </div>
            <div>
              <p className="font-bold">Descuentos Exclusivos</p>
              <p className="text-sm text-price-blue-200/70">Beneficios especiales para empleados</p>
            </div>
          </div>
          <div className="flex items-center gap-4 group">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-white/10 transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            </div>
            <div>
              <p className="font-bold">Acceso Completo</p>
              <p className="text-sm text-price-blue-200/70">Toda la gama de beneficios en un clic</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 z-10 md:bg-white/5 md:backdrop-blur-sm">
        
        {/* Mobile Header (Visible only on mobile) */}
        <div className="md:hidden mb-10 flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-xl">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-1">Beneficios Price Shoes</h2>
            <p className="text-price-blue-100 text-sm">Inicia sesión en tu cuenta</p>
          </div>
        </div>

        {/* Card */}
        <div className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl border border-white/10 p-8 lg:p-10 transform transition-all duration-300 hover:shadow-price-blue-500/10">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Bienvenido de Nuevo</h1>
            <p className="text-gray-500 font-medium">Inicia sesión en tu cuenta</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">
                Correo electrónico
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-price-blue-600 transition-colors">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError("") }}
                  placeholder="Ingresa tu correo electrónico"
                  required
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border border-gray-100 text-sm font-medium outline-none focus:bg-white focus:border-price-blue-500 focus:ring-4 focus:ring-price-blue-500/10 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2 ml-1">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Contraseña
                </label>
                <Link href="#" className="text-xs font-bold text-price-blue-600 hover:text-price-blue-700 transition">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-price-blue-600 transition-colors">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError("") }}
                  placeholder="Ingresa tu contraseña"
                  required
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border border-gray-100 text-sm font-medium outline-none focus:bg-white focus:border-price-blue-500 focus:ring-4 focus:ring-price-blue-500/10 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center mb-1">
              <input type="checkbox" id="remember" className="w-4 h-4 rounded border-gray-300 text-price-blue-600 focus:ring-price-blue-500 accent-price-blue-600 cursor-pointer" />
              <label htmlFor="remember" className="ml-2 text-sm text-gray-600 cursor-pointer font-medium">Recordarme</label>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-xs font-bold px-4 py-3 rounded-xl flex items-center gap-2 animate-shake">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-price-blue-600 text-white font-bold text-base shadow-xl shadow-price-blue-600/20 hover:bg-price-blue-700 active:scale-[0.98] transition-all duration-200 mt-2"
            >
              Iniciar Sesión
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-8 font-medium">
            ¿No tienes cuenta?{" "}
            <Link href="/register" className="text-price-blue-600 font-bold hover:text-price-blue-700 transition">
              Regístrate
            </Link>
          </p>
        </div>

        {/* Demo hint */}
        <div className="mt-8 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-price-blue-200/50 text-[10px] uppercase tracking-widest font-bold">
          Modo Demo: carlos@test.com / 123456
        </div>
      </div>
    </div>
  )
}
