import { Hono } from 'hono'
import { healthRoutes } from './routes/health'
import { settingsRoutes } from './routes/settings'
import { recordsRoutes } from './routes/records'
import { warehouseRoutes } from './routes/warehouse'
import { adminRoutes } from './routes/admin'
import { achievementsRoutes } from './routes/achievements'

export type Env = {
  DB: D1Database
  JWT_SECRET: string
}

const app = new Hono<{ Bindings: Env }>().basePath('/api')

// CORS middleware
app.use('*', async (c, next) => {
  const origin = c.req.header('Origin') || ''
  const allowed = [
    'https://clock.cosmelon.app',
    'https://watermelon-clock.pages.dev',
    'https://pomodoro-puce-seven-98.vercel.app',
    'https://admin.cosmelon.app',
  ]
  const isLocalhost = /^https?:\/\/localhost(:\d+)?$/.test(origin)
  const isAllowed = allowed.includes(origin) || isLocalhost

  // Handle preflight requests before routing
  if (c.req.method === 'OPTIONS' && isAllowed) {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Max-Age': '86400',
      },
    })
  }

  await next()

  if (isAllowed) {
    c.res.headers.set('Access-Control-Allow-Origin', origin)
    c.res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    c.res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    c.res.headers.set('Access-Control-Allow-Credentials', 'true')
    c.res.headers.set('Access-Control-Max-Age', '86400')
  }
})

// Preflight fallback (non-allowed origins)
app.options('*', (c) => c.body(null, 204))

// Routes
app.route('/health', healthRoutes)
app.route('/settings', settingsRoutes)
app.route('/records', recordsRoutes)
app.route('/warehouse', warehouseRoutes)
app.route('/admin', adminRoutes)
app.route('/achievements', achievementsRoutes)

// 404
app.notFound((c) => c.json({ error: 'Not Found' }, 404))

// Error handler
app.onError((err, c) => {
  console.error('Unhandled error:', err)
  return c.json({ error: 'Internal Server Error' }, 500)
})

export default app
