import { Context } from 'hono';
import { loginSchema } from './dto/auth.dto';
import { AuthService } from './authService';
import { generateJWT, generateUniqueId } from './utils/authUtils';
import { SessionService } from '../sessions/sessionService';

export class AuthController {
  private authService: AuthService;
  private sessionService: SessionService;

  constructor(authService: AuthService, sessionService: SessionService) {
    this.authService = authService;
    this.sessionService = sessionService;
  }

  login = async (c: Context) => {
    try {
      const body = await c.req.json();
      const parsed = loginSchema.safeParse(body);
      
     
      if (!parsed.success) {
        return c.json({ errors: parsed.error.formErrors.fieldErrors }, 400);
      }
      const { email, password } = parsed.data;
      

      const { user } = await this.authService.validateCredentials(email, password);
      console.log(user)
      
      const idSession=generateUniqueId();

      const token = await generateJWT(user.id,idSession);
      const expirationDate = new Date(Date.now() + 24 * 60 * 60 * 1000);

      const year = expirationDate.getFullYear();
      const month = String(expirationDate.getMonth() + 1).padStart(2, '0');
      const day = String(expirationDate.getDate()).padStart(2, '0');

      const formattedDate = `${year}-${month}-${day}`; 

      const sesion=await this.sessionService.createSession({
        id:idSession,
        userId:user.id,
        token: token,
        isEnabled:true,
        lifeTime:3600,
        timeOut: formattedDate,
      })

      return c.json({ message: 'Login successful', token: `Bearer ${token}` });
    } catch (error: any) {
      return c.json({ error: error.message || 'Invalid request data' }, 400);
    }
  };

  logout = async (c: Context) => {
    try {
      const decoded= c.get('user')
      if(!decoded)
      {
         throw new Error("no se encontro el token")
      }
      const s=await this.sessionService.updateSessionById(decoded.sessionId);
      if(s==="Sesion no valida")
      {
        throw new Error(s);
      }
      return c.json({ message: 'Logout successful' });
    } catch (error) {
      return c.json({ error: 'Invalid token or error during logout' }, 400);
    }
  };

  profile = async (c: Context) => {
    try {
      const decoded = c.get('user')
      const profile = await this.authService.getUserProfile(decoded.id);
      return c.json({ profile });
    } catch (error: any) {
      return c.json({ error: 'Invalid token or error retrieving profile' }, 400);
    }
  };
}
