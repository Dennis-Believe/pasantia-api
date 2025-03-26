import { eq } from 'drizzle-orm';
import db from '@/db/db.client';
import { otb } from '@/db/schema/otb';
import { users } from '@/db/schema/users';
import crypto from 'crypto';
import { env } from '../../config/env';
import { transporter } from '../auth/utils/authUtils';

export class OTBService {
  private dbClient;

  constructor(dbClient = db) {
    this.dbClient = dbClient;
  }

  async getOTBByEmail(email: string) {

    const user = await this.dbClient.query.users.findFirst({
      where: eq(users.email, email),
    });
    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    const existingOTB = await this.dbClient.query.otb.findFirst({
      where: eq(otb.userId, user.id),
    });
    if (existingOTB) {
      return { message: 'OTB exist' };
    }

    const token = crypto.randomInt(1000, 1000000);
    console.log(token);

    const [insertedOTB] = await this.dbClient
      .insert(otb)
      .values({ userId: user.id, token })
      .returning();

    try {
      await transporter.sendMail({
        from: env.gmail_user,
        to: user.email,
        subject: 'CODIGO DE AUTENTICACION',
        text: token.toString(),
      });
      return { message: 'OTB Send successful' };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
