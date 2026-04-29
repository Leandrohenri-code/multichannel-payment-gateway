# multichannel-payment-gateway

![Status](https://img.shields.io/badge/status-active-brightgreen)
![Stack](https://img.shields.io/badge/stack-Node.js%20%7C%20Next.js%20%7C%20Fastify-blue)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

Gateway de pagamentos SaaS multi-canal que permite a vendedores comercializarem produtos digitais e físicos via bots no Telegram, Discord, WhatsApp e um widget JavaScript drop-in tudo a partir de um único painel, com divisão de receita (split) nativa.

A plataforma gerencia o ciclo completo de pagamento: iniciação do checkout em cada canal, processamento via PIX, cartão de crédito, boleto (Asaas) e criptomoedas (USDT TRC-20, BTC, BEP-20), entrega automática de produtos digitais e liquidação cripto non-custodial via derivação de HD Wallet, cada vendedor recebe diretamente em um endereço on-chain único.

O split de receita entre plataforma e vendedor é calculado atomicamente na criação do pedido e liquidado de forma assíncrona por workers em background. Saques em BRL via subcontas Asaas, saques em cripto via conversão na Foxbit e retirada on-chain.

---

## Visão Geral da Arquitetura

O projeto é organizado como um **monorepo Turborepo** com dois apps e uma camada de pacotes compartilhados. A API e o painel web são unidades deployáveis independentes; os bots rodam como processos de longa duração junto à API ou como serviços separados

```
Client (Telegram / Discord / WhatsApp / Browser)
        │
        ▼
  ┌─────────────────────────────────────────────┐
  │         apps/api  (Fastify + Node.js)        │
  │  ┌──────────────┐  ┌──────────────────────┐  │
  │  │  REST Routes  │  │  Background Workers  │  │
  │  │  /auth        │  │  deliver_product     │  │
  │  │  /merchants   │  │  process_withdrawal  │  │
  │  │  /products    │  │  convert_margin      │  │
  │  │  /orders      │  └──────────────────────┘  │
  │  └──────────────┘                             │
  │         │               ┌──────────┐          │
  │         └──────────────►│  Redis   │ (BullMQ) │
  │                         └──────────┘          │
  │         │               ┌──────────┐          │
  │         └──────────────►│ Postgres │ (Prisma) │
  └─────────────────────────────────────────────┘
        │
        ▼
  ┌─────────────────────┐
  │  apps/web (Next.js) │  Merchant Dashboard SPA
  └─────────────────────┘
```


Os pagamentos fluem por adaptadores específicos de cada provedor (`lib/asaas`, `lib/foxbit`, `lib/blockchain`), consumidos pelas rotas de pedidos e pelos workers. O cálculo do split ocorre dentro de uma transaction Prisma — o percentual de taxa da plataforma é armazenado por pedido, garantindo auditabilidade histórica da receita.

---

## Tech Stack

| Camada | Tecnologia | Por quê |
|---|---|---|
| Monorepo | [Turborepo](https://turbo.build) | Builds incrementais e pipelines de tarefas entre os apps |
| API | [Fastify](https://fastify.dev) | 3× mais rápido que Express, schema-first, TypeScript nativo |
| ORM | [Prisma](https://prisma.io) | Queries type-safe, histórico de migrations, enums Postgres |
| Fila | [BullMQ](https://bullmq.io) + Redis | Retry confiável de jobs, delayed jobs, controle de concorrência |
| Frontend | [Next.js 14](https://nextjs.org) (App Router) | SSR para métricas do painel, React Server Components |
| Estilo | Tailwind CSS | Utility-first, sem overhead em runtime |
| Pagamentos BRL | [Asaas](https://asaas.com) | Split nativo com subcontas, PIX + boleto + cartão em uma única API |
| Crypto Exchange | [Foxbit](https://foxbit.com.br) | Exchange brasileira, BRL↔USDT/BTC, REST v3 |
| Recebimento Cripto | HD Wallet (xPub) | Deriva endereços ilimitados de uma única chave pública — a seed jamais toca o servidor |
| Monitor Blockchain | TronGrid + Blockstream APIs | APIs públicas gratuitas para polling de confirmações USDT TRC-20 e BTC |

---

## Canais de Venda

### Telegram
O vendedor configura um token de bot dedicado pelo painel. O bot exibe o catálogo de produtos via teclados inline; o checkout é feito inteiramente dentro do chat. O model `TelegramStoreConfig` armazena as configurações do bot por vendedor, lista de produtos ativos e mensagens personalizadas.

### Discord
Um bot de slash commands publica um embed de loja persistente no canal indicado pelo vendedor. Os compradores iniciam o checkout via interações de botão; a entrega é enviada por DM após a confirmação do pagamento. Os IDs de servidor e canal são armazenados por vendedor em `DiscordStoreConfig`.

### WhatsApp
Integração com a WhatsApp Cloud API. As mensagens recebidas são roteadas para handlers de pedido via webhook. O token de verificação e o ID do número de telefone são armazenados por vendedor.

### Widget JavaScript
Uma tag `<script>` drop-in que renderiza um modal de checkout em qualquer site. Comunica-se com a API via API key por vendedor. Sem dependência de framework.

---

## Métodos de Pagamento

| Método | Provedor | Moeda | Observações |
|---|---|---|---|
| PIX | Asaas | BRL | Liquidação instantânea, QR code gerado sob demanda |
| Cartão de Crédito | Asaas | BRL | Até 12× parcelas, 3DS opcional |
| Boleto | Asaas | BRL | Compensação em 3 dias úteis |
| USDT (TRC-20) | HD Wallet + TronGrid | USDT | ~19 blocos de confirmação (~1 min) |
| USDT (BEP-20) | HD Wallet + BSCScan | USDT | Rede BSC |
| Bitcoin (on-chain) | HD Wallet + Blockstream | BTC | Mínimo de 1 confirmação |

Os valores em cripto são calculados no checkout usando o ticker público da Foxbit, garantindo que o vendedor sempre receba o equivalente correto em BRL. A margem da plataforma em pedidos cripto é convertida em lote para USDT via Foxbit e transferida para uma cold wallet a partir de um limite configurável (padrão R$200).

---

## Estrutura do Projeto


```
.
├── apps/
│   ├── api/                        Fastify REST API
│   │   ├── prisma/
│   │   │   └── schema.prisma       Full data model (Merchant, Product, Order, Withdrawal…)
│   │   └── src/
│   │       ├── server.ts           Server bootstrap, plugins, graceful shutdown
│   │       ├── lib/
│   │       │   ├── asaas.ts        Asaas API adapter (PIX / card / boleto / split)
│   │       │   ├── foxbit.ts       Foxbit API adapter (BRL↔crypto conversion)
│   │       │   ├── hdwallet.ts     HD Wallet address derivation from xPub
│   │       │   ├── blockchain.ts   On-chain balance and transaction polling
│   │       │   └── prisma.ts       Prisma client singleton
│   │       ├── modules/
│   │       │   ├── auth/           Register, login, JWT refresh, logout
│   │       │   ├── merchants/      Merchant profile and bank/crypto settings
│   │       │   ├── products/       Product CRUD with delivery config
│   │       │   └── orders/         Order listing, filtering, revenue summary
│   │       └── workers/
│   │           ├── delivery.worker.ts    Post-payment delivery (files, invites, physical)
│   │           ├── withdrawal.worker.ts  Merchant payout (BRL via Asaas, crypto via Foxbit)
│   │           └── conversion.worker.ts  Platform margin BRL→USDT batch conversion
│   └── web/                        Next.js 14 merchant dashboard
│       └── src/app/
│           ├── (auth)/             Login and registration pages
│           └── (dashboard)/
│               ├── overview/       Revenue and order metrics
│               ├── products/       Product management
│               ├── orders/         Order history and filters
│               ├── finance/        Withdrawal requests
│               ├── integrations/   Bot and widget setup wizards
│               └── settings/       Merchant profile
├── docker-compose.yml              Postgres + Redis for local development
├── turbo.json                      Turborepo pipeline configuration
└── package.json                    Workspace root
```

---


---

## Como Rodar

**Pré-requisitos:** Node.js 20+, Docker (para Postgres + Redis local)

```bash
# 1. Clonar e instalar dependências
git clone https://github.com/Leandrohenri-code/multichannel-payment-gateway.git
cd multichannel-payment-gateway
npm install

# 2. Subir a infraestrutura
docker compose up -d

# 3. Configurar variáveis de ambiente
cp .env.example .env
cp apps/api/.env.example apps/api/.env
# Edite os dois arquivos — veja os comentários inline para os valores necessários

# 4. Executar as migrations do banco
cd apps/api && npx prisma migrate dev

# 5. Iniciar todos os serviços
npm run dev
```

API runs on `http://localhost:3001`, dashboard on `http://localhost:3000`.

---

## Nota de Segurança

Este repositório é uma versão de portfólio de um produto comercial ativo. Os seguintes módulos tiveram sua implementação substituída por stubs que preservam as assinaturas de função e os tipos:

- `apps/api/src/lib/foxbit.ts` — lógica de trading autenticado e saque
- `apps/api/src/modules/auth/auth.routes.ts` —  verificação de credenciais e emissão de tokens
- `apps/api/src/lib/hdwallet.ts` — derivação de endereços HD Wallet (instruções de instalação mantidas inline)

Todos os arquivos .env são excluídos do controle de versão. Os arquivos .env.example documentam cada variável necessária com descrições e links de configuração.

---

## Demo ao Vivo

> Em breve, entre em contato para acesso ao ambiente de staging.

---

## Licença

MIT © 2024
