import { userController } from '@/controllers/UserController';
import { Hono } from 'hono';

export const userRoutes = new Hono();

userRoutes.post('/create-account', userController.createAccount);