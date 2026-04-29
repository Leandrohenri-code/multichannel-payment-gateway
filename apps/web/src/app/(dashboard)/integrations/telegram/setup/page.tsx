'use client'

import { useState } from 'react'
import { Check, ChevronRight, Bot, Palette, Package, CreditCard, Rocket, ExternalLink, GripVertical, ToggleLeft, ToggleRight } from 'lucide-react'

const STEPS = [
  { id: 1, label: 'Conectar Bot',      icon: Bot },
  { id: 2, label: 'Personalizar',      icon: Palette },
  { id: 3, label: 'Produtos',          icon: Package },
  { id: 4, label: 'Pagamentos',        icon: CreditCard },
  { id: 5, label: 'Publicar',          icon: Rocket },
]

const MOCK_PRODUCTS = [
  { id: '1', name: 'Curso de Trading',    price: 297, active: true },
  { id: '2', name: 'Pack Indicadores',    price: 149, active: true },
  { id: '3', name: 'Acesso VIP',          price: 99,  active: false },
  { id: '4', name: 'Assinatura Sinais',   price: 49,  active: true },
]

const PAYMENT_METHODS = [
  { id: 'PIX',                label: 'PIX',             desc: 'Instantâneo, sem taxas' },
  { id: 'CREDIT_CARD',        label: 'Cartão de Crédito', desc: 'Até 12x' },
  { id: 'CRYPTO_USDT_TRC20',  label: 'USDT TRC-20',    desc: 'Tether na rede TRON' },
  { id: 'CRYPTO_BTC_LIGHTNING',label: 'BTC Lightning',  desc: 'Bitcoin instantâneo' },
]

