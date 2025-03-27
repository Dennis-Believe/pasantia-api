import 'module-alias/register'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { prettyJSON } from 'hono/pretty-json'
import { logger } from 'hono/logger'
import { serve } from '@hono/node-server'
import { env } from './config/env'
import db from './db/db.client'
import { userRoutes } from './modules/user/userRoutes'
import { otbRoutes } from './modules/otb/otbRoutes'
import { authRoutes } from './modules/auth/authRoutes'
const app = new Hono()

app.use('*', cors())
app.use('*', prettyJSON())
app.use('*', logger())

app.get('/', async (c) => {
  const result = await db.query.users.findMany({
    limit: 1,
  })
  console.log(result)
  return c.json({ message: 'Hello World' })
})
app.route('/api/user', userRoutes)
app.route('/api/otb', otbRoutes)
app.route('/api/auth', authRoutes)
const port = env.port
console.log(`Servidor iniciado en http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port: Number(port),
})

export default app
