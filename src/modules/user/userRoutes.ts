import { Hono } from 'hono';
import { UserService } from './userService';
import { UserController } from './userController';
import { OTBService } from '../otb/otbService';

export const userRoutes = new Hono();

// Crear instancias de UserService y UserController
const userService = new UserService();
const otbService = new OTBService();
const userController = new UserController(userService,otbService);

// Definir las rutas
userRoutes.post('/create-account', userController.createAccount);