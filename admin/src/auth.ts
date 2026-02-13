const AUTH_BASE = import.meta.env.DEV ? 'http://localhost:8788' : 'https://auth.cosmelon.app'

export interface AuthState {
  token: string | null
  email: string | null
}

export function getStoredAuth(): AuthState {
  return {
    token: localStorage.getItem('admin_token'),
    email: localStorage.getItem('admin_email'),
  }
}

export function setStoredAuth(token: string, email: string) {
  localStorage.setItem('admin_token', token)
  localStorage.setItem('admin_email', email)
}

export function clearStoredAuth() {
  localStorage.removeItem('admin_token')
  localStorage.removeItem('admin_email')
}

export async function sendCode(email: string, turnstileToken: string): Promise<{ ok: boolean; error?: string }> {
  const res = await fetch(`${AUTH_BASE}/auth/email/send-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, turnstileToken }),
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({})) as Record<string, unknown>
    return { ok: false, error: (data.error as string) || 'Failed to send code' }
  }
  return { ok: true }
}

export async function verifyCode(email: string, code: string): Promise<{ ok: boolean; token?: string; error?: string }> {
  const res = await fetch(`${AUTH_BASE}/auth/email/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code }),
  })
  const data = await res.json() as Record<string, unknown>
  if (!res.ok) {
    return { ok: false, error: (data.error as string) || 'Verification failed' }
  }
  const token = data.accessToken as string
  if (token) {
    setStoredAuth(token, email)
    return { ok: true, token }
  }
  return { ok: false, error: 'No token received' }
}
