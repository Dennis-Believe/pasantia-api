import { integer, pgTable, varchar, date } from 'drizzle-orm/pg-core'
export const posts = pgTable('users', {
    id: integer(),
    postName: varchar('post_name')
  })