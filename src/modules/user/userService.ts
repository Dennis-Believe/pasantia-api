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
      .returning({ id: users.id })
  }

  async findUserById(userId: string) {
    return this.dbClient.query.users.findFirst({
      where: eq(users.id, userId),
    })
  }
  async updateUserState(userId: string, state: boolean) {
    return this.dbClient.update(users).set({ state }).where(eq(users.id, userId));
  }
  async updateUserProfile(firstName: string, lastName:string, password:string, birthDate: string, userId: string){
    return this.dbClient.update(users).set({firstName, lastName, password, birthDate}).where(eq(users.id, userId))
  }
}