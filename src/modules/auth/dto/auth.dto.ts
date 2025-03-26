import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: 'Debe ser un email válido' }),
  password: z.string().min(8, { message: 'El password debe tener al menos 6 caracteres' })
});

export type LoginInput = z.infer<typeof loginSchema>;
