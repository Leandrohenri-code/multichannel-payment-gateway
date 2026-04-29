'use client'

import { useState } from 'react'
import { Download, Search, ChevronLeft, ChevronRight, X } from 'lucide-react'

const ORDERS = [
  { id: '#1042', product: 'Curso de Trading',    channel: 'Telegram', amount: 297,  fee: 14.85, status: 'PAID',      paidAt: '13/04/2026 14:22', buyer: 'user_8821' },
  { id: '#1041', product: 'Pack Indicadores',    channel: 'Discord',  amount: 149,  fee: 7.45,  status: 'DELIVERED', paidAt: '13/04/2026 11:10', buyer: 'user_7743' },
  { id: '#1040', product: 'Acesso VIP',          channel: 'WhatsApp', amount: 99,   fee: 4.95,  status: 'PAID',      paidAt: '13/04/2026 09:58', buyer: 'user_9921' },
  { id: '#1039', product: 'Curso de Trading',    channel: 'Web',      amount: 297,  fee: 14.85, status: 'DELIVERED', paidAt: '12/04/2026 22:31', buyer: 'user_3312' },
  { id: '#1038', product: 'E-book Cripto',       channel: 'Telegram', amount: 47,   fee: 2.35,  status: 'PENDING',   paidAt: '—',                buyer: 'user_5541' },
  { id: '#1037', product: 'Pack Indicadores',    channel: 'Telegram', amount: 149,  fee: 7.45,  status: 'PAID',      paidAt: '12/04/2026 18:44', buyer: 'user_6612' },
  { id: '#1036', product: 'Assinatura Sinais',   channel: 'Discord',  amount: 49,   fee: 2.45,  status: 'DELIVERED', paidAt: '12/04/2026 15:20', buyer: 'user_1190' },
  { id: '#1035', product: 'Mentoria 1:1',        channel: 'Web',      amount: 997,  fee: 49.85, status: 'PAID',      paidAt: '12/04/2026 12:05', buyer: 'user_8841' },
  { id: '#1034', product: 'Curso de Trading',    channel: 'WhatsApp', amount: 297,  fee: 14.85, status: 'CANCELLED', paidAt: '—',                buyer: 'user_4432' },
  { id: '#1033', product: 'E-book Cripto',       channel: 'Telegram', amount: 47,   fee: 2.35,  status: 'DELIVERED', paidAt: '11/04/2026 20:11', buyer: 'user_7721' },
]

const STATUS_BADGE: Record<string, string> = {
  PAID: 'badge-success', DELIVERED: 'badge-accent', PENDING: 'badge-warning', CANCELLED: 'badge-danger', EXPIRED: 'badge-muted',
}
const STATUS_LABEL: Record<string, string> = {
  PAID: 'Pago', DELIVERED: 'Entregue', PENDING: 'Pendente', CANCELLED: 'Cancelado', EXPIRED: 'Expirado',
}
const CHANNEL_COLOR: Record<string, string> = {
  Telegram: 'text-accent', Discord: 'text-purple-400', WhatsApp: 'text-success', Web: 'text-warning',
}

export default function OrdersPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [channelFilter, setChannelFilter] = useState('ALL')
  const [selected, setSelected] = useState<typeof ORDERS[0] | null>(null)

  const filtered = ORDERS.filter(o => {
    const matchSearch = o.id.includes(search) || o.product.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'ALL' || o.status === statusFilter
    const matchChannel = channelFilter === 'ALL' || o.channel === channelFilter
    return matchSearch && matchStatus && matchChannel
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-text">Pedidos</h1>
          <p className="text-sm text-muted mt-0.5">{filtered.length} pedidos encontrados</p>
        </div>
        <button className="btn-ghost flex items-center gap-2 border border-border">
          <Download size={14} /> Exportar CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input className="input pl-9 w-56" placeholder="Buscar pedido..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="input w-36" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="ALL">Todos status</option>
          <option value="PENDING">Pendente</option>
          <option value="PAID">Pago</option>
          <option value="DELIVERED">Entregue</option>
          <option value="CANCELLED">Cancelado</option>
        </select>
        <select className="input w-36" value={channelFilter} onChange={e => setChannelFilter(e.target.value)}>
          <option value="ALL">Todos canais</option>
          <option value="Telegram">Telegram</option>
          <option value="Discord">Discord</option>
          <option value="WhatsApp">WhatsApp</option>
          <option value="Web">Web</option>
        </select>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {['Pedido','Produto','Canal','Valor','Taxa','Status','Data'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs text-muted font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map(o => (
                <tr key={o.id} className="hover:bg-border/10 transition-colors cursor-pointer" onClick={() => setSelected(o)}>
                  <td className="px-4 py-3 font-mono text-xs text-muted">{o.id}</td>
                  <td className="px-4 py-3 text-text font-medium">{o.product}</td>
                  <td className={`px-4 py-3 text-xs font-medium ${CHANNEL_COLOR[o.channel]}`}>{o.channel}</td>
                  <td className="px-4 py-3 font-medium text-text">
                    R$ {o.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3 text-muted text-xs">
                    R$ {o.fee.toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={STATUS_BADGE[o.status]}>{STATUS_LABEL[o.status]}</span>
                  </td>
                  <td className="px-4 py-3 text-muted text-xs">{o.paidAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="px-4 py-3 border-t border-border flex items-center justify-between">
          <span className="text-xs text-muted">Mostrando {filtered.length} de {ORDERS.length}</span>
          <div className="flex items-center gap-1">
            <button className="btn-ghost p-1.5"><ChevronLeft size={14} /></button>
            <button className="btn-ghost p-1.5 bg-accent/10 text-accent text-xs">1</button>
            <button className="btn-ghost p-1.5 text-xs">2</button>
            <button className="btn-ghost p-1.5"><ChevronRight size={14} /></button>
          </div>
        </div>
      </div>

      {/* Drawer */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-end" onClick={() => setSelected(null)}>
          <div className="bg-surface w-full max-w-sm h-full p-6 overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-text">Detalhe do Pedido</h2>
              <button onClick={() => setSelected(null)} className="btn-ghost p-1.5"><X size={16} /></button>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted">ID</span>
                <span className="font-mono text-xs text-text">{selected.id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted">Produto</span>
                <span className="text-sm text-text font-medium">{selected.product}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted">Canal</span>
                <span className={`text-sm font-medium ${CHANNEL_COLOR[selected.channel]}`}>{selected.channel}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted">Valor</span>
                <span className="text-sm font-semibold text-text">R$ {selected.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted">Taxa plataforma</span>
                <span className="text-sm text-danger">- R$ {selected.fee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted">Líquido</span>
                <span className="text-sm font-semibold text-success">R$ {(selected.amount - selected.fee).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted">Status</span>
                <span className={STATUS_BADGE[selected.status]}>{STATUS_LABEL[selected.status]}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted">Pago em</span>
                <span className="text-xs text-text">{selected.paidAt}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted">Comprador</span>
                <span className="font-mono text-xs text-muted">{selected.buyer}</span>
              </div>
            </div>
            {selected.status === 'PAID' && (
              <button className="btn-primary w-full mt-8">Reenviar Entrega</button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
