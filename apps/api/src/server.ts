import 'dotenv/config'
import Fastify, { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import rateLimit from '@fastify/rate-limit'
import fastifyJwt from '@fastify/jwt'
import { prisma } from './lib/prisma'

// ── Type augmentation ──────────────────────────────────────────────────────
declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { sub: string; email: string }
    user:    { sub: string; email: string }
  }
}

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (req: FastifyRequest, reply: FastifyReply) => Promise<void>
  }
}

// ── Build server ───────────────────────────────────────────────────────────
export async function buildServer(): Promise<FastifyInstance> {
  const fastify = Fastify({
    logger: {
      level: process.env.NODE_ENV === 'development' ? 'info' : 'warn',
      transport: process.env.NODE_ENV === 'development'
        ? { target: 'pino-pretty', options: { colorize: true } }
        : undefined,
    },
  })

  // ── Plugins ──────────────────────────────────────────────────────────────
  await fastify.register(cors, {
    origin: [
      'http://localhost:3000',
      process.env.APP_URL ?? 'http://localhost:3000',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  })

  await fastify.register(helmet, { global: true })

  await fastify.register(rateLimit, {
    max: 200,
    timeWindow: '1 minute',
  })

  await fastify.register(fastifyJwt, {
    secret: process.env.JWT_SECRET ?? 'fallback-secret-change-in-production',
    sign:   { expiresIn: '15m' },
  })

  // ── Authenticate decorator ───────────────────────────────────────────────
  fastify.decorate('authenticate', async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      await req.jwtVerify()
    } catch (err) {
      reply.status(401).send({ statusCode: 401, error: 'Unauthorized', message: 'Token inválido ou expirado' })
    }
  })

  // ── Health check ─────────────────────────────────────────────────────────
  fastify.get('/health', async () => ({
    status: 'ok',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  }))

  // ── Routes ────────────────────────────────────────────────────────────────
  const { authRoutes }        = await import('./modules/auth/auth.routes')
  const { merchantRoutes }    = await import('./modules/merchants/merchants.routes')
  const { productRoutes }     = await import('./modules/products/products.routes')
  const { orderRoutes }       = await import('./modules/orders/orders.routes')

  await fastify.register(authRoutes,     { prefix: '/auth' })
  await fastify.register(merchantRoutes, { prefix: '/merchants' })
  await fastify.register(productRoutes,  { prefix: '/products' })
  await fastify.register(orderRoutes,    { prefix: '/orders' })

  // ── Graceful shutdown ─────────────────────────────────────────────────────
  const shutdown = async (signal: string) => {
    fastify.log.info(`Received ${signal}, shutting down...`)
    await fastify.close()
    await prisma.$disconnect()
    process.exit(0)
  }
  process.on('SIGTERM', () => shutdown('SIGTERM'))
  process.on('SIGINT',  () => shutdown('SIGINT'))

  return fastify
}

// ── Start ─────────────────────────────────────────────────────────────────
async function start() {
  const fastify = await buildServer()
  const port    = parseInt(process.env.PORT ?? '3001')

  try {
    await fastify.listen({ port, host: '0.0.0.0' })
  } catch (err) {
    fastify.log.error(err)
    await prisma.$disconnect()
    process.exit(1)
  }
}

start()
