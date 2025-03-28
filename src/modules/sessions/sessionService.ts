import db from '../../db/db.client'
import { sessions } from '../../db/schema/sessions'
import { and, eq } from 'drizzle-orm'

export class SessionService {
  private dbClient
  constructor(dbClient = db) {
    this.dbClient = dbClient
  }
  async isEnabled(sessionId: string) {
    return this.dbClient
      .select({ isEnabled: sessions.isEnabled })
      .from(sessions)
      .where(eq(sessions.id, sessionId))
      .limit(1)
  }
}
