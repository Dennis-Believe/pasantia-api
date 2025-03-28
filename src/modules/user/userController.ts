import { Context } from 'hono'
import { UserService } from './userService'
import { passwordSchema, postPaginationSchema, updateUserProfileSchema, userSchema } from './dto/user.dto'
import {
  decryptPassword,
  encryptPassword,
  generateTokenOtb,
  getUserIdByAuthorization,
  sendEmail,
} from '../auth/utils/authUtils'
import { OTBService } from '../otb/otbService'
import { PostService } from '../post/postService'
export class UserController {
  private userService: UserService
  private otbService: OTBService
  private postService: PostService
  constructor(
    userService: UserService,
    otbService: OTBService,
    postService: PostService,
  ) {
    this.userService = userService
    this.otbService = otbService
    this.postService = postService
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
  getPosts = async (c: Context) => {
    try {
      const { id } = c.get('user')
      const body = await c.req.json()
      const result = postPaginationSchema.safeParse(body)
      if(!result.success){
        return c.json({ errors: result.error.formErrors.fieldErrors }, 400)
      }
      const { page, pageSize } = result.data

      const posts = await this.postService.getPostsById(id,page,pageSize);
      return c.json(posts)
    } catch (error) {
      return c.json('Hubo un errorr', 500)
    }
  }
  updateUser = async (c:Context) =>{
    try {
      const body = await c.req.json()
      const { id } = c.get('user')
      // Validación
      const result = updateUserProfileSchema.safeParse(body)
      if (!result.success) {
        return c.json({ errors: result.error.formErrors.fieldErrors }, 400)
      }
      const { firstName, lastName, password, birthDate } = result.data;
      
      const formattedBirthDate = birthDate.toISOString().split('T')[0]

      await this.userService.updateUserProfile(firstName, lastName, password, formattedBirthDate, id)

      return c.json('Usuario actualizado correctamente')
    } catch (error) {
      return c.json('Hubo un error')
    }
  }
}
