import z from 'zod'

export const authSchema = z
  .object({
    firstName: z.string().min(1, 'El nombre no puede ir vacío'),
    lastName: z.string().min(1, 'El apellido no puede ir vacío'),
    password: z.string().min(8, 'El password es muy corto, min 8 caracteres'),
    password_confirmation: z.string(),
    birthDate: z
      .string()
      .datetime()
      .refine((date) => !isNaN(Date.parse(date)), {
        message: 'Inserte una fecha válida',
      }),
    email: z
      .string()
      .email('Email no válido')
      .min(1, 'El email no puede ir vacío'),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Los passwords no son iguales',
    path: ['password_confirmation'],
  })
export type User = z.infer<typeof authSchema>