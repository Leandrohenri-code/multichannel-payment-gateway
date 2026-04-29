'use client'

import { useState } from 'react'
import { Check, ChevronRight, Link2, Hash, Palette, Package, Rocket, ExternalLink, ToggleLeft, ToggleRight, GripVertical } from 'lucide-react'

const STEPS = [
  { id: 1, label: 'Conectar Bot' },
  { id: 2, label: 'Canais' },
  { id: 3, label: 'Personalizar' },
  { id: 4, label: 'Produtos' },
  { id: 5, label: 'Publicar' },
]

const MOCK_CHANNELS = [
  { id: 'ch1', name: 'geral' },
  { id: 'ch2', name: 'loja' },
  { id: 'ch3', name: 'vendas' },
  { id: 'ch4', name: 'admin-logs' },
]

const MOCK_PRODUCTS = [
  { id: '1', name: 'Curso de Trading',  price: 297, active: true },
  { id: '2', name: 'Pack Indicadores', price: 149, active: true },
  { id: '3', name: 'Acesso VIP',       price: 99,  active: false },
]

export default function DiscordSetupPage() {
  const [step, setStep] = useState(1)
  const [botToken, setBotToken] = useState('')
  const [clientId, setClientId] = useState('')
  const [validated, setValidated] = useState(false)
  const [storeChannel, setStoreChannel] = useState('ch2')
  const [logsChannel, setLogsChannel] = useState('ch4')
  const [dmCheckout, setDmCheckout] = useState(true)
  const [storeName, setStoreName] = useState('Minha Loja')
  const [embedColor, setEmbedColor] = useState('#6366F1')
  const [products, setProducts] = useState(MOCK_PRODUCTS)
  const [published, setPublished] = useState(false)

  function handleValidate() {
    if (!botToken.trim() || !clientId.trim()) return
    setTimeout(() => setValidated(true), 900)
  }

  function toggleProduct(id: string) {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, active: !p.active } : p))
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <a href="/integrations" className="text-xs text-muted hover:text-text transition-colors">← Integrações</a>
        <h1 className="text-lg font-semibold text-text mt-2">Configurar Loja Discord</h1>
        <p className="text-sm text-muted">Plug-and-play — sem código necessário</p>
      </div>

      {/* Steps */}
      <div className="flex items-center gap-0">
        {STEPS.map((s, i) => {
          const done = s.id < step
          const active = s.id === step
          return (
            <div key={s.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                  done ? 'bg-accent text-white' : active ? 'bg-accent/20 text-accent border-2 border-accent' : 'bg-border text-muted'
                }`}>
                  {done ? <Check size={14} /> : s.id}
                </div>
                <span className={`text-xs mt-1.5 hidden sm:block ${active ? 'text-text' : 'text-muted'}`}>{s.label}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`flex-1 h-px mx-1 ${done ? 'bg-accent' : 'bg-border'}`} />}
            </div>
          )
        })}
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <div className="card space-y-5">
          <h2 className="font-semibold text-text">Passo 1 — Conectar Bot ao Servidor</h2>
          <div className="bg-background rounded-lg p-4 text-xs text-muted space-y-1.5">
            <p className="font-medium text-text">Como criar um bot no Discord:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Acesse <span className="text-accent">discord.com/developers/applications</span></li>
              <li>Clique em <em>New Application</em> e dê um nome</li>
              <li>Vá em <em>Bot</em> → <em>Add Bot</em> → copie o Token</li>
              <li>Em <em>OAuth2</em> → copie o Client ID</li>
              <li>Convide o bot para seu servidor com permissões de mensagens</li>
            </ol>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted block mb-1.5">Token do Bot</label>
              <input className="input font-mono text-xs" placeholder="MTI3..." value={botToken} onChange={e => setBotToken(e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-muted block mb-1.5">Client ID</label>
              <input className="input font-mono text-xs" placeholder="1234567890123456789" value={clientId} onChange={e => setClientId(e.target.value)} />
            </div>
          </div>
          <button onClick={handleValidate} disabled={!botToken.trim() || !clientId.trim()} className="btn-primary w-full disabled:opacity-40">
            {validated ? '✓ Conectado — continuar' : 'Conectar Bot'}
          </button>
          {validated && (
            <div className="bg-success/10 border border-success/30 rounded-lg p-3 flex items-center gap-2">
              <Check size={14} className="text-success" />
              <span className="text-xs text-text">Bot conectado! Servidor: <strong>Meu Servidor</strong></span>
            </div>
          )}
          <button disabled={!validated} onClick={() => setStep(2)} className="btn-primary w-full disabled:opacity-40">
            Próximo →
          </button>
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div className="card space-y-5">
          <h2 className="font-semibold text-text">Passo 2 — Configurar Canais</h2>
          <div>
            <label className="text-xs text-muted block mb-2">Canal da loja (onde o bot posta os produtos)</label>
            <div className="space-y-1.5">
              {MOCK_CHANNELS.map(ch => (
                <button key={ch.id} onClick={() => setStoreChannel(ch.id)}
                  className={`flex items-center gap-2 w-full p-3 rounded-lg border text-sm transition-colors ${
                    storeChannel === ch.id ? 'border-accent bg-accent/10 text-accent' : 'border-border text-muted hover:border-border/60'
                  }`}>
                  <Hash size={14} /> #{ch.name}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-muted block mb-2">Canal de logs (notificações de venda)</label>
            <div className="space-y-1.5">
              {MOCK_CHANNELS.map(ch => (
                <button key={ch.id} onClick={() => setLogsChannel(ch.id)}
                  className={`flex items-center gap-2 w-full p-3 rounded-lg border text-sm transition-colors ${
                    logsChannel === ch.id ? 'border-accent bg-accent/10 text-accent' : 'border-border text-muted hover:border-border/60'
                  }`}>
                  <Hash size={14} /> #{ch.name}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between bg-background rounded-lg p-4">
            <div>
              <p className="text-sm font-medium text-text">Checkout por DM</p>
              <p className="text-xs text-muted">Recomendado — mantém o canal limpo</p>
            </div>
            <button onClick={() => setDmCheckout(!dmCheckout)}>
              {dmCheckout ? <ToggleRight size={28} className="text-accent" /> : <ToggleLeft size={28} className="text-muted" />}
            </button>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="btn-ghost flex-1">Voltar</button>
            <button onClick={() => setStep(3)} className="btn-primary flex-1">Próximo →</button>
          </div>
        </div>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <div className="card space-y-5">
          <h2 className="font-semibold text-text">Passo 3 — Personalizar</h2>
          <div>
            <label className="text-xs text-muted block mb-1.5">Nome da loja</label>
            <input className="input" value={storeName} onChange={e => setStoreName(e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-muted block mb-1.5">Cor do embed</label>
            <div className="flex items-center gap-3">
              <input type="color" value={embedColor} onChange={e => setEmbedColor(e.target.value)}
                className="w-10 h-10 rounded cursor-pointer border border-border bg-transparent" />
              <input className="input w-32 font-mono text-xs" value={embedColor} onChange={e => setEmbedColor(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="text-xs text-muted block mb-1.5">Mensagem de boas-vindas</label>
            <textarea className="input h-20 resize-none" defaultValue={`Bem-vindo à ${storeName}! Use os botões abaixo para comprar.`} />
          </div>

          {/* Discord embed preview */}
          <div className="bg-background rounded-lg p-4">
            <p className="text-xs text-muted mb-3 font-medium">Preview do embed Discord:</p>
            <div className="bg-[#36393F] rounded-lg overflow-hidden max-w-sm">
              <div className="h-1" style={{ background: embedColor }} />
              <div className="p-4">
                <p className="text-white text-sm font-semibold">{storeName}</p>
                <p className="text-[#B9BBBE] text-xs mt-1">Bem-vindo à {storeName}! Use os botões abaixo para comprar.</p>
                <div className="mt-3 space-y-1">
                  {products.filter(p => p.active).slice(0,2).map(p => (
                    <div key={p.id} className="text-xs text-[#B9BBBE]">• {p.name} — R$ {p.price}</div>
                  ))}
                </div>
                <div className="flex gap-2 mt-3">
                  <div className="px-3 py-1.5 text-xs rounded font-medium text-white" style={{ background: embedColor }}>
                    🛍 Ver produtos
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep(2)} className="btn-ghost flex-1">Voltar</button>
            <button onClick={() => setStep(4)} className="btn-primary flex-1">Próximo →</button>
          </div>
        </div>
      )}

      {/* Step 4 */}
      {step === 4 && (
        <div className="card space-y-5">
          <h2 className="font-semibold text-text">Passo 4 — Produtos e Pagamentos</h2>
          <div className="space-y-2">
            {products.map(p => (
              <div key={p.id} className="flex items-center gap-3 bg-background rounded-lg p-3">
                <GripVertical size={14} className="text-border cursor-grab" />
                <div className="flex-1">
                  <p className="text-sm text-text font-medium">{p.name}</p>
                  <p className="text-xs text-muted">R$ {p.price}</p>
                </div>
                <button onClick={() => toggleProduct(p.id)}>
                  {p.active ? <ToggleRight size={24} className="text-accent" /> : <ToggleLeft size={24} className="text-muted" />}
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep(3)} className="btn-ghost flex-1">Voltar</button>
            <button onClick={() => setStep(5)} className="btn-primary flex-1">Próximo →</button>
          </div>
        </div>
      )}

      {/* Step 5 */}
      {step === 5 && (
        <div className="card space-y-5">
          <h2 className="font-semibold text-text">Passo 5 — Publicar</h2>
          {!published ? (
            <>
              <div className="bg-background rounded-lg p-4 text-xs space-y-2">
                <p className="text-text font-medium mb-3">Resumo:</p>
                <div className="flex justify-between"><span className="text-muted">Servidor</span><span className="text-text">Meu Servidor</span></div>
                <div className="flex justify-between"><span className="text-muted">Canal da loja</span><span className="text-text">#{MOCK_CHANNELS.find(c => c.id === storeChannel)?.name}</span></div>
                <div className="flex justify-between"><span className="text-muted">Checkout por DM</span><span className={dmCheckout ? 'text-success' : 'text-muted'}>{dmCheckout ? 'Sim' : 'Não'}</span></div>
                <div className="flex justify-between"><span className="text-muted">Produtos ativos</span><span className="text-text">{products.filter(p => p.active).length}</span></div>
              </div>
              <p className="text-xs text-muted">
                Ao publicar, os slash commands <code className="text-accent">/loja</code> e <code className="text-accent">/comprar</code> serão registrados no servidor automaticamente.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setStep(4)} className="btn-ghost flex-1">Voltar</button>
                <button onClick={() => { setTimeout(() => setPublished(true), 800) }} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  <Rocket size={14} /> Publicar Loja
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto">
                <Check size={28} className="text-success" />
              </div>
              <div>
                <p className="font-semibold text-text text-base">Loja publicada no Discord!</p>
                <p className="text-xs text-muted mt-1">
                  O embed foi postado no canal <strong>#{MOCK_CHANNELS.find(c => c.id === storeChannel)?.name}</strong>.
                </p>
              </div>
              <a href="/integrations" className="btn-primary inline-flex items-center gap-2">
                <ExternalLink size={14} /> Ver Integrações
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
