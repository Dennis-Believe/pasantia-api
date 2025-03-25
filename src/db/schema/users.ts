import { pgTable, uuid, varchar, timestamp, date } from 'drizzle-orm/pg-core'


export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  firstName: varchar('firstName', { length: 255 }).notNull(),
  lastName: varchar('lastName', { length: 255 }),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  birthDate: date('birthDate').notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
})

