import { pgTable, uuid, integer } from 'drizzle-orm/pg-core'
import { users } from './users'

export const otb = pgTable('otb', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('userId')
    .references(() => users.id)
    .notNull(),
  token: integer('token'),
})
