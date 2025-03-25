import { env } from '@/config/env'
import { drizzle } from 'drizzle-orm/node-postgres'
import { users } from './schema/users'

const db = drizzle(env.databaseUrl, {
  schema: {
    users,
  },
})

export default db
