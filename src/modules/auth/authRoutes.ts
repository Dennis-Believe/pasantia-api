import { Hono } from 'hono';
import { AuthService } from './authService';
import { AuthController } from './authController';
import { authenticate } from '../../middlewares/auth';

export const authRoutes = new Hono();

const authService = new AuthService();
const authController = new AuthController(authService);

authRoutes.post('/login', authController.login);
authRoutes.post('/logout',authenticate, authController.logout);
authRoutes.get('/profile',authenticate, authController.profile);
