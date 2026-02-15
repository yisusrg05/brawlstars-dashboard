import Fastify from 'fastify'
import cors from '@fastify/cors'
import fetch from 'node-fetch'

const fastify = Fastify({ logger: true })

// ─── Validate required env var at startup ─────────────────────────────────────
const BS_TOKEN = process.env.BS_TOKEN
if (!BS_TOKEN) {
  console.error('❌ Missing required environment variable: BS_TOKEN')
  console.error('   Set it in Render → Environment → Add Environment Variable')
  process.exit(1)
}

// ─── CORS ────────────────────────────────────────────────────────────────────
await fastify.register(cors, {
  origin: process.env.ALLOWED_ORIGIN || '*',
  methods: ['GET'],
})

const BS_API = 'https://api.brawlstars.com/v1'
const AUTH   = `Bearer ${BS_TOKEN}`

// ─── Health check ────────────────────────────────────────────────────────────
fastify.get('/', async () => {
  return { status: 'ok', service: 'Brawl Stars Proxy', version: '2.0.0' }
})

// ─── Player data ─────────────────────────────────────────────────────────────
fastify.get('/player/:tag', async (request, reply) => {
  const { tag } = request.params
  const encodedTag = encodeURIComponent(tag.startsWith('#') ? tag : `#${tag}`)

  try {
    const res  = await fetch(`${BS_API}/players/${encodedTag}`, {
      headers: { Authorization: AUTH },
    })
    const data = await res.json()

    if (!res.ok) {
      return reply.code(res.status).send({
        error:  data.message || 'Brawl Stars API error',
        reason: data.reason,
      })
    }

    return data
  } catch (err) {
    fastify.log.error(err)
    return reply.code(502).send({ error: 'Failed to reach Brawl Stars API' })
  }
})

// ─── Brawlers list (for rarity info) ─────────────────────────────────────────
fastify.get('/brawlers', async (request, reply) => {
  try {
    const res  = await fetch(`${BS_API}/brawlers`, {
      headers: { Authorization: AUTH },
    })
    const data = await res.json()

    if (!res.ok) {
      return reply.code(res.status).send({
        error: data.message || 'Brawl Stars API error',
      })
    }

    return data
  } catch (err) {
    fastify.log.error(err)
    return reply.code(502).send({ error: 'Failed to reach Brawl Stars API' })
  }
})

// ─── Start ───────────────────────────────────────────────────────────────────
const port = process.env.PORT || 3000
const host = process.env.HOST || '0.0.0.0'

try {
  await fastify.listen({ port, host })
  fastify.log.info(`✅ Server running on http://${host}:${port}`)
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}
