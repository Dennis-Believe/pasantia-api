import { z } from 'zod';

export const otbSchema = z.object({
  email: z.string().email("Debe ser un email válido")
});

export type OTBInput = z.infer<typeof otbSchema>;
