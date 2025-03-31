import db from '../../db/db.client'
import { sessions } from '../../db/schema/sessions'
import { eq } from 'drizzle-orm'

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
  async updateAllSessions(userId:string)// cambiar
  {
    return this.dbClient.update(sessions).set({isEnabled:false}).where(eq(sessions.userId,userId));
  }
  async createSession(newSession:typeof sessions.$inferInsert)// cambiar
  {
    return this.dbClient.insert(sessions).values(newSession).returning({id:sessions.id});
  }
  async updateSessionById(id:string)// cambiar
  {
    const sesion=await this.dbClient.query.sessions.findFirst({where:eq(sessions.id,id)});
    if(!sesion?.isEnabled)
    {
      return "Sesion no valida";
    }
    return this.dbClient.update(sessions).set({isEnabled:false}).where(eq(sessions.id,id));
  }
}
