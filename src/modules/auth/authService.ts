
import { eq } from 'drizzle-orm';
import db from '../../db/db.client';
import { sessions } from '../../db/schema/sessions';
import { UserService } from '../../modules/user/userService';
import { decryptPassword } from './utils/authUtils';

export class AuthService {
  private userService: UserService;
  private dbClient;

  constructor(userService: UserService = new UserService(), dbClient=db) {
    this.userService = userService;
    this.dbClient=dbClient
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

  async createSession(newSession:typeof sessions.$inferInsert)
  {
    return this.dbClient.insert(sessions).values(newSession).returning({id:sessions.id});
  }
  async updateSessionById(id:string)
  {
    const sesion=await this.dbClient.query.sessions.findFirst({where:eq(sessions.id,id)});
    if(!sesion?.isEnabled)
    {
      return "Sesion no valida";
    }
    return this.dbClient.update(sessions).set({isEnabled:false}).where(eq(sessions.id,id));
  }
}
