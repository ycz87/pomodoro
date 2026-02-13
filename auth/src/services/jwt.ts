/**
 * JWT service — Web Crypto API HMAC-SHA256, no external deps
 */

interface JwtPayload {
  userId: string
  email: string
  iat: number
  exp: number
}

function base64url(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf)
  let s = ''
  for (const b of bytes) s += String.fromCharCode(b)
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
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

export async function signAccessToken(secret: string, userId: string, email: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  const payload: JwtPayload = { userId, email, iat: now, exp: now + 15 * 60 }
  const header = base64url(new TextEncoder().encode(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).buffer as ArrayBuffer)
  const body = base64url(new TextEncoder().encode(JSON.stringify(payload)).buffer as ArrayBuffer)
  const data = `${header}.${body}`
  const key = await getKey(secret)
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data))
  return `${data}.${base64url(sig)}`
}

export async function verifyAccessToken(secret: string, token: string): Promise<JwtPayload | null> {
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

export function generateRefreshTokenId(): string {
  const buf = new Uint8Array(32)
  crypto.getRandomValues(buf)
  return Array.from(buf, (b) => b.toString(16).padStart(2, '0')).join('')
}
