import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../lib/prisma'

const listQuery = z.object({
  status:  z.enum(['PENDING', 'PAID', 'DELIVERED', 'CANCELLED', 'EXPIRED', 'REFUNDED']).optional(),
  channel: z.enum(['TELEGRAM', 'DISCORD', 'WHATSAPP', 'WEB']).optional(),
  from:    z.string().optional(),   // ISO date
  to:      z.string().optional(),   // ISO date
  page:    z.coerce.number().int().positive().default(1),
  limit:   z.coerce.number().int().positive().max(100).default(20),
})

export async function orderRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', fastify.authenticate)

  // GET /orders ───────────────────────────────────────────────────────────
  fastify.get('/', async (req: FastifyRequest, reply: FastifyReply) => {
    const query = listQuery.safeParse(req.query)
    if (!query.success) return reply.status(400).send({ message: query.error.errors[0].message })

    const { status, channel, from, to, page, limit } = query.data
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = { merchantId: req.user.sub }
    if (status)  where.status       = status
    if (channel) where.buyerChannel = channel
    if (from || to) {
      where.createdAt = {
        ...(from ? { gte: new Date(from) } : {}),
        ...(to   ? { lte: new Date(to)   } : {}),
      }
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip, take: limit,
        include: { product: { select: { id: true, name: true, type: true } } },
      }),
      prisma.order.count({ where }),
    ])

    return reply.send({ orders, pagination: { total, page, limit, pages: Math.ceil(total / limit) } })
  })

  // GET /orders/:id ───────────────────────────────────────────────────────
  fastify.get('/:id', async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const order = await prisma.order.findFirst({
      where:   { id: req.params.id, merchantId: req.user.sub },
      include: { product: true },
    })
    if (!order) return reply.status(404).send({ message: 'Pedido não encontrado' })
    return reply.send({ order })
  })

  // GET /orders/summary ───────────────────────────────────────────────────
  fastify.get('/summary', async (req: FastifyRequest, reply: FastifyReply) => {
    const merchantId = req.user.sub
    const now    = new Date()
    const today  = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const week   = new Date(today.getTime() - 7  * 24 * 60 * 60 * 1000)
    const month  = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

    const [todayCount, weekCount, monthCount, totalCount] = await Promise.all([
      prisma.order.count({ where: { merchantId, status: 'PAID', paidAt: { gte: today } } }),
      prisma.order.count({ where: { merchantId, status: 'PAID', paidAt: { gte: week  } } }),
      prisma.order.count({ where: { merchantId, status: 'PAID', paidAt: { gte: month } } }),
      prisma.order.count({ where: { merchantId, status: { in: ['PAID', 'DELIVERED'] } } }),
    ])

    const [todayRevenue, monthRevenue] = await Promise.all([
      prisma.order.aggregate({
        where:  { merchantId, status: 'PAID', paidAt: { gte: today } },
        _sum:   { merchantAmount: true },
      }),
      prisma.order.aggregate({
        where:  { merchantId, status: 'PAID', paidAt: { gte: month } },
        _sum:   { merchantAmount: true },
      }),
    ])

    return reply.send({
      orders:  { today: todayCount, week: weekCount, month: monthCount, total: totalCount },
      revenue: {
        today: Number(todayRevenue._sum.merchantAmount ?? 0),
        month: Number(monthRevenue._sum.merchantAmount ?? 0),
      },
    })
  })
}
