'use client'

import Link from 'next/link'
import { CheckCircle, XCircle, AlertCircle, ArrowRight, Copy, Code2 } from 'lucide-react'

const integrations = [
  {
    id: 'telegram',
    name: 'Telegram',
    description: 'Bot de vendas com checkout conversacional. O comprador compra diretamente no chat.',
    status: 'ACTIVE',
    badgeCls: 'bg-blue-500/10 text-blue-400',
    setupUrl: '/integrations/telegram/setup',
    metrics: { vendas: 142, conversao: '18%' },
  },
  {
    id: 'discord',
    name: 'Discord',
    description: 'Loja via slash commands e embeds interativos. Checkout privado por DM.',
    status: 'INACTIVE',
    badgeCls: 'bg-purple-500/10 text-purple-400',
    setupUrl: '/integrations/discord/setup',
    metrics: null,
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    description: 'Integração via Meta Cloud API. Atende clientes no WhatsApp Business.',
    status: 'ERROR',
    badgeCls: 'bg-success/10 text-success',
    setupUrl: '/integrations/whatsapp/setup',
    metrics: null,
  },
  {
    id: 'website',
    name: 'Website',
    description: 'Widget JavaScript para incorporar no seu site. Zero dependências externas.',
    status: 'INACTIVE',
    badgeCls: 'bg-warning/10 text-warning',
    setupUrl: '/integrations/website/setup',
    metrics: null,
  },
]

const STATUS_ICON: Record<string, React.ReactNode> = {
  ACTIVE:   <CheckCircle size={14} className="text-success" />,
  INACTIVE: <XCircle size={14} className="text-muted" />,
  ERROR:    <AlertCircle size={14} className="text-danger" />,
}
const STATUS_TEXT: Record<string, string> = {
  ACTIVE: 'Ativo', INACTIVE: 'Inativo', ERROR: 'Erro de configuração',
}

const WIDGET_CODE = `<script
  src="https://cdn.gateway.pay/widget.js"
  data-key="pk_live_sua_chave_aqui"
  data-color="#6366F1"
  data-position="bottom-right"
></script>`

export default function IntegrationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-text">Integrações</h1>
        <p className="text-sm text-muted mt-0.5">Conecte seus canais de venda</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {integrations.map(int => (
          <div key={int.id} className="card flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold ${int.badgeCls}`}>
                  {int.name[0]}
                </div>
                <div>
                  <p className="font-medium text-text text-sm">{int.name}</p>
                  <span className="flex items-center gap-1 mt-0.5">
                    {STATUS_ICON[int.status]}
                    <span className="text-xs text-muted">{STATUS_TEXT[int.status]}</span>
                  </span>
                </div>
              </div>
              {int.status === 'ACTIVE' && (
                <span className="badge-success">Conectado</span>
              )}
              {int.status === 'ERROR' && (
                <span className="badge-danger">Erro</span>
              )}
            </div>

            <p className="text-xs text-muted flex-1">{int.description}</p>

            {int.metrics && (
              <div className="grid grid-cols-2 gap-3 my-4 bg-background rounded-lg p-3">
                <div>
                  <p className="text-xs text-muted">Vendas</p>
                  <p className="text-lg font-semibold text-text">{int.metrics.vendas}</p>
                </div>
                <div>
                  <p className="text-xs text-muted">Conversão</p>
                  <p className="text-lg font-semibold text-success">{int.metrics.conversao}</p>
                </div>
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-border">
              <Link href={int.setupUrl}
                className="btn-primary flex items-center justify-center gap-2 w-full">
                {int.status === 'ACTIVE' ? 'Gerenciar loja' : 'Configurar'}
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Widget embed code */}
      <div className="card">
        <div className="flex items-center gap-2 mb-3">
          <Code2 size={16} className="text-accent" />
          <h2 className="text-sm font-semibold text-text">Código do Widget Web</h2>
        </div>
        <p className="text-xs text-muted mb-3">
          Cole antes do fechamento do <code className="text-accent">&lt;/body&gt;</code> no seu site:
        </p>
        <div className="bg-background rounded-lg p-4 font-mono text-xs text-muted relative group">
          <pre className="overflow-x-auto whitespace-pre-wrap">{WIDGET_CODE}</pre>
          <button className="absolute top-3 right-3 btn-ghost p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <Copy size={13} />
          </button>
        </div>
      </div>
    </div>
  )
}
