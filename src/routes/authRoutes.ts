
import { loginController } from '../controllers/AuthController';
import { Hono } from 'hono';

export const authRoutes = new Hono();

authRoutes.post('/prueba',loginController.login)