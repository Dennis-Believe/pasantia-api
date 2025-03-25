import { validator } from 'hono/validator';
import z from 'zod';

export const authSchema = z
   .object({
      name: z.string().min(1, 'El nombre no puede ir vacío'),
      password: z.string().min(8, 'El password es muy corto, min 8 caracteres'),
      password_confirmation: z.string(),
      email: z.string().email('Email no válido').min(1, 'El email no puede ir vacío'),
   })
   .refine((data) => data.password === data.password_confirmation, {
      message: 'Los passwords no son iguales',
      path: ['password_confirmation'],
   });
      