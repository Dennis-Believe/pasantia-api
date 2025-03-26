import { z } from 'zod'
import * as dotenv from 'dotenv'

dotenv.config()

const envSchema = z.object({
  port: z.number().default(3000),
  databaseUrl: z.string(),
})

const { DATABASE_URL, PORT } = process.env

export const env = envSchema.parse({
  port: Number(PORT),
  databaseUrl: DATABASE_URL,
})
