import { Hono } from 'hono'
// Make sure to install the 'postgres' package
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './db/schema'

export type Env = {
  Bindings: {
    DATABASE_URL: string
  }
}

const app = new Hono<Env>()

app.get('/', async (c) => {
  try {
    const queryClient = postgres(c.env.DATABASE_URL)
    const db = drizzle({ client: queryClient, schema })

    const result = await db.query.users.findMany()
    console.log('DATABASE_URL', result)
    return c.text('Hello Hono!: ' + c.env.DATABASE_URL)
    
  } catch (error) {
    return c.json({ error: 'Hubo un error' })
  }
})

export default app
