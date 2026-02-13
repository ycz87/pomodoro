/**
 * Auth middleware — verify JWT, inject userId into context
 */
import type { Context, Next } from 'hono'
import type { Env } from '../index'
import { verifyAccessToken } from '../services/jwt'

export async function authMiddleware(c: Context<{ Bindings: Env; Variables: { userId: string; email: string } }>, next: Next) {
  const authHeader = c.req.header('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401)
  }
  const token = authHeader.slice(7)
  const payload = await verifyAccessToken(c.env.JWT_SECRET, token)
  if (!payload) {
    return c.json({ error: 'Invalid or expired token' }, 401)
  }
  c.set('userId', payload.userId)
  c.set('email', payload.email)
  await next()
}
