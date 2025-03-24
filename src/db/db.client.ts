import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'
import { env } from '../config/env'

const connectionString = env.databaseUrl
const queryClient = postgres(connectionString, {
  connect_timeout: 10,
  idle_timeout: 20,
})

export const db = drizzle(queryClient, { schema })
