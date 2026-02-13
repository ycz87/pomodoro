/**
 * Verify Cloudflare Turnstile token
 */
export async function verifyTurnstile(secret: string, token: string, ip?: string): Promise<boolean> {
  const formData = new URLSearchParams()
  formData.append('secret', secret)
  formData.append('response', token)
  if (ip) formData.append('remoteip', ip)

  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: formData,
  })
  if (!res.ok) return false
  const data = await res.json() as { success: boolean }
  return data.success
}
