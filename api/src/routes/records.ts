import { Hono } from 'hono'
import type { Env } from '../index'
import { authMiddleware } from '../middleware/auth'

type AuthEnv = { Bindings: Env; Variables: { userId: string; email: string } }

export const recordsRoutes = new Hono<AuthEnv>()

recordsRoutes.use('*', authMiddleware)

// GET /records — query focus records with optional date range and pagination
recordsRoutes.get('/', async (c) => {
  const userId = c.get('userId')
  const from = c.req.query('from')
  const to = c.req.query('to')
  const limit = Math.min(parseInt(c.req.query('limit') || '100', 10), 500)
  const offset = parseInt(c.req.query('offset') || '0', 10)

  let sql = 'SELECT id, task_name, duration_minutes, status, started_at, ended_at, created_at FROM focus_records WHERE user_id = ?'
  const params: (string | number)[] = [userId]

  if (from) {
    sql += ' AND ended_at >= ?'
    params.push(`${from}T00:00:00.000Z`)
  }
  if (to) {
    sql += ' AND ended_at <= ?'
    params.push(`${to}T23:59:59.999Z`)
  }

  sql += ' ORDER BY ended_at DESC LIMIT ? OFFSET ?'
  params.push(limit, offset)

  const { results } = await c.env.DB.prepare(sql).bind(...params).all()

  // Map D1 fields back to frontend format
  const records = (results || []).map((r: Record<string, unknown>) => ({
    id: r.id as string,
    task: r.task_name as string,
    durationMinutes: r.duration_minutes as number,
    completedAt: r.ended_at as string,
    date: (r.ended_at as string).slice(0, 10),
    status: r.status as string || 'completed',
  }))

  return c.json({ records })
})

// POST /records — create a single focus record
recordsRoutes.post('/', async (c) => {
  const userId = c.get('userId')
  const body = await c.req.json()
  const { id, task, durationMinutes, completedAt, status } = body

  // Input validation
  if (!id || typeof id !== 'string') return c.json({ error: 'Invalid id' }, 400)
  if (!task || typeof task !== 'string' || task.length > 200) return c.json({ error: 'Invalid task' }, 400)
  if (typeof durationMinutes !== 'number' || durationMinutes < 0 || durationMinutes > 1440) return c.json({ error: 'Invalid durationMinutes' }, 400)
  if (!completedAt || isNaN(Date.parse(completedAt))) return c.json({ error: 'Invalid completedAt' }, 400)
  if (status && status !== 'completed' && status !== 'abandoned') return c.json({ error: 'Invalid status' }, 400)

  const endedAt = completedAt
  const startedAt = new Date(new Date(endedAt).getTime() - durationMinutes * 60 * 1000).toISOString()
  const now = new Date().toISOString()

  await c.env.DB.prepare(
    `INSERT INTO focus_records (id, user_id, task_name, duration_minutes, status, started_at, ended_at, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO NOTHING`
  ).bind(id, userId, task, durationMinutes, status || 'completed', startedAt, endedAt, now).run()

  return c.json({ ok: true })
})

// POST /records/batch — batch insert records (for local data migration)
recordsRoutes.post('/batch', async (c) => {
  const userId = c.get('userId')
  const body = await c.req.json()
  const records: Array<{ id: string; task: string; durationMinutes: number; completedAt: string; status?: string }> = body.records || []

  if (records.length === 0) {
    return c.json({ ok: true, inserted: 0 })
  }

  // D1 batch: max 100 statements per batch
  const batchSize = 100
  let inserted = 0

  for (let i = 0; i < records.length; i += batchSize) {
    const chunk = records.slice(i, i + batchSize)
    const stmts = chunk.map((r) => {
      const endedAt = r.completedAt
      const startedAt = new Date(new Date(endedAt).getTime() - r.durationMinutes * 60 * 1000).toISOString()
      const now = new Date().toISOString()
      return c.env.DB.prepare(
        `INSERT INTO focus_records (id, user_id, task_name, duration_minutes, status, started_at, ended_at, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(id) DO NOTHING`
      ).bind(r.id, userId, r.task, r.durationMinutes, r.status || 'completed', startedAt, endedAt, now)
    })
    await c.env.DB.batch(stmts)
    inserted += chunk.length
  }

  return c.json({ ok: true, inserted })
})
