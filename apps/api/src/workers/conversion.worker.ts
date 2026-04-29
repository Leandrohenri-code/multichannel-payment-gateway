// workers/conversion.worker.ts
// Converte margem acumulada da plataforma em USDT via Foxbit
// Fila: 'convert_margin'
// Estratégia: acumula até R$200 antes de converter (reduz operações)

import { Worker, Job, Queue } from 'bullmq'
import IORedis from 'ioredis'

const connection = new IORedis(process.env.REDIS_URL ?? 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
})

const MIN_CONVERSION_BRL = 200

interface ConversionJob {
  triggeredBy: 'order_paid' | 'scheduled'
  orderId?: string
  marginBrl: number
}

export const conversionWorker = new Worker<ConversionJob>(
  'convert_margin',
  async (job: Job<ConversionJob>) => {
    console.log(`[conversion] Job triggered by ${job.data.triggeredBy}`)

    // TODO: importar prisma client
    // const { PrismaClient } = require('@prisma/client')
    // const prisma = new PrismaClient()

    // 1. Consulta total de margem acumulada pendente
    // const pending = await prisma.cryptoConversion.aggregate({
    //   where: { status: 'pending' },
    //   _sum: { amountBrl: true }
    // })
    // const totalBrl = Number(pending._sum.amountBrl ?? 0)

    const totalBrl = job.data.marginBrl // placeholder

    if (totalBrl < MIN_CONVERSION_BRL) {
      console.log(`[conversion] Saldo R$${totalBrl} abaixo do mínimo R$${MIN_CONVERSION_BRL} — aguardando`)
      return
    }

    // 2. Executa conversão via Foxbit [PLACEHOLDER]
    // const { createMarketOrder } = require('../lib/foxbit')
    // const order = await createMarketOrder('buy', 'usdt-brl', totalBrl)
    console.log(`[conversion] TODO: converter R$${totalBrl} em USDT via Foxbit`)

    // 3. Registra operação
    // await prisma.cryptoConversion.create({
    //   data: {
    //     amountBrl: totalBrl,
    //     amountCrypto: order.amount,
    //     currency: 'USDT',
    //     exchangeRate: order.price,
    //     foxbitOrderId: order.id,
    //     walletDestination: process.env.PLATFORM_TRON_ADDRESS!,
    //     status: 'completed',
    //   }
    // })

    // 4. Agenda saque para cold wallet da plataforma
    console.log('[conversion] TODO: agendar saque para cold wallet')
  },
  { connection }
)

conversionWorker.on('completed', job => console.log(`[conversion] Job ${job.id} completed`))
conversionWorker.on('failed', (job, err) => console.error(`[conversion] Job ${job?.id} failed:`, err.message))
