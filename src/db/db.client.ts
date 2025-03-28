import { drizzle } from 'drizzle-orm/node-postgres'
import { users } from './schema/users'
import { posts } from './schema/posts'
import { otb } from './schema/otb'
import { env } from '../config/env'
import { sessions } from './schema/sessions'

const db = drizzle(env.databaseUrl, {
  schema: {
    users,
    posts,
    otb,
    sessions,
  },
})

export default db
