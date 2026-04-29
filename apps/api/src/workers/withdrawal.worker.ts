// workers/withdrawal.worker.ts
// Processa saques dos vendedores
// Fila: 'process_withdrawal'

import { Worker, Job } from 'bullmq'
import IORedis from 'ioredis'

const connection = new IORedis(process.env.REDIS_URL ?? 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
})

interface WithdrawalJob {
  withdrawalId: string
  merchantId: string
  type: 'BRL' | 'USDT' | 'BTC' | 'BNB'
  amount: number
  pixKey?: string
  cryptoAddress?: string
  cryptoNetwork?: string
  asaasRecipientId?: string
}

export const withdrawalWorker = new Worker<WithdrawalJob>(
  'process_withdrawal',
  async (job: Job<WithdrawalJob>) => {
    const { withdrawalId, type, amount, merchantId } = job.data
    console.log(`[withdrawal] Processing ${withdrawalId} | type=${type} | amount=${amount}`)

    switch (type) {
      case 'BRL': {
        // 1. Consulta saldo disponível na subconta Asaas [PLACEHOLDER]
        // const { getRecipientBalance, createWithdrawal } = require('../lib/asaas')
        // const balance = await getRecipientBalance(job.data.asaasRecipientId!)
        // if (balance < amount) throw new Error('Saldo insuficiente na subconta Asaas')

        // 2. Solicita transferência via Asaas API [PLACEHOLDER]
        // const asaasWithdrawal = await createWithdrawal(
        //   job.data.asaasRecipientId!, amount, job.data.pixKey!
        // )
        console.log('[withdrawal] TODO: solicitar saque BRL via Asaas API')

        // 3. Atualiza status no banco
        // await prisma.withdrawal.update({
        //   where: { id: withdrawalId },
        //   data: { status: 'PROCESSING', asaasWithdrawalId: asaasWithdrawal.id }
        // })
        break
      }

      case 'USDT':
      case 'BTC': {
        // 1. Solicita saque BRL da subconta Asaas → conta operacional
        console.log('[withdrawal] TODO: sacar BRL da subconta Asaas')

        // 2. Aguarda confirmação via webhook Asaas (processado em outro handler)

        // 3. Executa conversão via Foxbit [PLACEHOLDER]
        // const { createMarketOrder } = require('../lib/foxbit')
        // const order = await createMarketOrder('buy', `${type.toLowerCase()}-brl`, amount)
        console.log(`[withdrawal] TODO: converter BRL → ${type} via Foxbit`)

        // 4. Envia cripto para carteira do vendedor
        // const { withdrawCrypto } = require('../lib/foxbit')
        // const txResult = await withdrawCrypto(type, job.data.cryptoAddress!, order.amount, job.data.cryptoNetwork!)
        console.log('[withdrawal] TODO: enviar cripto para carteira do vendedor')

        // 5. Salva txHash no banco
        // await prisma.withdrawal.update({
        //   where: { id: withdrawalId },
        //   data: { status: 'COMPLETED', txHash: txResult.txHash }
        // })
        break
      }
    }
  },
  { connection, concurrency: 5 }
)

withdrawalWorker.on('completed', job => console.log(`[withdrawal] Job ${job.id} completed`))
withdrawalWorker.on('failed', (job, err) => console.error(`[withdrawal] Job ${job?.id} failed:`, err.message))
