import { Hono } from 'hono';
import { AuthService } from './authService';
import { AuthController } from './authController';
import { authenticate } from '../../middlewares/auth';
import { SessionService } from '../sessions/sessionService';

export const authRoutes = new Hono();

const authService = new AuthService();
const sessionService = new SessionService()
const authController = new AuthController(authService, sessionService);

authRoutes.post('/login', authController.login);
authRoutes.post('/logout',authenticate, authController.logout);
authRoutes.get('/profile',authenticate, authController.profile);
