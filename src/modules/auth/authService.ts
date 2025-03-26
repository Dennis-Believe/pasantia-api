import { eq } from 'drizzle-orm';
import db from '@/db/db.client';
import { otb } from '@/db/schema/otb';
import { UserService } from '@/modules/user/userService';
import { decryptPassword } from './utils/authUtils';

export class AuthService {
  private userService: UserService;

  constructor(userService: UserService = new UserService()) {
    this.userService = userService;
  }

  async findOtbByUserId(userId: string) {
    return await db.query.otb.findFirst({
      where: eq(otb.userId, userId),
    });
  }

  async deleteOtbById(otbId: string) {
    return await db.delete(otb).where(eq(otb.id,otbId));
  }

  async validateCredentials(email: string, password: string, tokenOtb: number) {
    const user = await this.userService.findUserByEmail(email);
    if (!user || user.state) {
      throw new Error('Invalid credentials');
    }

    const otbRecord = await this.findOtbByUserId(user.id);
    if (!otbRecord || tokenOtb !== otbRecord.token) {
      throw new Error('Error with OTB');
    }

    const decryptedPassword = await decryptPassword(user.password);
    if (password !== decryptedPassword) {
      throw new Error('Invalid credentials');
    }

    return { user, otbRecord };
  }


  async getUserProfile(userId: string) {
    const user = await this.userService.findUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    const { password, createdAt, updatedAt, ...profile } = user;
    return profile;
  }

  async updateUserState(userId: string, state: boolean) {
    return await this.userService.updateUserState(userId, state);
  }
}
