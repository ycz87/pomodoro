import { Hono } from 'hono'
import type { Env } from '../index'
import { adminMiddleware } from '../middleware/admin'

type AdminEnv = { Bindings: Env; Variables: { userId: string; email: string } }

export const adminRoutes = new Hono<AdminEnv>()

adminRoutes.use('*', adminMiddleware)

// GET /admin/users — paginated user list with optional search
adminRoutes.get('/users', async (c) => {
  const page = Math.max(1, parseInt(c.req.query('page') || '1', 10))
  const pageSize = Math.min(100, Math.max(1, parseInt(c.req.query('pageSize') || '20', 10)))
  const search = c.req.query('search')?.trim() || ''
  const offset = (page - 1) * pageSize

  let countSql = 'SELECT COUNT(*) AS total FROM users'
  let listSql = 'SELECT id, email, display_name, avatar_url, auth_provider, role, status, created_at, last_active_at FROM users'
  const params: (string | number)[] = []

  if (search) {
    const where = ' WHERE email LIKE ? OR display_name LIKE ?'
    const pattern = `%${search}%`
    countSql += where
    listSql += where
    params.push(pattern, pattern)
  }

  listSql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?'

  const countParams = [...params]
  params.push(pageSize, offset)

  const [countResult, listResult] = await Promise.all([
    countParams.length > 0
      ? c.env.DB.prepare(countSql).bind(...countParams).first<{ total: number }>()
      : c.env.DB.prepare(countSql).first<{ total: number }>(),
    c.env.DB.prepare(listSql).bind(...params).all(),
  ])

  const total = countResult?.total ?? 0
  const users = (listResult.results || []).map((r: Record<string, unknown>) => ({
    id: r.id,
    email: r.email,
    displayName: r.display_name,
    avatarUrl: r.avatar_url,
    authProvider: r.auth_provider,
    role: r.role ?? 'user',
    status: r.status ?? 'active',
    createdAt: r.created_at,
    lastActiveAt: r.last_active_at,
  }))

  return c.json({ users, total, page, pageSize })
})

// GET /admin/users/:id — user detail + focus stats
adminRoutes.get('/users/:id', async (c) => {
  const id = c.req.param('id')

  const [user, stats, recentStats] = await Promise.all([
    c.env.DB.prepare(
      'SELECT id, email, display_name, avatar_url, auth_provider, role, status, created_at, updated_at, last_active_at FROM users WHERE id = ?'
    ).bind(id).first(),
    c.env.DB.prepare(
      'SELECT COALESCE(SUM(duration_minutes), 0) AS total_minutes, COUNT(*) AS total_count FROM focus_records WHERE user_id = ?'
    ).bind(id).first<{ total_minutes: number; total_count: number }>(),
    c.env.DB.prepare(
      "SELECT COALESCE(SUM(duration_minutes), 0) AS recent_minutes, COUNT(*) AS recent_count FROM focus_records WHERE user_id = ? AND started_at >= datetime('now', '-7 days')"
    ).bind(id).first<{ recent_minutes: number; recent_count: number }>(),
  ])

  if (!user) {
    return c.json({ error: 'User not found' }, 404)
  }

  return c.json({
    user: {
      id: user.id,
      email: user.email,
      displayName: user.display_name,
      avatarUrl: user.avatar_url,
      authProvider: user.auth_provider,
      role: (user.role as string) ?? 'user',
      status: (user.status as string) ?? 'active',
      createdAt: user.created_at,
      updatedAt: user.updated_at,
      lastActiveAt: user.last_active_at,
    },
    stats: {
      totalMinutes: stats?.total_minutes ?? 0,
      totalCount: stats?.total_count ?? 0,
      recentMinutes: recentStats?.recent_minutes ?? 0,
      recentCount: recentStats?.recent_count ?? 0,
    },
  })
})

// PUT /admin/users/:id/status — enable/disable user
adminRoutes.put('/users/:id/status', async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json<{ status: string }>()

  if (body.status !== 'active' && body.status !== 'disabled') {
    return c.json({ error: 'Invalid status. Must be "active" or "disabled".' }, 400)
  }

  const result = await c.env.DB.prepare(
    "UPDATE users SET status = ?, updated_at = datetime('now') WHERE id = ?"
  ).bind(body.status, id).run()

  if (!result.meta.changes) {
    return c.json({ error: 'User not found' }, 404)
  }

  return c.json({ ok: true, status: body.status })
})
