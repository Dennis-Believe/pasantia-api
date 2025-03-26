
import { Hono } from 'hono';
import { UserService } from './userService';
import { UserController } from './userController';

export const userRoutes = new Hono();

// Crear instancias de UserService y UserController
const userService = new UserService();
const userController = new UserController(userService);

// Definir las rutas
userRoutes.post('/create-account', userController.createAccount);