export default function TelegramSetupPage() {
  const [step, setStep] = useState(1)
  const [botToken, setBotToken] = useState('')
  const [botInfo, setBotInfo] = useState<{ name: string; username: string } | null>(null)
  const [validating, setValidating] = useState(false)
  const [storeName, setStoreName] = useState('Minha Loja')
  const [welcomeMsg, setWelcomeMsg] = useState('Bem-vindo à {nome_loja}! Escolha um produto abaixo 👇')
  const [products, setProducts] = useState(MOCK_PRODUCTS)
  const [methods, setMethods] = useState(['PIX', 'CREDIT_CARD', 'CRYPTO_USDT_TRC20'])
  const [published, setPublished] = useState(false)

  function handleValidateToken() {
    if (!botToken.trim()) return
    setValidating(true)
    setTimeout(() => {
      setBotInfo({ name: 'Minha Loja Bot', username: 'minhaloja_bot' })
      setValidating(false)
    }, 1200)
  }

  function toggleProduct(id: string) {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, active: !p.active } : p))
  }

  function toggleMethod(id: string) {
    setMethods(prev => prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id])
  }

  function handlePublish() {
    setTimeout(() => setPublished(true), 800)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <a href="/integrations" className="text-xs text-muted hover:text-text transition-colors">← Integrações</a>
        <h1 className="text-lg font-semibold text-text mt-2">Configurar Loja Telegram</h1>
        <p className="text-sm text-muted">Plug-and-play — sem código necessário</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-0">
        {STEPS.map((s, i) => {
          const done = s.id < step
          const active = s.id === step
          return (
            <div key={s.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                  done   ? 'bg-accent text-white' :
                  active ? 'bg-accent/20 text-accent border-2 border-accent' :
                           'bg-border text-muted'
                }`}>
                  {done ? <Check size={14} /> : s.id}
                </div>
                <span className={`text-xs mt-1.5 hidden sm:block ${active ? 'text-text' : 'text-muted'}`}>{s.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-px mx-1 ${done ? 'bg-accent' : 'bg-border'}`} />
              )}
            </div>
          )
        })}
      </div>

      {/* Step 1 — Conectar Bot */}
      {step === 1 && (
        <div className="card space-y-5">
          <h2 className="font-semibold text-text">Passo 1 — Conectar seu Bot</h2>

          <div className="bg-background rounded-lg p-4 text-xs text-muted space-y-2">
            <p className="font-medium text-text">Como criar um bot no Telegram:</p>
            <ol className="list-decimal list-inside space-y-1.5">
              <li>Abra o Telegram e procure por <span className="text-accent font-mono">@BotFather</span></li>
              <li>Envie o comando <span className="text-accent font-mono">/newbot</span></li>
              <li>Escolha um nome para o bot (ex: <em>Minha Loja</em>)</li>
              <li>Escolha um username terminando em <span className="font-mono">bot</span></li>
              <li>Copie o token que o BotFather enviar</li>
            </ol>
          </div>

          <div>
            <label className="text-xs text-muted block mb-1.5">Token do Bot</label>
            <div className="flex gap-2">
              <input
                className="input flex-1 font-mono text-xs"
                placeholder="1234567890:AAF..."
                value={botToken}
                onChange={e => setBotToken(e.target.value)}
              />
              <button
                onClick={handleValidateToken}
                disabled={validating || !botToken.trim()}
                className="btn-primary px-4 whitespace-nowrap disabled:opacity-50"
              >
                {validating ? 'Validando...' : 'Conectar'}
              </button>
            </div>
          </div>

          {botInfo && (
            <div className="bg-success/10 border border-success/30 rounded-lg p-4 flex items-center gap-3">
              <Check size={18} className="text-success flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-text">{botInfo.name}</p>
                <p className="text-xs text-muted font-mono">@{botInfo.username}</p>
              </div>
            </div>
          )}

          <button
            disabled={!botInfo}
            onClick={() => setStep(2)}
            className="btn-primary w-full disabled:opacity-40"
          >
            Próximo <ChevronRight size={14} className="inline" />
          </button>
        </div>
      )}

      {/* Step 2 — Personalizar */}
      {step === 2 && (
        <div className="card space-y-5">
          <h2 className="font-semibold text-text">Passo 2 — Personalizar a Loja</h2>
          <div>
            <label className="text-xs text-muted block mb-1.5">Nome da loja</label>
            <input className="input" value={storeName} onChange={e => setStoreName(e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-muted block mb-1.5">
              Mensagem de boas-vindas
              <span className="ml-2 text-accent">{'{'}{'}'}  variáveis: {'{nome_loja}'}, {'{total_produtos}'}</span>
            </label>
            <textarea
              className="input h-20 resize-none"
              value={welcomeMsg}
              onChange={e => setWelcomeMsg(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs text-muted block mb-1.5">Mensagem pós-pagamento</label>
            <input className="input" defaultValue="✅ Pagamento confirmado! Sua entrega está a caminho." />
          </div>
          <div>
            <label className="text-xs text-muted block mb-1.5">Emoji de destaque</label>
            <div className="flex gap-2 flex-wrap">
              {['🛍','🛒','💎','🚀','⚡','🔥','💰','🎯'].map(e => (
                <button key={e} className="w-10 h-10 rounded-lg border border-border hover:border-accent transition-colors text-xl flex items-center justify-center">
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="bg-background rounded-xl p-4">
            <p className="text-xs text-muted mb-3 font-medium">Preview da mensagem de boas-vindas:</p>
            <div className="bg-surface rounded-xl p-4 max-w-xs">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center text-sm">🛍</div>
                <p className="text-xs font-semibold text-text">{storeName}</p>
              </div>
              <p className="text-xs text-muted">
                {welcomeMsg.replace('{nome_loja}', storeName).replace('{total_produtos}', '4')}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="btn-ghost flex-1">Voltar</button>
            <button onClick={() => setStep(3)} className="btn-primary flex-1">Próximo →</button>
          </div>
        </div>
      )}

      {/* Step 3 — Produtos */}
      {step === 3 && (
        <div className="card space-y-5">
          <h2 className="font-semibold text-text">Passo 3 — Produtos no Bot</h2>
          <p className="text-xs text-muted">Ative os produtos que aparecerão no bot. Arraste para reordenar.</p>

          <div className="space-y-2">
            {products.map(p => (
              <div key={p.id} className="flex items-center gap-3 bg-background rounded-lg p-3">
                <GripVertical size={14} className="text-border cursor-grab" />
                <div className="flex-1">
                  <p className="text-sm text-text font-medium">{p.name}</p>
                  <p className="text-xs text-muted">
                    R$ {p.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <button onClick={() => toggleProduct(p.id)}>
                  {p.active
                    ? <ToggleRight size={24} className="text-accent" />
                    : <ToggleLeft size={24} className="text-muted" />
                  }
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep(2)} className="btn-ghost flex-1">Voltar</button>
            <button onClick={() => setStep(4)} className="btn-primary flex-1">Próximo →</button>
          </div>
        </div>
      )}

      {/* Step 4 — Pagamentos */}
      {step === 4 && (
        <div className="card space-y-5">
          <h2 className="font-semibold text-text">Passo 4 — Métodos de Pagamento</h2>
          <p className="text-xs text-muted">Selecione os métodos que estarão disponíveis no bot.</p>

          <div className="space-y-2">
            {PAYMENT_METHODS.map(m => {
              const on = methods.includes(m.id)
              return (
                <button
                  key={m.id}
                  onClick={() => toggleMethod(m.id)}
                  className={`flex items-center justify-between w-full p-4 rounded-lg border transition-colors ${
                    on ? 'border-accent bg-accent/10' : 'border-border hover:border-border/80'
                  }`}
                >
                  <div className="text-left">
                    <p className={`text-sm font-medium ${on ? 'text-accent' : 'text-text'}`}>{m.label}</p>
                    <p className="text-xs text-muted">{m.desc}</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    on ? 'bg-accent border-accent' : 'border-border'
                  }`}>
                    {on && <Check size={11} className="text-white" />}
                  </div>
                </button>
              )
            })}
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep(3)} className="btn-ghost flex-1">Voltar</button>
            <button onClick={() => setStep(5)} className="btn-primary flex-1">Próximo →</button>
          </div>
        </div>
      )}

      {/* Step 5 — Publicar */}
      {step === 5 && (
        <div className="card space-y-5">
          <h2 className="font-semibold text-text">Passo 5 — Publicar</h2>

          {!published ? (
            <>
              <div className="bg-background rounded-lg p-4 text-xs space-y-2">
                <p className="text-text font-medium mb-3">Resumo da configuração:</p>
                <div className="flex justify-between"><span className="text-muted">Bot</span><span className="text-text font-mono">@{botInfo?.username ?? 'minhaloja_bot'}</span></div>
                <div className="flex justify-between"><span className="text-muted">Loja</span><span className="text-text">{storeName}</span></div>
                <div className="flex justify-between"><span className="text-muted">Produtos ativos</span><span className="text-text">{products.filter(p => p.active).length}</span></div>
                <div className="flex justify-between"><span className="text-muted">Métodos</span><span className="text-text">{methods.length}</span></div>
              </div>
              <p className="text-xs text-muted">
                Ao clicar em publicar, a plataforma registrará o webhook automaticamente e seu bot estará ao vivo.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setStep(4)} className="btn-ghost flex-1">Voltar</button>
                <button onClick={handlePublish} className="btn-primary flex-1 flex items-center justify-center gap-2">
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
                <p className="font-semibold text-text text-base">Loja publicada com sucesso!</p>
                <p className="text-xs text-muted mt-1">Seu bot está ao vivo e pronto para vendas.</p>
              </div>
              <div className="bg-background rounded-lg p-4 inline-block">
                <p className="font-mono text-accent text-sm">
                  t.me/{botInfo?.username ?? 'minhaloja_bot'}
                </p>
              </div>
              <div className="flex gap-3 justify-center">
                <a href={`https://t.me/${botInfo?.username ?? 'minhaloja_bot'}`}
                  target="_blank"
                  className="btn-primary flex items-center gap-2">
                  <ExternalLink size={14} /> Abrir no Telegram
                </a>
                <a href="/integrations" className="btn-ghost border border-border">
                  Ver Integrações
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
