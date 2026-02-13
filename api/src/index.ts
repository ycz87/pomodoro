import { Hono } from 'hono'
import { healthRoutes } from './routes/health'
import { settingsRoutes } from './routes/settings'
import { recordsRoutes } from './routes/records'
import { warehouseRoutes } from './routes/warehouse'
import { adminRoutes } from './routes/admin'

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

  await next()

  if (isAllowed) {
    c.res.headers.set('Access-Control-Allow-Origin', origin)
    c.res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    c.res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    c.res.headers.set('Access-Control-Allow-Credentials', 'true')
    c.res.headers.set('Access-Control-Max-Age', '86400')
  }
})

// Preflight
app.options('*', (c) => c.body(null, 204))

// Routes
app.route('/health', healthRoutes)
app.route('/settings', settingsRoutes)
app.route('/records', recordsRoutes)
app.route('/warehouse', warehouseRoutes)
app.route('/admin', adminRoutes)

// 404
app.notFound((c) => c.json({ error: 'Not Found' }, 404))

// Error handler
app.onError((err, c) => {
  console.error('Unhandled error:', err)
  return c.json({ error: 'Internal Server Error' }, 500)
})

export default app
