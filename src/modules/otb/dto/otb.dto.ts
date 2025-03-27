import { z } from 'zod';

export const otbSchema = z.object({
  email: z.string().email("Debe ser un email válido"),
  token: z.number().min(4,"El OTB no es valido"),
});

export type OTBInput = z.infer<typeof otbSchema>;
