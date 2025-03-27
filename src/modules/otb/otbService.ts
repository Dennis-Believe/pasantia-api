import { eq } from 'drizzle-orm';
import crypto from 'crypto';
import { env } from '../../config/env';
import { transporter } from '../auth/utils/authUtils';
import db from '../../db/db.client';
import { users } from '../../db/schema/users';
import { otb } from '../../db/schema/otb';

export class OTBService {
  private dbClient;

  constructor(dbClient = db) {
    this.dbClient = dbClient;
  }
  
  async createOTB(userId: string, token: number) {
    return await this.dbClient.insert(otb).values({
      userId,
      token,
  })
  }
  async findOtbByUserId(userId: string) {
    return await db.query.otb.findFirst({
      where: eq(otb.userId, userId),
    });
  }

  async deleteOtbById(otbId: string) {
    return await db.delete(otb).where(eq(otb.id,otbId));
  }
  async getOTBByEmail(email: string,token: number) {

    const user = await this.dbClient.query.users.findFirst({
      where: eq(users.email, email),
    });
    if (!user) {
      throw new Error('User not found');
    }
    const getOTB= await this.dbClient.query.otb.findFirst({where: eq(otb.userId,user.id)});
    if(!getOTB)
    {
      throw new Error('OTB not found');
    }
    if(getOTB.token==token)
    {
      await this.dbClient.update(users).set({ state:true }).where(eq(users.id, user.id));
      await this.dbClient.delete(otb).where(eq(otb.id,getOTB.id));
      return {message:"Account Authorized"}
    }
    } catch (error: any) {
      throw new Error(error.message);
    }
}



