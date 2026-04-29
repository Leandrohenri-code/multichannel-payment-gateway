'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react'
import { login } from '@/lib/auth'

export default function LoginPage() {
  const router = useRouter()
  const [showPass, setShowPass] = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const [form, setForm] = useState({ email: '', password: '' })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.email, form.password)
      router.push('/overview')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message ?? 'Erro ao fazer login. Tente novamente.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-2xl p-7"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}>
      <h1 className="text-xl font-bold text-text mb-1">Entrar na conta</h1>
      <p className="text-sm text-muted mb-6">Bem-vindo de volta ao Gateway Pay</p>

      {error && (
        <div className="flex items-center gap-2 rounded-xl p-3 mb-4 text-sm"
          style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#EF4444' }}>
          <AlertCircle size={15} className="flex-shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs text-muted block mb-1.5">E-mail</label>
          <input className="input" type="email" placeholder="voce@empresa.com" required
            value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs text-muted">Senha</label>
            <a href="#" className="text-xs transition-colors" style={{ color: '#00e676' }}>Esqueci a senha</a>
          </div>
          <div className="relative">
            <input className="input pr-11" type={showPass ? 'text' : 'password'} placeholder="••••••••" required
              value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
            <button type="button" onClick={() => setShowPass(!showPass)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-text transition-colors">
              {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>
        <button type="submit" disabled={loading}
          className="btn-primary w-full justify-center py-3 mt-2 disabled:opacity-60">
          {loading ? 'Entrando...' : <><span>Entrar</span><ArrowRight size={14} /></>}
        </button>
      </form>

      <p className="text-xs text-muted text-center mt-5">
        Não tem conta?{' '}
        <Link href="/register" className="font-semibold transition-colors" style={{ color: '#00e676' }}>
          Criar conta grátis
        </Link>
      </p>
    </div>
  )
}
