import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../lib/prisma'

const createBody = z.object({
  name:              z.string().min(1),
  description:       z.string().optional(),
  price:             z.number().positive(),
  currency:          z.enum(['BRL', 'USD', 'USDT', 'BTC']).default('BRL'),
  type:              z.enum(['DIGITAL', 'PHYSICAL', 'SUBSCRIPTION', 'ACCESS']),
  deliveryConfig:    z.record(z.unknown()).default({}),
  hasStock:          z.boolean().default(false),
  stockQuantity:     z.number().int().positive().optional(),
  allowInstallments: z.boolean().default(false),
  maxInstallments:   z.number().int().min(1).max(12).default(1),
})

const updateBody = createBody.partial()

const listQuery = z.object({
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
  page:   z.coerce.number().int().positive().default(1),
  limit:  z.coerce.number().int().positive().max(100).default(20),
})

export async function productRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', fastify.authenticate)

  // GET /products ─────────────────────────────────────────────────────────
  fastify.get('/', async (req: FastifyRequest, reply: FastifyReply) => {
    const query = listQuery.safeParse(req.query)
    if (!query.success) return reply.status(400).send({ message: query.error.errors[0].message })

    const { status, page, limit } = query.data
    const skip = (page - 1) * limit

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where:   { merchantId: req.user.sub, ...(status ? { status } : {}) },
        orderBy: { createdAt: 'desc' },
        skip, take: limit,
      }),
      prisma.product.count({
        where: { merchantId: req.user.sub, ...(status ? { status } : {}) },
      }),
    ])

    return reply.send({ products, pagination: { total, page, limit, pages: Math.ceil(total / limit) } })
  })

  // GET /products/:id ─────────────────────────────────────────────────────
  fastify.get('/:id', async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const product = await prisma.product.findFirst({
      where: { id: req.params.id, merchantId: req.user.sub },
    })
    if (!product) return reply.status(404).send({ message: 'Produto não encontrado' })
    return reply.send({ product })
  })

  // POST /products ────────────────────────────────────────────────────────
  fastify.post('/', async (req: FastifyRequest, reply: FastifyReply) => {
    const parse = createBody.safeParse(req.body)
    if (!parse.success) {
      return reply.status(400).send({ statusCode: 400, error: 'Validation Error', message: parse.error.errors[0].message })
    }

    const product = await prisma.product.create({
      data: { ...parse.data, merchantId: req.user.sub },
    })
    return reply.status(201).send({ product })
  })

  // PUT /products/:id ─────────────────────────────────────────────────────
  fastify.put('/:id', async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const parse = updateBody.safeParse(req.body)
    if (!parse.success) {
      return reply.status(400).send({ statusCode: 400, error: 'Validation Error', message: parse.error.errors[0].message })
    }

    const existing = await prisma.product.findFirst({
      where: { id: req.params.id, merchantId: req.user.sub },
    })
    if (!existing) return reply.status(404).send({ message: 'Produto não encontrado' })

    const product = await prisma.product.update({
      where: { id: req.params.id },
      data:  parse.data,
    })
    return reply.send({ product })
  })

  // PATCH /products/:id/status ────────────────────────────────────────────
  fastify.patch('/:id/status', async (
    req: FastifyRequest<{ Params: { id: string }; Body: { status: 'ACTIVE' | 'INACTIVE' } }>,
    reply: FastifyReply,
  ) => {
    const { status } = req.body as { status: 'ACTIVE' | 'INACTIVE' }
    if (!['ACTIVE', 'INACTIVE'].includes(status)) {
      return reply.status(400).send({ message: 'Status deve ser ACTIVE ou INACTIVE' })
    }

    const existing = await prisma.product.findFirst({
      where: { id: req.params.id, merchantId: req.user.sub },
    })
    if (!existing) return reply.status(404).send({ message: 'Produto não encontrado' })

    const product = await prisma.product.update({
      where: { id: req.params.id },
      data:  { status },
    })
    return reply.send({ product })
  })

  // DELETE /products/:id ──────────────────────────────────────────────────
  fastify.delete('/:id', async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const existing = await prisma.product.findFirst({
      where: { id: req.params.id, merchantId: req.user.sub },
    })
    if (!existing) return reply.status(404).send({ message: 'Produto não encontrado' })

    // Soft delete — mark as INACTIVE
    await prisma.product.update({ where: { id: req.params.id }, data: { status: 'INACTIVE' } })
    return reply.status(204).send()
  })
}
