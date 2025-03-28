import { Hono } from 'hono';
import { UserService } from './userService';
import { UserController } from './userController';
import { OTBService } from '../otb/otbService';
import { authenticate } from '../../middlewares/auth';
import { PostService } from '../post/postService';
import { SessionService } from '../sessions/sessionService';
import { AuthService } from '../auth/authService';

export const userRoutes = new Hono();

// Crear instancias de UserService y UserController
const userService = new UserService();
const otbService = new OTBService();
const postService = new PostService();
const sessionService = new SessionService();
const authService = new AuthService();

const userController = new UserController(userService,otbService,postService,authService,sessionService);

// Definir las rutas
userRoutes.post('/create-account', userController.createAccount);
userRoutes.post('/posts',authenticate,userController.getPosts);
userRoutes.patch('/edit',authenticate, userController.updateUser);
userRoutes.patch('/pass',authenticate, userController.changePassword);