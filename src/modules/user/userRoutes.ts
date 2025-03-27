import { Hono } from 'hono';
import { UserService } from './userService';
import { UserController } from './userController';
import { OTBService } from '../otb/otbService';
import { authenticate } from '../../db/middlewares/auth';
import { PostService } from '../post/postService';

export const userRoutes = new Hono();

// Crear instancias de UserService y UserController
const userService = new UserService();
const otbService = new OTBService();
const postService = new PostService()

const userController = new UserController(userService,otbService,postService);

// Definir las rutas
userRoutes.post('/create-account', userController.createAccount);
userRoutes.get('/posts',authenticate,userController.getPosts)