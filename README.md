# multichannel-payment-gateway

![Status](https://img.shields.io/badge/status-active-brightgreen)
![Stack](https://img.shields.io/badge/stack-Node.js%20%7C%20Next.js%20%7C%20Fastify-blue)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

A multi-channel SaaS payment gateway that enables merchants to sell digital and physical products through Telegram bots, Discord bots, WhatsApp, and a drop-in JavaScript widget — all from a single dashboard with split-revenue billing built in.

The platform handles the full payment lifecycle: checkout initiation across channels, payment processing via PIX, credit card, boleto (Asaas), and cryptocurrency (USDT TRC-20, BTC, BEP-20), automated delivery of digital goods, and non-custodial crypto settlement using HD Wallet derivation so each merchant receives funds directly at a unique on-chain address.

Revenue split between the platform and each merchant is calculated atomically at order creation and settled asynchronously through background workers — BRL payouts via Asaas sub-accounts, crypto payouts via Foxbit conversion and on-chain withdrawal.

---

## Architecture Overview

The project is organized as a **Turborepo monorepo** with two apps and a shared package layer. The API and the web dashboard are independent deployable units; the bots run as long-lived processes alongside the API or as separate services.

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

Payments flow through provider-specific adapters (`lib/asaas`, `lib/foxbit`, `lib/blockchain`) consumed by order routes and workers. The split math runs inside a Prisma transaction — platform fee percentage is stored per order so historical revenue is always auditable.

---

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Monorepo | [Turborepo](https://turbo.build) | Incremental builds and task pipelines across apps |
| API | [Fastify](https://fastify.dev) | 3× faster than Express, schema-first, native TypeScript |
| ORM | [Prisma](https://prisma.io) | Type-safe queries, migration history, Postgres enums |
| Queue | [BullMQ](https://bullmq.io) + Redis | Reliable job retry, delayed jobs, concurrency control |
| Frontend | [Next.js 14](https://nextjs.org) (App Router) | SSR for dashboard metrics, React Server Components |
| Styling | Tailwind CSS | Utility-first, no runtime overhead |
| BRL Payments | [Asaas](https://asaas.com) | Native split with sub-accounts, PIX + boleto + card in one API |
| Crypto Exchange | [Foxbit](https://foxbit.com.br) | Brazilian exchange, BRL↔USDT/BTC, REST v3 |
| Crypto Receive | HD Wallet (xPub) | Derive unlimited addresses from one public key — seed never touches the server |
| Blockchain Monitor | TronGrid + Blockstream APIs | Free public APIs for USDT TRC-20 and BTC confirmation polling |

---

## Payment Channels

### Telegram
Merchants configure a dedicated bot token through the dashboard. The bot presents a product catalog via inline keyboards; checkout is handled inside the chat. The `TelegramStoreConfig` model stores per-merchant bot settings, active product lists, and custom messages.

### Discord
A slash-command bot posts a persistent store embed in a merchant-specified channel. Buyers initiate checkout via button interactions; delivery is sent as a DM after payment confirmation. Guild and channel IDs are stored per merchant in `DiscordStoreConfig`.

### WhatsApp
Integrates with the WhatsApp Cloud API. Incoming messages are routed to order handlers via webhook. Verification token and phone number ID are stored per merchant.

### JavaScript Widget
A drop-in `<script>` tag that renders a checkout modal on any website. Communicates with the API via a per-merchant API key. No framework dependency.

---

## Payment Methods

| Method | Provider | Currency | Notes |
|---|---|---|---|
| PIX | Asaas | BRL | Instant settlement, QR code generated on demand |
| Credit Card | Asaas | BRL | Up to 12× installments, 3DS optional |
| Boleto | Asaas | BRL | 3-business-day clearing |
| USDT (TRC-20) | HD Wallet + TronGrid | USDT | ~19-block confirmation (~1 min) |
| USDT (BEP-20) | HD Wallet + BSCScan | USDT | BSC network |
| Bitcoin (on-chain) | HD Wallet + Blockstream | BTC | 1-confirmation minimum |

Crypto amounts are calculated at checkout using the Foxbit public ticker so merchants always receive the correct BRL-equivalent value. Platform margin on crypto orders is batch-converted to USDT via Foxbit and swept to a cold wallet on a configurable threshold (default R$200).

---

## Project Structure

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

## Getting Started

**Prerequisites:** Node.js 20+, Docker (for local Postgres + Redis)

```bash
# 1. Clone and install
git clone https://github.com/YOUR_USERNAME/multichannel-payment-gateway.git
cd multichannel-payment-gateway
npm install

# 2. Start infrastructure
docker compose up -d

# 3. Configure environment
cp .env.example .env
cp apps/api/.env.example apps/api/.env
# Edit both files — see inline comments for required values

# 4. Run database migrations
cd apps/api && npx prisma migrate dev

# 5. Start all services
npm run dev
```

API runs on `http://localhost:3001`, dashboard on `http://localhost:3000`.

---

## Security Note

This repository is a **portfolio release** of an active commercial product. The following modules have their implementation replaced with stubs that preserve function signatures and types:

- `apps/api/src/lib/foxbit.ts` — authenticated trading and withdrawal logic
- `apps/api/src/modules/auth/auth.routes.ts` — credential verification and token issuance
- `apps/api/src/lib/hdwallet.ts` — HD wallet address derivation (install instructions remain inline)

All `.env` files are excluded from version control. The `.env.example` files document every required variable with descriptions and setup links.

---

## Live Demo

> Coming soon — contact me for access to the staging environment.

---

## License

MIT © 2024
