
import { UserService } from '../../modules/user/userService';
import { decryptPassword } from './utils/authUtils';

export class AuthService {
  private userService: UserService;

  constructor(userService: UserService = new UserService()) {
    this.userService = userService;
  }

  

  async validateCredentials(email: string, password: string) {
    const user = await this.userService.findUserByEmail(email); 
    if (!user ) {
      throw new Error('Invalid credentials ');
    }
    if( !user.state)
    {
      throw new Error('User Disabled');
    }
    
    const decryptedPassword = await decryptPassword(user.password);
    if (password !== decryptedPassword) {
      throw new Error('Invalid credentials');
    }

    return { user };
  }


  async getUserProfile(userId: string) {
    const user = await this.userService.findUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    const { password, createdAt, updatedAt, ...profile } = user;
    return profile;
  }
}
