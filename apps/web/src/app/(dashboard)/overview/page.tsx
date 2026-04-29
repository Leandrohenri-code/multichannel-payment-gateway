'use client'

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts'
import { TrendingUp, ShoppingCart, DollarSign, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react'

const revenue = [
  { day: '01/03', value: 1200 }, { day: '03/03', value: 2100 }, { day: '05/03', value: 900 },
  { day: '07/03', value: 3400 }, { day: '09/03', value: 2800 }, { day: '11/03', value: 4200 },
  { day: '13/03', value: 3100 }, { day: '15/03', value: 5600 }, { day: '17/03', value: 4800 },
  { day: '19/03', value: 6200 }, { day: '21/03', value: 5100 }, { day: '23/03', value: 7300 },
  { day: '25/03', value: 6800 }, { day: '27/03', value: 8100 }, { day: '29/03', value: 7600 },
  { day: '31/03', value: 9200 },
]

const channels = [
  { name: 'Telegram', value: 45, color: '#00e676' },
  { name: 'Discord',  value: 25, color: '#06b6d4' },
  { name: 'WhatsApp', value: 20, color: '#10B981' },
  { name: 'Web',      value: 10, color: '#F59E0B' },
]

const recentOrders = [
  { id: '#1042', product: 'Curso de Trading', channel: 'Telegram', amount: 'R$ 297,00', status: 'PAID' },
  { id: '#1041', product: 'Pack Indicadores',  channel: 'Discord',  amount: 'R$ 149,00', status: 'DELIVERED' },
  { id: '#1040', product: 'Acesso VIP',        channel: 'WhatsApp', amount: 'R$ 99,00',  status: 'PAID' },
  { id: '#1039', product: 'Curso de Trading',  channel: 'Web',      amount: 'R$ 297,00', status: 'DELIVERED' },
  { id: '#1038', product: 'E-book Cripto',     channel: 'Telegram', amount: 'R$ 47,00',  status: 'PENDING' },
  { id: '#1037', product: 'Pack Indicadores',  channel: 'Telegram', amount: 'R$ 149,00', status: 'PAID' },
]

const STATUS_BADGE: Record<string, string> = {
  PAID: 'badge-success', DELIVERED: 'badge-accent', PENDING: 'badge-warning', CANCELLED: 'badge-danger',
}
const STATUS_LABEL: Record<string, string> = {
  PAID: 'Pago', DELIVERED: 'Entregue', PENDING: 'Pendente', CANCELLED: 'Cancelado',
}

const metrics = [
  { label: 'Receita Hoje',     value: 'R$ 1.842',  delta: '+12%',    up: true,  icon: DollarSign },
  { label: 'Pedidos Hoje',     value: '24',          delta: '+8%',     up: true,  icon: ShoppingCart },
  { label: 'Receita do Mês',   value: 'R$ 38.210',  delta: '+23%',    up: true,  icon: TrendingUp },
  { label: 'Saldo Disponível', value: 'R$ 12.490',  delta: '-R$ 300', up: false, icon: Wallet },
]

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

export default function OverviewPage() {
  return (
    <div className="space-y-5">
      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map(({ label, value, delta, up, icon: Icon }) => (
          <div key={label} className="card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted">{label}</span>
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(0,230,118,0.1)', border: '1px solid rgba(0,230,118,0.2)' }}
              >
                <Icon size={15} style={{ color: '#00e676' }} />
              </div>
            </div>
            <p className="text-2xl font-semibold text-text">{value}</p>
            <p className={`text-xs mt-1.5 flex items-center gap-0.5 font-medium ${up ? 'text-success' : 'text-danger'}`}>
              {up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
              {delta} vs. mês anterior
            </p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Area chart */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold text-text">Receita — últimos 30 dias</h2>
            <span className="text-xs text-muted">Março 2026</span>
          </div>
          <ResponsiveContainer width="100%" height={210}>
            <AreaChart data={revenue}>
              <defs>
                <linearGradient id="gradGreen" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#00e676" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#00e676" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false}
                tickFormatter={v => `R$${(v / 1000).toFixed(0)}k`} />
              <Tooltip {...tooltipStyle}
                formatter={(v: number) => [`R$ ${v.toLocaleString('pt-BR')}`, 'Receita']} />
              <Area type="monotone" dataKey="value" stroke="#00e676" strokeWidth={2}
                fill="url(#gradGreen)" dot={false} activeDot={{ r: 4, fill: '#00e676', strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className="card">
          <h2 className="text-sm font-semibold text-text mb-4">Vendas por Canal</h2>
          <ResponsiveContainer width="100%" height={130}>
            <PieChart>
              <Pie data={channels} cx="50%" cy="50%" innerRadius={38} outerRadius={58}
                paddingAngle={3} dataKey="value">
                {channels.map(c => <Cell key={c.name} fill={c.color} />)}
              </Pie>
              <Tooltip {...tooltipStyle} formatter={(v: number) => [`${v}%`, '']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-3">
            {channels.map(c => (
              <div key={c.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: c.color }} />
                  <span className="text-xs text-muted">{c.name}</span>
                </div>
                <span className="text-xs font-semibold text-text">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-semibold text-text">Últimos Pedidos</h2>
          <a href="/orders" className="text-xs font-medium transition-all" style={{ color: '#00e676' }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
            Ver todos →
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['Pedido', 'Produto', 'Canal', 'Valor', 'Status'].map(h => (
                  <th key={h} className="pb-3 text-left text-xs text-muted font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(o => (
                <tr key={o.id} className="transition-colors"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                  onMouseLeave={e => (e.currentTarget.style.background = '')}>
                  <td className="py-3 font-mono text-xs text-muted">{o.id}</td>
                  <td className="py-3 text-text">{o.product}</td>
                  <td className="py-3 text-xs text-muted">{o.channel}</td>
                  <td className="py-3 font-semibold text-text">{o.amount}</td>
                  <td className="py-3">
                    <span className={STATUS_BADGE[o.status]}>{STATUS_LABEL[o.status]}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick balance card */}
      <div
        className="rounded-2xl p-6 flex items-center justify-between"
        style={{
          background: 'linear-gradient(135deg, rgba(0,230,118,0.08) 0%, rgba(6,182,212,0.06) 100%)',
          border: '1px solid rgba(0,230,118,0.2)',
        }}
      >
        <div>
          <p className="text-xs text-muted mb-1">Saldo disponível para saque</p>
          <p className="text-3xl font-bold text-text">R$ 12.490,00</p>
          <p className="text-xs text-muted mt-1">+ 1.840,50 USDT disponível</p>
        </div>
        <a href="/finance" className="btn-primary">
          <ArrowUpRight size={15} /> Sacar agora
        </a>
      </div>
    </div>
  )
}
