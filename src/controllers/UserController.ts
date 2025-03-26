import db from '@/db/db.client'
import { users } from '@/db/schema'
import { authSchema } from '@/types'
import { encryptPassword } from '@/utils/userUtils'
import { eq } from 'drizzle-orm'


export class userController {
  static createAccount = async (c: any) => {
    try {
      const body = await c.req.json()
      console.log(body)

      // Validación
      const result = authSchema.safeParse(await body)
      if (!result.success) {
        return c.json({ errors: result.error.formErrors.fieldErrors }, 400)
      }

      // Prevenimos duplicados
      const { firstName, lastName, email, password, birthDate } = result.data
      const userExist = await db.query.users.findFirst({
        where: eq(users.email, email),
      })
      if (userExist) {
        return c.json('El usuario ya existe!')
      }

      // Encriptamos y creamos usuario
      const userPassword = await encryptPassword(password)

      const parsedBirthDate = new Date(birthDate)   // formateando fecha para compatibilidad con z validation y postgre
      const formattedBirthDate = parsedBirthDate.toISOString().split('T')[0]
      type NewUser = typeof users.$inferInsert
      try {
        const newUser: NewUser = {
          firstName,
          lastName,
          email,
          password: userPassword,
          birthDate: formattedBirthDate,
        }
        await db.insert(users).values(newUser).returning()
        return c.json('Creado correctamente')
      } catch (error) {
        return c.json({ error })
      }
    } catch (error) {
      return c.json('Hubo un error', 500)
    }
  }
}
