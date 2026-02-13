/**
 * Email service — send verification codes via Resend API
 */

export async function sendVerificationEmail(
  apiKey: string,
  to: string,
  code: string,
): Promise<boolean> {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Watermelon Clock <noreply@watermelon-clock.com>',
      to: [to],
      subject: `Your verification code: ${code}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 400px; margin: 0 auto; padding: 32px;">
          <h2 style="color: #22c55e; margin-bottom: 8px;">🍉 Watermelon Clock</h2>
          <p style="color: #666; font-size: 14px;">Your verification code is:</p>
          <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #111; padding: 16px 0;">${code}</div>
          <p style="color: #999; font-size: 12px;">This code expires in 5 minutes. If you didn't request this, please ignore.</p>
        </div>
      `,
    }),
  })
  return res.ok
}

export function generateCode(): string {
  const buf = new Uint8Array(4)
  crypto.getRandomValues(buf)
  const num = ((buf[0] << 24) | (buf[1] << 16) | (buf[2] << 8) | buf[3]) >>> 0
  return String(num % 1000000).padStart(6, '0')
}
