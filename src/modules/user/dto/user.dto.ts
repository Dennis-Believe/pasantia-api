import z from 'zod'

export const userSchema = z
  .object({
    firstName: z.string().min(1, 'El nombre no puede ir vacío'),
    lastName: z.string().min(1, 'El apellido no puede ir vacío'),
    password: z
      .string()
      .min(8, 'El password es muy corto, min 8 caracteres')
      .refine((value) => /[A-Z]/.test(value), {
        message: 'Debe contener al menos una letra mayúscula',
      })
      .refine((value) => /[a-z]/.test(value), {
        message: 'Debe contener al menos una letra minúscula',
      })
      .refine((value) => /\d/.test(value), {
        message: 'Debe contener al menos un número',
      })
      .refine((value) => /[!@#$%^&*(),.?":{}|<>]/.test(value), {
        message: 'Debe contener al menos un símbolo especial',
      }),
    passwordConfirmation: z.string(),
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
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'Los passwords no son iguales',
    path: ['password_confirmation'],
  })
export type User = z.infer<typeof userSchema>
