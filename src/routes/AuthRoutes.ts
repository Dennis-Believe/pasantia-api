import { Hono } from 'hono';
import { loginController } from '../controllers/AuthController'; // Importar el controlador de login

export const authRoutes = new Hono();


authRoutes.post('/login', async (c) => {
  return loginController.login(c); 
});
