import { AuthController } from '@/controllers/AuthController';
import { Hono } from 'hono';

export const authRoutes = new Hono();

authRoutes.post('/prueba',AuthController.prueba)