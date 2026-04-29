'use client'

import { useState } from 'react'
import { Save, Eye, EyeOff, Copy, RefreshCw } from 'lucide-react'

export default function SettingsPage() {
  const [showKey, setShowKey] = useState(false)
  const [plan, setPlan] = useState('FREE')

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-lg font-semibold text-text">Configurações</h1>
        <p className="text-sm text-muted mt-0.5">Perfil, dados bancários e API</p>
      </div>

      {/* Profile */}
      <div className="card space-y-4">
        <h2 className="text-sm font-semibold text-text border-b border-border pb-3">Perfil</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-muted block mb-1.5">Nome</label>
            <input className="input" defaultValue="João Silva" />
          </div>
          <div>
            <label className="text-xs text-muted block mb-1.5">E-mail</label>
            <input className="input" defaultValue="joao@empresa.com" />
          </div>
        </div>
        <div>
          <label className="text-xs text-muted block mb-1.5">Documento (CPF/CNPJ)</label>
          <input className="input max-w-xs" defaultValue="123.456.789-00" />
        </div>
        <button className="btn-primary flex items-center gap-2 w-fit">
          <Save size={14} /> Salvar Perfil
        </button>
      </div>

      {/* Bank data */}
      <div className="card space-y-4">
        <h2 className="text-sm font-semibold text-text border-b border-border pb-3">Dados Bancários</h2>
        <div>
          <label className="text-xs text-muted block mb-1.5">Chave PIX</label>
          <input className="input max-w-sm" placeholder="CPF, e-mail, telefone ou chave aleatória" />
        </div>
        <div>
          <label className="text-xs text-muted block mb-1.5">Tipo de chave</label>
          <select className="input max-w-xs">
            <option value="cpf">CPF</option>
            <option value="cnpj">CNPJ</option>
            <option value="email">E-mail</option>
            <option value="phone">Telefone</option>
            <option value="random">Chave aleatória</option>
          </select>
        </div>
        <button className="btn-primary flex items-center gap-2 w-fit">
          <Save size={14} /> Salvar Dados
        </button>
      </div>

      {/* Plan */}
      <div className="card space-y-4">
        <h2 className="text-sm font-semibold text-text border-b border-border pb-3">Plano</h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'FREE',     label: 'Free',     fee: '5%',  price: 'Grátis' },
            { id: 'PRO',      label: 'Pro',       fee: '3%',  price: 'R$ 97/mês' },
            { id: 'BUSINESS', label: 'Business',  fee: '1,5%', price: 'R$ 297/mês' },
          ].map(p => (
            <button key={p.id} onClick={() => setPlan(p.id)}
              className={`p-4 rounded-xl border text-left transition-colors ${
                plan === p.id ? 'border-accent bg-accent/10' : 'border-border hover:border-border/60'
              }`}>
              <p className={`text-sm font-semibold ${plan === p.id ? 'text-accent' : 'text-text'}`}>{p.label}</p>
              <p className="text-xs text-muted mt-0.5">{p.price}</p>
              <p className="text-xs text-success mt-2">{p.fee} por transação</p>
            </button>
          ))}
        </div>
      </div>

      {/* API Keys */}
      <div className="card space-y-4">
        <h2 className="text-sm font-semibold text-text border-b border-border pb-3">API Keys</h2>
        <div>
          <label className="text-xs text-muted block mb-1.5">Chave de API</label>
          <div className="flex items-center gap-2">
            <div className="input flex-1 font-mono text-xs flex items-center">
              {showKey ? 'gwsk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' : '•'.repeat(40)}
            </div>
            <button onClick={() => setShowKey(!showKey)} className="btn-ghost p-2">
              {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
            <button className="btn-ghost p-2"><Copy size={14} /></button>
            <button className="btn-ghost p-2 hover:text-danger hover:bg-danger/10"><RefreshCw size={14} /></button>
          </div>
          <p className="text-xs text-muted mt-1">Use esta chave para autenticar requisições à API Gateway.</p>
        </div>

        <div>
          <label className="text-xs text-muted block mb-1.5">Webhook URL</label>
          <input className="input" placeholder="https://seusite.com/webhooks/gateway" />
          <p className="text-xs text-muted mt-1">Receba notificações de pagamento em tempo real.</p>
        </div>

        <button className="btn-primary flex items-center gap-2 w-fit">
          <Save size={14} /> Salvar Configurações
        </button>
      </div>
    </div>
  )
}
