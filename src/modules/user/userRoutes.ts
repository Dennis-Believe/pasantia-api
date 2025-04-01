import { Hono } from 'hono';
import { UserService } from './userService';
import { UserController } from './userController';
import { OTBService } from '../otb/otbService';
import { authenticate } from '../../middlewares/auth';
import { PostService } from '../post/postService';
import { SessionService } from '../sessions/sessionService';

export const userRoutes = new Hono();

// Crear instancias de UserService y UserController
const userService = new UserService();
const otbService = new OTBService();
const postService = new PostService();
const sessionService = new SessionService();

const userController = new UserController(userService,otbService,sessionService);

// Definir las rutas
userRoutes.post('/create-account', userController.createAccount);
userRoutes.patch('/edit',authenticate, userController.updateUser);
userRoutes.patch('/pass',authenticate, userController.changePassword);