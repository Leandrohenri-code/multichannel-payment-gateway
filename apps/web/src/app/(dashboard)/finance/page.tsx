'use client'

import { useState } from 'react'
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { ArrowUpRight, CheckCircle, Clock, XCircle } from 'lucide-react'

const monthlyRevenue = [
  { month: 'Nov', value: 18200 }, { month: 'Dez', value: 24100 },
  { month: 'Jan', value: 21500 }, { month: 'Fev', value: 29800 },
  { month: 'Mar', value: 35600 }, { month: 'Abr', value: 38210 },
]

const withdrawals = [
  { id: '#W021', type: 'BRL',  amount: 5000,  date: '10/04/2026', status: 'COMPLETED', dest: 'PIX — ***321' },
  { id: '#W020', type: 'USDT', amount: 420.5, date: '05/04/2026', status: 'COMPLETED', dest: 'TRC-20 — T...5Kx' },
  { id: '#W019', type: 'BRL',  amount: 2000,  date: '01/04/2026', status: 'COMPLETED', dest: 'PIX — ***321' },
  { id: '#W018', type: 'USDT', amount: 300,   date: '25/03/2026', status: 'PROCESSING', dest: 'TRC-20 — T...5Kx' },
  { id: '#W017', type: 'BRL',  amount: 8000,  date: '20/03/2026', status: 'FAILED',    dest: 'PIX — ***321' },
]

const STATUS_ICON: Record<string, React.ReactNode> = {
  COMPLETED:  <CheckCircle size={14} className="text-success" />,
  PROCESSING: <Clock size={14} className="text-warning" />,
  FAILED:     <XCircle size={14} className="text-danger" />,
}
const STATUS_LABEL: Record<string, string> = {
  COMPLETED: 'Concluído', PROCESSING: 'Processando', FAILED: 'Falhou',
}

const tooltipStyle = {
  contentStyle: {
    background: 'rgba(8,12,20,0.95)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 12,
    fontSize: 12,
    backdropFilter: 'blur(20px)',
  },
  labelStyle: { color: '#64748B' },
}

