// import { date } from "drizzle-orm/mysql-core";
import { integer, pgTable, varchar, date } from 'drizzle-orm/pg-core'
import {v4 as uuidv4} from 'uuid'
export const users = pgTable('users', {
  id: integer('id').$default(()=>+uuidv4()), // Define el nombre de la columna explícitamente
  firstName: varchar('first_name').notNull(), // Agrega notNull() si es obligatorio
  lastName: varchar('last_name').notNull(),
  email: varchar('email').notNull(),
  password: varchar('password').notNull(),
  createdAt: date('created_at').defaultNow(), // Usa defaultNow() para fechas automáticas
  updatedAt: date('updated_at').defaultNow(),
})
