import { AuthController } from '@/controllers/AuthController';
import { Hono } from 'hono';

export const userRoutes = new Hono();

userRoutes.post('/create-account', AuthController.createAccount);

