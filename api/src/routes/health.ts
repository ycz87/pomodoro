import { Hono } from 'hono'
import type { Env } from '../index'

export const healthRoutes = new Hono<{ Bindings: Env }>()

healthRoutes.get('/', async (c) => {
  let dbStatus = 'unknown'
  try {
    const result = await c.env.DB.prepare('SELECT 1 AS ok').first()
    dbStatus = result?.ok === 1 ? 'connected' : 'error'
  } catch {
    dbStatus = 'error'
  }

  return c.json({
    status: 'ok',
    version: '0.10.0',
    timestamp: new Date().toISOString(),
    db: dbStatus,
  })
})
