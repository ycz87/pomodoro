import { Hono } from 'hono'
import type { Env } from '../index'
import { authMiddleware } from '../middleware/auth'

type AuthEnv = { Bindings: Env; Variables: { userId: string; email: string } }

export const achievementsRoutes = new Hono<AuthEnv>()

achievementsRoutes.use('*', authMiddleware)

// GET /achievements — return user achievements JSON
achievementsRoutes.get('/', async (c) => {
  const userId = c.get('userId')
  const row = await c.env.DB.prepare(
    'SELECT achievements_json FROM user_achievements WHERE user_id = ?'
  ).bind(userId).first<{ achievements_json: string }>()

  if (!row) {
    return c.json({ achievements: null })
  }
  return c.json({ achievements: JSON.parse(row.achievements_json) })
})

// PUT /achievements — save entire achievements object
achievementsRoutes.put('/', async (c) => {
  const userId = c.get('userId')
  const body = await c.req.json()
  const achievementsJson = JSON.stringify(body.achievements ?? body)
  const now = new Date().toISOString()

  await c.env.DB.prepare(
    `INSERT INTO user_achievements (user_id, achievements_json, updated_at)
     VALUES (?, ?, ?)
     ON CONFLICT(user_id) DO UPDATE SET achievements_json = excluded.achievements_json, updated_at = excluded.updated_at`
  ).bind(userId, achievementsJson, now).run()

  return c.json({ ok: true })
})
