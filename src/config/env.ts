import { z } from 'zod'
import * as dotenv from 'dotenv'

dotenv.config()

const envSchema = z.object({
  key: z.string(),
  port: z.number().default(3000),
  databaseUrl: z.string(),
  gmail_user: z.string(),
  gmail_pass: z.string()
})

const { DATABASE_URL, PORT, KEY,GMAIL_USER,GMAIL_PASS } = process.env

export const env = envSchema.parse({
  port: Number(PORT),
  databaseUrl: DATABASE_URL,
  key: KEY,
  gmail_user: GMAIL_USER,
  gmail_pass: GMAIL_PASS
})
