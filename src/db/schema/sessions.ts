import { pgTable, uuid, text, timestamp, boolean, time } from 'drizzle-orm/pg-core'
import { users } from './users'

export const posts = pgTable('sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('userId').references(() => users.id).notNull(),
  token: text('token').notNull(),
  isEnabled: text('isEnabled'),
  lifeTime: boolean('lifeTime').default(false).notNull(),
  timeOut: time('timeOut').notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
})