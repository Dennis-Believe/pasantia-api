import { pgTable, uuid, text, timestamp, boolean, time, integer } from 'drizzle-orm/pg-core'
import { users } from './users'

export const posts = pgTable('sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('userId').references(() => users.id).notNull(),
  token: text('token').notNull(),
  isEnabled: boolean('isEnabled').default(true).notNull(),
  lifeTime: integer('lifeTime').notNull(),
  timeOut: time('timeOut').notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
})