import { Context } from 'hono'
import { UserService } from './userService'
import { authSchema } from './dto/user.dto'

import { encryptPassword } from '../auth/utils/authUtils'
export class UserController {
  private userService: UserService

  constructor(userService: UserService) {
    this.userService = userService
  }

  createAccount = async (c: Context) => {
    try {
      const body = await c.req.json()

      // Validación
      const result = authSchema.safeParse(body)
      if (!result.success) {
        return c.json({ errors: result.error.formErrors.fieldErrors }, 400)
      }

      const { firstName, lastName, email, password, birthDate } = result.data

      // Prevenir duplicados
      const userExist = await this.userService.findUserByEmail(email)
      if (userExist) {
        return c.json('El usuario ya existe!', 400)
      }

      // Encriptar contraseña y formatear fecha

      const userPassword = await encryptPassword(password)
      const parsedBirthDate = new Date(birthDate)
      const formattedBirthDate = parsedBirthDate.toISOString().split('T')[0]

      // Crear usuario
      const [insertedUser] = await this.userService.createUser({
        firstName,
        lastName,
        email,
        password: userPassword,
        birthDate: formattedBirthDate,
      })

      return c.json('Creado correctamente')
    } catch (error) {
      console.error(error)
      return c.json('Hubo un error', 500)
    }
  }
}
