import { Hono } from 'hono';
import { AuthService } from './authService';
import { AuthController } from './authController';

export const authRoutes = new Hono();

const authService = new AuthService();
const authController = new AuthController(authService);

authRoutes.post('/login', authController.login);
authRoutes.post('/logout', authController.logout);
authRoutes.get('/profile', authController.profile);
