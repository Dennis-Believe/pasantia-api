import db from '../../db/db.client'
import { otb } from '../../db/schema/otb'

export class AuthService {
  constructor() {}
  async createOTB(userId: string, token: number) {
    return db.insert(otb).values({
      userId,
      token,
    })
  }
}
