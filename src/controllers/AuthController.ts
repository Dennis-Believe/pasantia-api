import { authSchema } from '@/types';
import { Context } from 'hono';

export class AuthController {
   static createAccount = async (c: Context) => {
      try {
         const body = await c.req.json();
         console.log(body);
         const result = authSchema.safeParse(body);
         if (!result.success) {
            return c.json({ errors: result.error.formErrors.fieldErrors }, 400);
         }
         return c.json({ message: 'Cuenta creada exitosamente' });
      } catch (error) {
         return c.json({ error: 'Error interno del servidor' });
      }
   };
}
