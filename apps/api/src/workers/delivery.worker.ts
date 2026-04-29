// workers/delivery.worker.ts
// Processa entrega automática após pagamento confirmado
// Fila: 'deliver_product'

import { Worker, Job } from 'bullmq'
import IORedis from 'ioredis'

const connection = new IORedis(process.env.REDIS_URL ?? 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
})

interface DeliveryJob {
  orderId: string
  merchantId: string
  productId: string
  buyerChannel: string
  buyerChannelId: string
  productType: 'DIGITAL' | 'ACCESS' | 'PHYSICAL' | 'SUBSCRIPTION'
  deliveryConfig: Record<string, unknown>
}

export const deliveryWorker = new Worker<DeliveryJob>(
  'deliver_product',
  async (job: Job<DeliveryJob>) => {
    const { orderId, productType, deliveryConfig, buyerChannel, buyerChannelId } = job.data

    console.log(`[delivery] Processing order ${orderId} | type=${productType} | channel=${buyerChannel}`)

    switch (productType) {
      case 'DIGITAL': {
        // TODO: gerar URL assinada temporária (1h) no Cloudflare R2
        // const signedUrl = await generateSignedUrl(deliveryConfig.fileUrl as string)
        // await sendToChannel(buyerChannel, buyerChannelId, `📦 Seu arquivo: ${signedUrl}`)
        console.log('[delivery] TODO: gerar URL assinada R2 e enviar via canal')
        break
      }
      case 'ACCESS': {
        const platform = deliveryConfig.platform as string
        if (platform === 'telegram') {
          // TODO: usar bot do vendedor para criar invite link único
          // const invite = await createTelegramInviteLink(deliveryConfig.groupId as string)
          // await sendTelegramMessage(buyerChannelId, `🔓 Acesso liberado: ${invite}`)
        } else if (platform === 'discord') {
          // TODO: criar invite para canal via Discord API
        }
        console.log('[delivery] TODO: criar invite e enviar ao comprador')
        break
      }
      case 'PHYSICAL': {
        // TODO: enviar formulário de coleta de endereço ao comprador
        // await sendAddressForm(buyerChannel, buyerChannelId, orderId)
        console.log('[delivery] TODO: enviar formulário de endereço')
        break
      }
      case 'SUBSCRIPTION': {
        // TODO: registrar expiração no banco e agendar remoção de acesso
        // await scheduleAccessRevocation(orderId, deliveryConfig.durationDays as number)
        console.log('[delivery] TODO: registrar expiração de assinatura')
        break
      }
    }
  },
  { connection }
)

deliveryWorker.on('completed', job => console.log(`[delivery] Job ${job.id} completed`))
deliveryWorker.on('failed', (job, err) => console.error(`[delivery] Job ${job?.id} failed:`, err.message))
