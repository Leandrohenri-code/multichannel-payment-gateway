'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Package, ShoppingCart, Wallet,
  Plug, Settings, LogOut, Zap, Bell, ChevronDown,
} from 'lucide-react'

const nav = [
  { href: '/overview',     label: 'Overview',      icon: LayoutDashboard },
  { href: '/products',     label: 'Produtos',       icon: Package },
  { href: '/orders',       label: 'Pedidos',        icon: ShoppingCart },
  { href: '/finance',      label: 'Financeiro',     icon: Wallet },
  { href: '/integrations', label: 'Integrações',    icon: Plug },
  { href: '/settings',     label: 'Configurações',  icon: Settings },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname()

  return (
    <div className="flex h-screen bg-background overflow-hidden relative">

      {/* ── Ambient glow orbs (aurora effect) ───────────────── */}
      <div
        className="glow-orb"
        style={{
          width: 600, height: 600,
          top: '-15%', left: '-10%',
          background: 'radial-gradient(circle, rgba(6,182,212,0.18) 0%, transparent 70%)',
        }}
      />
      <div
        className="glow-orb"
        style={{
          width: 500, height: 500,
          bottom: '-10%', right: '5%',
          background: 'radial-gradient(circle, rgba(0,230,118,0.14) 0%, transparent 70%)',
        }}
      />
      <div
        className="glow-orb"
        style={{
          width: 400, height: 400,
          top: '40%', right: '30%',
          background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)',
        }}
      />

      {/* ── Sidebar ─────────────────────────────────────────── */}
      <aside
        className="relative z-20 w-60 flex-shrink-0 flex flex-col"
        style={{
          background: 'rgba(8,12,20,0.75)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRight: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        {/* Logo */}
        <div className="px-6 py-5 flex items-center gap-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(0,230,118,0.15)', border: '1px solid rgba(0,230,118,0.3)' }}
          >
            <Zap size={15} style={{ color: '#00e676' }} />
          </div>
          <span className="font-semibold text-text text-sm tracking-tight">Gateway Pay</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
          {nav.map(({ href, label, icon: Icon }) => {
            const active = path === href || (href !== '/' && path.startsWith(href + '/'))
            return (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200"
                style={active ? {
                  background: 'rgba(0,230,118,0.10)',
                  color: '#00e676',
                  fontWeight: 500,
                } : {
                  color: '#64748B',
                }}
                onMouseEnter={e => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'
                    ;(e.currentTarget as HTMLElement).style.color = '#F8FAFC'
                  }
                }}
                onMouseLeave={e => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.background = ''
                    ;(e.currentTarget as HTMLElement).style.color = '#64748B'
                  }
                }}
              >
                <Icon size={16} />
                {label}
                {active && (
                  <div
                    className="ml-auto w-1.5 h-1.5 rounded-full"
                    style={{ background: '#00e676', boxShadow: '0 0 6px rgba(0,230,118,0.8)' }}
                  />
                )}
              </Link>
            )
          })}
        </nav>

        {/* User footer */}
        <div className="px-3 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 hover:bg-white/[0.04]">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background: 'rgba(0,230,118,0.15)', color: '#00e676', border: '1px solid rgba(0,230,118,0.25)' }}
            >
              M
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-text truncate">Merchant</p>
              <p className="text-xs truncate" style={{ color: '#64748B' }}>merchant@email.com</p>
            </div>
            <ChevronDown size={13} style={{ color: '#64748B' }} />
          </div>
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm w-full mt-0.5 transition-all duration-200"
            style={{ color: '#64748B' }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.08)'
              ;(e.currentTarget as HTMLElement).style.color = '#EF4444'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = ''
              ;(e.currentTarget as HTMLElement).style.color = '#64748B'
            }}
          >
            <LogOut size={15} />
            Sair
          </button>
        </div>
      </aside>

      {/* ── Main area ────────────────────────────────────────── */}
      <div className="relative z-10 flex-1 flex flex-col overflow-hidden">

        {/* Topbar */}
        <header
          className="h-14 flex items-center justify-between px-6 flex-shrink-0"
          style={{
            background: 'rgba(8,12,20,0.6)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <h1 className="text-sm font-semibold text-text">
            {nav.find(n => path === n.href || path.startsWith(n.href + '/'))?.label ?? 'Painel'}
          </h1>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg transition-all hover:bg-white/[0.05]" style={{ color: '#64748B' }}>
              <Bell size={16} />
              <span
                className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
                style={{ background: '#00e676', boxShadow: '0 0 6px rgba(0,230,118,0.8)' }}
              />
            </button>
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold cursor-pointer"
              style={{ background: 'rgba(0,230,118,0.15)', color: '#00e676', border: '1px solid rgba(0,230,118,0.25)' }}
            >
              M
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
