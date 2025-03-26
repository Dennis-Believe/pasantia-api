
import { Hono } from 'hono';
import { UserService } from './userService';
import { UserController } from './userController';
import { AuthService } from '../auth/authService';

export const userRoutes = new Hono();

// Crear instancias de UserService y UserController
const userService = new UserService();
const authService = new AuthService();
const userController = new UserController(userService, authService);

// Definir las rutas
userRoutes.post('/create-account', userController.createAccount);
