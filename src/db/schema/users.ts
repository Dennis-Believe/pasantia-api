import { pgTable, uuid, varchar, timestamp, date, boolean } from 'drizzle-orm/pg-core'


export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  firstName: varchar('firstName', { length: 80 }).notNull(),
  lastName: varchar('lastName', { length: 100 }),
  email: varchar('email', { length: 80 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  birthDate: date('birthDate').notNull(),
  state: boolean().default(false).notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
})