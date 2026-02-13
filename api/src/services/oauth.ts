/**
 * OAuth service — Google + Microsoft OAuth helpers
 */

export interface OAuthTokens {
  access_token: string
  id_token?: string
}

export interface OAuthUserInfo {
  email: string
  name?: string
  picture?: string
  provider: 'google' | 'microsoft'
}

// ─── Google ───

export function googleAuthUrl(clientId: string, redirectUri: string, state: string): string {
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    state,
    access_type: 'offline',
    prompt: 'consent',
  })
  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`
}

export async function googleExchangeCode(
  clientId: string, clientSecret: string, code: string, redirectUri: string,
): Promise<OAuthTokens> {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  })
  if (!res.ok) throw new Error(`Google token exchange failed: ${res.status}`)
  return res.json()
}

export async function googleUserInfo(accessToken: string): Promise<OAuthUserInfo> {
  const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!res.ok) throw new Error(`Google userinfo failed: ${res.status}`)
  const data: { email: string; name?: string; picture?: string } = await res.json()
  return { email: data.email, name: data.name, picture: data.picture, provider: 'google' }
}

// ─── Microsoft ───

export function microsoftAuthUrl(clientId: string, redirectUri: string, state: string): string {
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile User.Read',
    state,
    response_mode: 'query',
  })
  return `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?${params}`
}

export async function microsoftExchangeCode(
  clientId: string, clientSecret: string, code: string, redirectUri: string,
): Promise<OAuthTokens> {
  const res = await fetch('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  })
  if (!res.ok) throw new Error(`Microsoft token exchange failed: ${res.status}`)
  return res.json()
}

export async function microsoftUserInfo(accessToken: string): Promise<OAuthUserInfo> {
  const res = await fetch('https://graph.microsoft.com/v1.0/me', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!res.ok) throw new Error(`Microsoft userinfo failed: ${res.status}`)
  const data: { mail?: string; userPrincipalName?: string; displayName?: string } = await res.json()
  return {
    email: data.mail || data.userPrincipalName || '',
    name: data.displayName,
    provider: 'microsoft',
  }
}
