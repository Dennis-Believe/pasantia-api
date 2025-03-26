import db from '../db/db.client';
import { users, otb } from '../db/schema';
import { eq } from 'drizzle-orm';

export class UserService {
  static async findUserByEmail(email: string) {
    return db.query.users.findFirst({
      where: eq(users.email, email),
    });
  }

  static async createUser(newUser: typeof users.$inferInsert) {
    return db.insert(users).values(newUser).returning({ id: users.id });
  }

  static async createOTB(userId: string, token: number) {
    return db.insert(otb).values({
      userId,
      token,
    });
  }

  static async findUserById(userId: string) {
    return db.query.users.findFirst({
      where: eq(users.id, userId),
    });
  }
}