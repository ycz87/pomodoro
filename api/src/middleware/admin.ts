/**
 * Admin middleware — verify JWT + check admin role in D1.
 */
import type { Context, Next } from 'hono'
import type { Env } from '../index'
import { extractBearerToken, verifyAccessToken } from './auth'

export async function adminMiddleware(
  c: Context<{ Bindings: Env; Variables: { userId: string; email: string } }>,
  next: Next
) {
  const token = extractBearerToken(c.req.header('Authorization'))
  if (!token) {
    return c.json({ error: 'Unauthorized' }, 401)
  }
  const payload = await verifyAccessToken(c.env.JWT_SECRET, token)
  if (!payload) {
    return c.json({ error: 'Invalid or expired token' }, 401)
  }

  // Check admin role in D1
  const row = await c.env.DB.prepare(
    'SELECT role FROM users WHERE id = ? AND status = ?'
  ).bind(payload.userId, 'active').first<{ role: string }>()

  if (!row || row.role !== 'admin') {
    return c.json({ error: 'Forbidden: admin access required' }, 403)
  }

  c.set('userId', payload.userId)
  c.set('email', payload.email)
  await next()
}
