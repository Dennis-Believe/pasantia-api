import { Context } from 'hono';
import { setCookie, deleteCookie, getCookie } from 'hono/cookie';
import { loginSchema } from './dto/auth.dto';
import { AuthService } from './authService';
import { generateJWT, getUserIdByAuthorization, verifyJwtToken } from './utils/authUtils';

export class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
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
      
     

      const token = await generateJWT(user.id);

      setCookie(c, 'token', token, { httpOnly: true, secure: true, sameSite: "Strict" });


      return c.json({ message: 'Login successful', token: `Bearer ${token}` });
    } catch (error: any) {
      return c.json({ error: error.message || 'Invalid request data' }, 400);
    }
  };

  logout = async (c: Context) => {
    try {
      const authHeader = c.req.header('Authorization');
      if (!authHeader) {
        return c.json({ error: 'Not logged in' }, 401);
      }
      const token = authHeader.replace('Bearer ', '');
  
      const decoded = await verifyJwtToken(token);
      if (!decoded) {
        return c.json({ error: 'Invalid token' }, 400);
      }
  
      return c.json({ message: 'Logout successful' });
    } catch (error) {
      return c.json({ error: 'Invalid token or error during logout' }, 400);
    }
  
  };

  profile = async (c: Context) => {
    try {
      const userId = await getUserIdByAuthorization(c);
      const profile = await this.authService.getUserProfile(userId);
      return c.json({ profile });
    } catch (error: any) {
      return c.json({ error: 'Invalid token or error retrieving profile' }, 400);
    }
  };
}
