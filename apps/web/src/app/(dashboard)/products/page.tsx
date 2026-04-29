'use client'

import { useState } from 'react'
import { Plus, Package, Edit2, Archive, MoreVertical, Search } from 'lucide-react'

const PRODUCTS = [
  { id: '1', name: 'Curso de Trading',    type: 'DIGITAL',      price: 297,  status: 'ACTIVE',   sales: 142, stock: null },
  { id: '2', name: 'Pack Indicadores',    type: 'DIGITAL',      price: 149,  status: 'ACTIVE',   sales: 89,  stock: null },
  { id: '3', name: 'Acesso VIP Telegram', type: 'ACCESS',       price: 99,   status: 'ACTIVE',   sales: 211, stock: null },
  { id: '4', name: 'Mentoria 1:1',        type: 'PHYSICAL',     price: 997,  status: 'ACTIVE',   sales: 14,  stock: 5 },
  { id: '5', name: 'Assinatura Sinais',   type: 'SUBSCRIPTION', price: 49,   status: 'ACTIVE',   sales: 320, stock: null },
  { id: '6', name: 'E-book Cripto',       type: 'DIGITAL',      price: 47,   status: 'INACTIVE', sales: 68,  stock: null },
]

const TYPE_LABEL: Record<string, string> = {
  DIGITAL: 'Digital', ACCESS: 'Acesso', PHYSICAL: 'Físico', SUBSCRIPTION: 'Assinatura',
}

export default function ProductsPage() {
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)

  const filtered = PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-text">Produtos</h1>
          <p className="text-sm text-muted mt-0.5">{PRODUCTS.length} produtos cadastrados</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus size={15} /> Novo Produto
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
        <input className="input pl-11" placeholder="Buscar produto..." value={search}
          onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(p => (
          <div key={p.id} className="card group cursor-pointer transition-all duration-200"
            style={{}}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(0,230,118,0.25)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')}>

            {/* Image placeholder */}
            <div className="w-full h-32 rounded-xl mb-4 flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <Package size={30} style={{ color: 'rgba(255,255,255,0.12)' }} />
            </div>

            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-text text-sm truncate">{p.name}</p>
                <p className="text-xl font-bold text-text mt-1.5">
                  R$ {p.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <button className="btn-ghost p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical size={14} />
              </button>
            </div>

            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <span className="badge" style={{ background: 'rgba(0,230,118,0.1)', color: '#00e676' }}>
                {TYPE_LABEL[p.type]}
              </span>
              {p.status === 'ACTIVE'
                ? <span className="badge-success">Ativo</span>
                : <span className="badge-muted">Inativo</span>}
              {p.stock !== null && (
                <span className="badge-warning">{p.stock} estoque</span>
              )}
            </div>

            <div className="flex items-center justify-between mt-4 pt-4"
              style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <span className="text-xs text-muted">{p.sales} vendas</span>
              <div className="flex items-center gap-1">
                <button className="btn-ghost p-1.5"><Edit2 size={13} /></button>
                <button className="btn-ghost p-1.5"
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#EF4444'; (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.08)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = ''; (e.currentTarget as HTMLElement).style.background = '' }}>
                  <Archive size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          style={{ backdropFilter: 'blur(8px)' }}>
          <div className="w-full max-w-lg rounded-2xl p-6"
            style={{ background: 'rgba(12,22,36,0.98)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <h2 className="text-base font-semibold text-text mb-6">Novo Produto</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-muted block mb-1.5">Nome do produto</label>
                <input className="input" placeholder="Ex: Curso de Trading" />
              </div>
              <div>
                <label className="text-xs text-muted block mb-1.5">Descrição</label>
                <textarea className="input h-20" placeholder="Descreva o produto..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted block mb-1.5">Preço (R$)</label>
                  <input className="input" type="number" placeholder="0,00" />
                </div>
                <div>
                  <label className="text-xs text-muted block mb-1.5">Tipo</label>
                  <select className="input">
                    <option value="DIGITAL">Digital</option>
                    <option value="ACCESS">Acesso</option>
                    <option value="PHYSICAL">Físico</option>
                    <option value="SUBSCRIPTION">Assinatura</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted block mb-1.5">Parcelamento</label>
                  <select className="input">
                    {[1, 2, 3, 6, 12].map(n => (
                      <option key={n} value={n}>Até {n}x</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted block mb-1.5">Estoque</label>
                  <input className="input" type="number" placeholder="Ilimitado" />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 rounded-full text-sm font-medium text-muted transition-all"
                style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                onMouseLeave={e => (e.currentTarget.style.background = '')}>
                Cancelar
              </button>
              <button className="btn-primary flex-1 justify-center">Criar Produto</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
