import { date } from "drizzle-orm/mysql-core";
import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const users = pgTable('users', {
    id: integer(),
    firstName: varchar('first_name')
  })
/*export const users = pgTable('users', {
  id: integer().primaryKey(),
  firstName: varchar('fist_name'),
  lastName:varchar('last_name'),
  email:varchar('email'),
  password:varchar('password'),
  createdAt:date(),
  updatedAt:date()
})*/