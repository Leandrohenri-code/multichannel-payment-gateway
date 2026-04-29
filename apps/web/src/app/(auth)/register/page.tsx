'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ArrowRight, Check, AlertCircle } from 'lucide-react'
import { register } from '@/lib/auth'

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(form.name, form.email, form.password)
      router.push('/overview')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message ?? 'Erro ao criar conta. Tente novamente.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-2xl p-7"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}>
      <h1 className="text-xl font-bold text-text mb-1">Criar conta</h1>
      <p className="text-sm text-muted mb-6">Comece a vender em minutos, gratuitamente</p>

      {error && (
        <div className="flex items-center gap-2 rounded-xl p-3 mb-4 text-sm"
          style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#EF4444' }}>
          <AlertCircle size={15} className="flex-shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs text-muted block mb-1.5">Nome completo</label>
          <input className="input" type="text" placeholder="João Silva" required
            value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
        </div>
        <div>
          <label className="text-xs text-muted block mb-1.5">E-mail</label>
          <input className="input" type="email" placeholder="voce@empresa.com" required
            value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
        </div>
        <div>
          <label className="text-xs text-muted block mb-1.5">Senha</label>
          <input className="input" type="password" placeholder="Mínimo 8 caracteres" required minLength={8}
            value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
        </div>

        <ul className="space-y-2 py-1">
          {['Sem mensalidade no plano Free', 'Integre Telegram, Discord e WhatsApp', 'Saques automáticos em BRL e USDT'].map(b => (
            <li key={b} className="flex items-center gap-2.5 text-xs text-muted">
              <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(0,230,118,0.15)', border: '1px solid rgba(0,230,118,0.3)' }}>
                <Check size={10} style={{ color: '#00e676' }} />
              </div>
              {b}
            </li>
          ))}
        </ul>

        <button type="submit" disabled={loading}
          className="btn-primary w-full justify-center py-3 disabled:opacity-60">
          {loading ? 'Criando conta...' : <><span>Criar conta grátis</span><ArrowRight size={14} /></>}
        </button>
      </form>

      <p className="text-xs text-muted text-center mt-5">
        Já tem conta?{' '}
        <Link href="/login" className="font-semibold transition-colors" style={{ color: '#00e676' }}>
          Fazer login
        </Link>
      </p>
    </div>
  )
}