export default function FinancePage() {
  const [withdrawType, setWithdrawType] = useState('BRL')
  const [step, setStep] = useState<1 | 2>(1)

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-lg font-semibold text-text">Financeiro</h1>
        <p className="text-sm text-muted mt-0.5">Saldos, saques e extrato</p>
      </div>

      {/* Balance cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          className="rounded-2xl p-6"
          style={{
            background: 'linear-gradient(135deg, rgba(0,230,118,0.10) 0%, rgba(0,230,118,0.04) 100%)',
            border: '1px solid rgba(0,230,118,0.25)',
          }}
        >
          <p className="text-xs text-muted mb-1">Saldo BRL Disponível</p>
          <p className="text-3xl font-bold text-text">R$ 12.490</p>
          <p className="text-xs text-muted mt-1.5">Disponível para saque imediato</p>
        </div>
        <div className="card">
          <p className="text-xs text-muted mb-1">Saldo USDT</p>
          <p className="text-3xl font-bold text-text">1.840,50</p>
          <p className="text-xs text-success mt-1.5 flex items-center gap-1">
            <ArrowUpRight size={12} />
            ≈ R$ {(1840.5 * 5.12).toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
          </p>
        </div>
        <div className="card">
          <p className="text-xs text-muted mb-1">Receita Total (mês)</p>
          <p className="text-3xl font-bold text-text">R$ 38.210</p>
          <p className="text-xs text-success mt-1.5 flex items-center gap-1">
            <ArrowUpRight size={12} /> +7,3% vs março
          </p>
        </div>
      </div>

      {/* Chart + Withdraw */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold text-text">Receita Mensal</h2>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyRevenue} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false}
                tickFormatter={v => `R$${(v / 1000).toFixed(0)}k`} />
              <Tooltip {...tooltipStyle}
                formatter={(v: number) => [`R$ ${v.toLocaleString('pt-BR')}`, 'Receita']} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {monthlyRevenue.map((_, i) => (
                  <Cell key={i} fill={i === monthlyRevenue.length - 1 ? '#00e676' : 'rgba(0,230,118,0.25)'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Withdraw form */}
        <div className="card">
          <h2 className="text-sm font-semibold text-text mb-5">Solicitar Saque</h2>

          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="text-xs text-muted block mb-2">Tipo de saque</label>
                <div className="grid grid-cols-3 gap-2">
                  {['BRL', 'USDT', 'BTC'].map(t => (
                    <button key={t} onClick={() => setWithdrawType(t)}
                      className="py-2 rounded-xl text-xs font-semibold transition-all duration-200"
                      style={withdrawType === t ? {
                        background: 'rgba(0,230,118,0.15)',
                        border: '1px solid rgba(0,230,118,0.4)',
                        color: '#00e676',
                      } : {
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        color: '#64748B',
                      }}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-muted block mb-1.5">
                  Valor {withdrawType === 'BRL' ? '(R$)' : `(${withdrawType})`}
                </label>
                <input className="input" type="number" placeholder="0,00" />
              </div>
              {withdrawType === 'BRL' && (
                <div>
                  <label className="text-xs text-muted block mb-1.5">Chave PIX</label>
                  <input className="input" placeholder="CPF, e-mail ou telefone" />
                </div>
              )}
              {(withdrawType === 'USDT' || withdrawType === 'BTC') && (
                <div>
                  <label className="text-xs text-muted block mb-1.5">
                    Endereço {withdrawType === 'USDT' ? 'TRC-20' : 'Bitcoin'}
                  </label>
                  <input className="input font-mono text-xs" placeholder={withdrawType === 'USDT' ? 'T...' : 'bc1...'} />
                </div>
              )}
              <div className="rounded-xl p-3 text-xs space-y-1.5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex justify-between text-muted">
                  <span>Taxa plataforma</span><span>1,5%</span>
                </div>
                {withdrawType !== 'BRL' && (
                  <div className="flex justify-between text-muted">
                    <span>Taxa de rede</span><span>~$1,00</span>
                  </div>
                )}
              </div>
              <button onClick={() => setStep(2)} className="btn-primary w-full justify-center">
                Continuar →
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="rounded-xl p-4 text-xs space-y-2.5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <p className="text-muted font-semibold mb-3">Confirmar saque</p>
                <div className="flex justify-between"><span className="text-muted">Tipo</span><span className="text-text font-semibold">{withdrawType}</span></div>
                <div className="flex justify-between"><span className="text-muted">Taxa</span><span className="text-danger">- 1,5%</span></div>
                <div className="flex justify-between pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <span className="text-muted">Você receberá</span>
                  <span className="text-success font-semibold">—</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setStep(1)} className="btn-ghost flex-1 border" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>Voltar</button>
                <button className="btn-primary flex-1 justify-center">Confirmar</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Withdrawals history */}
      <div className="card p-0 overflow-hidden">
        <div className="px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <h2 className="text-sm font-semibold text-text">Histórico de Saques</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {['ID', 'Tipo', 'Valor', 'Destino', 'Data', 'Status'].map(h => (
                <th key={h} className="px-6 py-3 text-left text-xs text-muted font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {withdrawals.map(w => (
              <tr key={w.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                className="transition-colors"
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                onMouseLeave={e => (e.currentTarget.style.background = '')}>
                <td className="px-6 py-3 font-mono text-xs text-muted">{w.id}</td>
                <td className="px-6 py-3">
                  <span className={w.type === 'BRL' ? 'badge-success' : 'badge-accent'}>{w.type}</span>
                </td>
                <td className="px-6 py-3 font-semibold text-text">
                  {w.type === 'BRL' ? `R$ ${w.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : `${w.amount} ${w.type}`}
                </td>
                <td className="px-6 py-3 font-mono text-xs text-muted">{w.dest}</td>
                <td className="px-6 py-3 text-muted text-xs">{w.date}</td>
                <td className="px-6 py-3">
                  <span className="flex items-center gap-1.5">
                    {STATUS_ICON[w.status]}
                    <span className="text-xs text-muted">{STATUS_LABEL[w.status]}</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

