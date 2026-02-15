import { Hono } from 'hono'
import type { Env } from '../index'
import { authMiddleware } from '../middleware/auth'

type AuthEnv = { Bindings: Env; Variables: { userId: string; email: string } }

export const settingsRoutes = new Hono<AuthEnv>()

settingsRoutes.use('*', authMiddleware)

// GET /settings — return user settings JSON
settingsRoutes.get('/', async (c) => {
  const userId = c.get('userId')
  const row = await c.env.DB.prepare(
    'SELECT settings_json FROM user_settings WHERE user_id = ?'
  ).bind(userId).first<{ settings_json: string }>()

  if (!row) {
    return c.json({ settings: null })
  }
  return c.json({ settings: JSON.parse(row.settings_json) })
})

// PUT /settings — save entire settings object
settingsRoutes.put('/', async (c) => {
  const userId = c.get('userId')
  const body = await c.req.json()
  const settingsJson = JSON.stringify(body.settings ?? body)

  // Prevent excessively large settings payloads
  if (settingsJson.length > 10_000) {
    return c.json({ error: 'Settings payload too large' }, 400)
  }

  const now = new Date().toISOString()

  await c.env.DB.prepare(
    `INSERT INTO user_settings (user_id, settings_json, updated_at)
     VALUES (?, ?, ?)
     ON CONFLICT(user_id) DO UPDATE SET settings_json = excluded.settings_json, updated_at = excluded.updated_at`
  ).bind(userId, settingsJson, now).run()

  return c.json({ ok: true })
})
