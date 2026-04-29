import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../lib/prisma'

const updateBody = z.object({
  name:            z.string().min(2).optional(),
  document:        z.string().optional(),
  bankCode:        z.string().optional(),
  bankAgency:      z.string().optional(),
  bankAccount:     z.string().optional(),
  bankAccountType: z.enum(['checking', 'savings']).optional(),
  pixKey:          z.string().optional(),
  pixKeyType:      z.enum(['cpf', 'cnpj', 'email', 'phone', 'random']).optional(),
  webhookUrl:      z.string().url().optional().or(z.literal('')),
  notificationEmail: z.string().email().optional(),
})

export async function merchantRoutes(fastify: FastifyInstance) {
  // All routes require authentication
  fastify.addHook('preHandler', fastify.authenticate)

  // GET /merchants/me ─────────────────────────────────────────────────────
  fastify.get('/me', async (req: FastifyRequest, reply: FastifyReply) => {
    const merchant = await prisma.merchant.findUnique({
      where: { id: req.user.sub },
      select: {
        id: true, email: true, name: true, document: true,
        status: true, plan: true,
        bankCode: true, bankAgency: true, bankAccount: true,
        bankAccountType: true, pixKey: true, pixKeyType: true,
        webhookUrl: true, notificationEmail: true,
        trc20Address: true, btcAddress: true, bepAddress: true,
        hdWalletIndex: true, createdAt: true, updatedAt: true,
      },
    })
    if (!merchant) return reply.status(404).send({ message: 'Merchant não encontrado' })
    return reply.send({ merchant })
  })

  // PUT /merchants/me ─────────────────────────────────────────────────────
  fastify.put('/me', async (req: FastifyRequest, reply: FastifyReply) => {
    const parse = updateBody.safeParse(req.body)
    if (!parse.success) {
      return reply.status(400).send({ statusCode: 400, error: 'Validation Error', message: parse.error.errors[0].message })
    }

    const merchant = await prisma.merchant.update({
      where: { id: req.user.sub },
      data:  parse.data,
      select: {
        id: true, email: true, name: true, document: true,
        status: true, plan: true, pixKey: true, pixKeyType: true,
        webhookUrl: true, notificationEmail: true,
        updatedAt: true,
      },
    })
    return reply.send({ merchant })
  })

  // GET /merchants/balance (placeholder — depende de Asaas) ───────────────
  fastify.get('/balance', async (_req: FastifyRequest, reply: FastifyReply) => {
    return reply.send({
      brl:  0,
      usdt: 0,
      note: 'Integração Asaas pendente — configure ASAAS_API_KEY no .env',
    })
  })
}
