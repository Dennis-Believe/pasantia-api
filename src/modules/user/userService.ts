import { eq } from 'drizzle-orm'
import db from '../../db/db.client'
import { users } from '../../db/schema/users'
import { otb } from '../../db/schema/otb'

export class UserService {
  private dbClient

  constructor(dbClient = db) {
    this.dbClient = dbClient
  }

  async findUserByEmail(email: string) {
    return this.dbClient.query.users.findFirst({
      where: eq(users.email, email),
    })
  }

  async createUser(newUser: typeof users.$inferInsert) {
    return this.dbClient
      .insert(users)
      .values(newUser)
      .returning({ id: users.id , firstName: users.firstName})
  }

  async findUserById(userId: string) {
    return this.dbClient.query.users.findFirst({
      where: eq(users.id, userId),
    })
  }
}
