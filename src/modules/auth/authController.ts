import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
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
        return c.json({ message: 'Datos inválidos', errors: parsed.error.formErrors.fieldErrors }, 400);
      }

      const { email, password } = parsed.data;
      const { user } = await this.authService.validateCredentials(email, password);

      const idSession = generateUniqueId();
      const token = await generateJWT(user.id, idSession);

      const expirationDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const year = expirationDate.getFullYear();
      const month = String(expirationDate.getMonth() + 1).padStart(2, '0');
      const day = String(expirationDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;

      await this.sessionService.createSession({
        id: idSession,
        userId: user.id,
        token,
        isEnabled: true,
        lifeTime: 3600,
        timeOut: formattedDate,
      });

      return c.json({ message: 'Login successful', token: `Bearer ${token}` });
    } catch (error: any) {
      if (error instanceof HTTPException) {
        throw error
      }
      throw new HTTPException(500, { message: error.message || 'Error en el login' });
    }
  };

  logout = async (c: Context) => {
    try {
      const decoded = c.get('user');
      if (!decoded) {
        throw new HTTPException(401, { message: 'Token no proporcionado' });
      }

      const s = await this.sessionService.updateSessionById(decoded.sessionId);
      if (s === 'Sesion no valida') {
        throw new HTTPException(401, { message: s });
      }

      return c.json({ message: 'Logout successful' });
    } catch (error) {
      throw new HTTPException(500, { message: 'Error al cerrar sesión' });
    }
  };

  profile = async (c: Context) => {
    try {
      const decoded = c.get('user');
      const profile = await this.authService.getUserProfile(decoded.id);
      return c.json({ profile });
    } catch (error: any) {
      throw new HTTPException(500, { message: 'Error al obtener el perfil' });
    }
  };
}