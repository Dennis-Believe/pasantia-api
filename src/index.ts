import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { prettyJSON } from 'hono/pretty-json'
import { logger } from 'hono/logger'
import { serve } from '@hono/node-server'
import { env } from './config/env'
import db from './db/db.client'
import apiRoutes from './routes'
const app = new Hono()

app.use('*', cors())
app.use('*', prettyJSON())
app.use('*', logger())
app.route('/api', apiRoutes);
app.get('/', async (c) => {
  const result = await db.query.users.findMany({
    limit: 1,
  })
  console.log(result)
  return c.json({ message: 'Hello World' })
})

const port = env.port
console.log(`Servidor iniciado en http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port: Number(port),
})

export default app
