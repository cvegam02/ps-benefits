"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useApp } from "@/context/AppContext"
import { tenants } from "@/lib/mock-data"

export default function RegisterPage() {
  const router = useRouter()
  const { dispatch } = useApp()
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    employeeNumber: "",
    tenantId: tenants[0].id,
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const newUser = {
      id: Date.now(),
      name: form.name,
      email: form.email,
      password: form.password,
      phone: form.phone,
      employeeNumber: form.employeeNumber,
      tenantId: form.tenantId,
    }
    dispatch({ type: "LOGIN", payload: newUser })
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
            Únete a <br />
            <span className="text-price-blue-300">Price Shoes Benefits</span>
          </h1>
          <p className="text-lg text-price-blue-100/80 max-w-md">
            Registra tu cuenta y comienza a disfrutar de descuentos exclusivos en tus tiendas favoritas.
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-4 group">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-white/10 transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M16 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <div>
              <p className="font-bold">Perfil Personalizado</p>
              <p className="text-sm text-price-blue-200/70">Gestiona tus preferencias y ahorros</p>
            </div>
          </div>
          <div className="flex items-center gap-4 group">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-white/10 transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <div>
              <p className="font-bold">Tiendas Cercanas</p>
              <p className="text-sm text-price-blue-200/70">Encuentra beneficios en tu localidad</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Register Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 z-10 md:bg-white/5 md:backdrop-blur-sm overflow-y-auto">
        
        {/* Mobile Header (Visible only on mobile) */}
        <div className="md:hidden mt-8 mb-8 flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-xl">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-1">Beneficios Price Shoes</h2>
            <p className="text-price-blue-100 text-sm">Regístrate en tu portal de beneficios</p>
          </div>
        </div>

        {/* Card */}
        <div className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl border border-white/10 p-8 lg:p-10 my-8">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Crear Cuenta</h1>
            <p className="text-gray-500 font-medium">Regístrate en tu portal de beneficios</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">
                Nombre completo
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Ingresa tu nombre completo"
                required
                className="w-full px-4 py-4 rounded-2xl bg-gray-50 border border-gray-100 text-sm font-medium outline-none focus:bg-white focus:border-price-blue-500 focus:ring-4 focus:ring-price-blue-500/10 transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="55 1234 5678"
                  required
                  className="w-full px-4 py-4 rounded-2xl bg-gray-50 border border-gray-100 text-sm font-medium outline-none focus:bg-white focus:border-price-blue-500 focus:ring-4 focus:ring-price-blue-500/10 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">
                  Número de empleado
                </label>
                <input
                  type="text"
                  name="employeeNumber"
                  value={form.employeeNumber}
                  onChange={handleChange}
                  placeholder="EMP001"
                  required
                  className="w-full px-4 py-4 rounded-2xl bg-gray-50 border border-gray-100 text-sm font-medium outline-none focus:bg-white focus:border-price-blue-500 focus:ring-4 focus:ring-price-blue-500/10 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">
                Correo electrónico
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Ingresa tu correo electrónico"
                required
                className="w-full px-4 py-4 rounded-2xl bg-gray-50 border border-gray-100 text-sm font-medium outline-none focus:bg-white focus:border-price-blue-500 focus:ring-4 focus:ring-price-blue-500/10 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Ingresa tu contraseña"
                  required
                  className="w-full px-4 py-4 rounded-2xl bg-gray-50 border border-gray-100 text-sm font-medium outline-none focus:bg-white focus:border-price-blue-500 focus:ring-4 focus:ring-price-blue-500/10 transition-all"
                />
                <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-price-blue-600 transition">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">
                Empresa / Sindicato
              </label>
              <select
                name="tenantId"
                value={form.tenantId}
                onChange={handleChange}
                className="w-full px-4 py-4 rounded-2xl bg-gray-50 border border-gray-100 text-sm font-medium outline-none focus:bg-white focus:border-price-blue-500 focus:ring-4 focus:ring-price-blue-500/10 transition-all appearance-none"
              >
                {tenants.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Warning Banner from Pencil Design */}
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex gap-3">
              <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="3"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              </div>
              <p className="text-[11px] leading-relaxed text-amber-800 font-medium">
                Solo empleados de empresas o sindicatos con convenio vigente con Price Shoes pueden registrarse en esta plataforma.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-price-blue-600 text-white font-bold text-base shadow-xl shadow-price-blue-600/20 hover:bg-price-blue-700 active:scale-[0.98] transition-all duration-200 mt-2"
            >
              Crear Cuenta
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-8 font-medium">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="text-price-blue-600 font-bold hover:text-price-blue-700 transition">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
