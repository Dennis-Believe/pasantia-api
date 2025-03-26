import { Context } from 'hono'
import { UserService } from './userService'
import { userSchema } from './dto/user.dto'
import {
  encryptPassword,
  generateTokenOtb,
  sendEmail,
} from '../auth/utils/authUtils'
import { OTBService } from '../otb/otbService'
export class UserController {
  private userService: UserService
  private otbService: OTBService
  constructor(userService: UserService, otbService: OTBService) {
    this.userService = userService
    this.otbService = otbService
  }

  createAccount = async (c: Context) => {
    try {
      const body = await c.req.json()

      // Validación
      const result = userSchema.safeParse(body)
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
      // Enviar Token al Email del usuario para verificar cuenta crear
      const tokenOTB = generateTokenOtb()
      await this.otbService.createOTB(insertedUser.id, +tokenOTB)
      await sendEmail(email, tokenOTB)

      return c.json('Creado correctamente, verifique su email')
    } catch (error) {
      console.error(error)
      return c.json('Hubo un error', 500)
    }
  }
}
