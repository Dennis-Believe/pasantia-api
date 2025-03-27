import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: 'Debe ser un email válido' }),
  password: z.string().min(8, { message: 'Credenciales invalidas' })
});

export type LoginInput = z.infer<typeof loginSchema>;
