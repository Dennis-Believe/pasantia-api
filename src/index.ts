import { Hono } from 'hono'

export type Env = {
  Bindings: {
    DATABASE_URL: string
  }
}

const app = new Hono<Env>()

app.get('/', (c) => {
  console.log('DATABASE_URL', c.env.DATABASE_URL)
  return c.text('Hello Hono!')
})

export default app
