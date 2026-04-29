import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

// ── Schemas ────────────────────────────────────────────────────────────────
const registerBody = z.object({
  name:     z.string().min(2),
  email:    z.string().email(),
  password: z.string().min(8),
})

const loginBody = z.object({
  email:    z.string().email(),
  password: z.string().min(1),
})

const refreshBody = z.object({
  refreshToken: z.string().min(1),
})

// ── Plugin ─────────────────────────────────────────────────────────────────
// Business logic omitted — see live demo
export async function authRoutes(fastify: FastifyInstance) {
  // POST /auth/register
  fastify.post('/register', async (_req: FastifyRequest, reply: FastifyReply) => {
    return reply.status(501).send({ message: 'Business logic omitted — see live demo' })
  })

  // POST /auth/login
  fastify.post('/login', async (_req: FastifyRequest, reply: FastifyReply) => {
    return reply.status(501).send({ message: 'Business logic omitted — see live demo' })
  })

  // POST /auth/refresh
  fastify.post('/refresh', async (_req: FastifyRequest, reply: FastifyReply) => {
    return reply.status(501).send({ message: 'Business logic omitted — see live demo' })
  })

  // POST /auth/logout
  fastify.post(
    '/logout',
    { preHandler: [fastify.authenticate] },
    async (_req: FastifyRequest, reply: FastifyReply) => {
      return reply.status(501).send({ message: 'Business logic omitted — see live demo' })
    },
  )

  // GET /auth/me
  fastify.get(
    '/me',
    { preHandler: [fastify.authenticate] },
    async (_req: FastifyRequest, reply: FastifyReply) => {
      return reply.status(501).send({ message: 'Business logic omitted — see live demo' })
    },
  )
}

export { registerBody, loginBody, refreshBody }
