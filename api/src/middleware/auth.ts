/**
 * Auth middleware — verify JWT locally, inject userId into context.
 * Self-contained JWT verification using Web Crypto API (no external deps).
 */
import type { Context, Next } from 'hono'
import type { Env } from '../index'

interface JwtPayload {
  userId: string
  email: string
  iat: number
  exp: number
}

function base64urlDecode(s: string): ArrayBuffer {
  const padded = s.replace(/-/g, '+').replace(/_/g, '/') + '=='.slice(0, (4 - (s.length % 4)) % 4)
  const binary = atob(padded)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes.buffer as ArrayBuffer
}

async function getKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder()
  return crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify'])
}

async function verifyAccessToken(secret: string, token: string): Promise<JwtPayload | null> {
  const parts = token.split('.')
  if (parts.length !== 3) return null
  const key = await getKey(secret)
  const data = `${parts[0]}.${parts[1]}`
  const sig = base64urlDecode(parts[2])
  const valid = await crypto.subtle.verify('HMAC', key, sig, new TextEncoder().encode(data))
  if (!valid) return null
  const decoded = new TextDecoder().decode(base64urlDecode(parts[1]))
  const payload: JwtPayload = JSON.parse(decoded)
  if (payload.exp < Math.floor(Date.now() / 1000)) return null
  return payload
}

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
