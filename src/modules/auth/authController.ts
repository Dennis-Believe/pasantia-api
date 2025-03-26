import { Context } from 'hono';
import { setCookie, deleteCookie, getCookie } from 'hono/cookie';
import { loginSchema } from './dto/auth.dto';
import { AuthService } from './authService';
import { generateJWT, verifyJwtToken } from './utils/authUtils';

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
      const { email, password, tokenOtb } = parsed.data;

      const { user, otbRecord } = await this.authService.validateCredentials(email, password, tokenOtb);

      const token = await generateJWT(user.id);

      setCookie(c, 'token', token, { httpOnly: true, secure: true, sameSite: "Strict" });

      await this.authService.deleteOtbById(otbRecord.id);
      await this.authService.updateUserState(user.id, true);

      return c.json({ message: 'Login successful', token: `Bearer ${token}` });
    } catch (error: any) {
      return c.json({ error: error.message || 'Invalid request data' }, 400);
    }
  };

  logout = async (c: Context) => {
    try {
      const token = getCookie(c,"token");
      if (!token) {
        return c.json({ error: 'Not logged in' }, 401);
      }
      const decoded: any = await verifyJwtToken(token);

      await this.authService.updateUserState(decoded.userId, false);
      deleteCookie(c, 'token');
      return c.json({ message: 'Logout successful' });
    } catch (error: any) {
      return c.json({ error: 'Invalid token or error during logout' }, 400);
    }
  };

  profile = async (c: Context) => {
    try {
      const token = getCookie(c,'token');
      if (!token) {
        return c.json({ error: 'Not logged in' }, 401);
      }
      const decoded: any = verifyJwtToken(token);
      const profile = await this.authService.getUserProfile(decoded.userId);
      return c.json({ profile });
    } catch (error: any) {
      return c.json({ error: 'Invalid token or error retrieving profile' }, 400);
    }
  };
}
