import { Context } from 'hono'
import { UserService } from './userService'
import { passwordSchema, postPaginationSchema, updateUserProfileSchema, userSchema } from './dto/user.dto'
import {
  decryptPassword,
  encryptPassword,
  generateExpirationDate,
  generateJWT,
  generateTokenOtb,
  generateUniqueId,
  getUserIdByAuthorization,
  sendEmail,
} from '../auth/utils/authUtils'
import { OTBService } from '../otb/otbService'
import { PostService } from '../post/postService'
import { AuthService } from '../auth/authService'
import { SessionService } from '../sessions/sessionService'
export class UserController {
  private userService: UserService
  private otbService: OTBService
  private postService: PostService
  private authService : AuthService
  private sessionService : SessionService
  constructor(
    userService: UserService,
    otbService: OTBService,
    postService: PostService,
    authService: AuthService,
    sessionService: SessionService,
  ) {
    this.userService = userService
    this.otbService = otbService
    this.postService = postService
    this.authService = authService
    this.sessionService = sessionService
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
      var formattedBirthDate
      const { id } = c.get('user')
      // Validación
      const result = updateUserProfileSchema.safeParse(body)
      if (!result.success) {
        return c.json({ errors: result.error.formErrors.fieldErrors }, 400)
      }
      const filteredUpdates : any = Object.entries(result.data).reduce(
        (acc, [key, value])=> (value !== undefined ? { ...acc, [key] : value } : acc),
        {}
      )
      if(Object.keys(filteredUpdates).length ===0){
        return c.json({error: 'No se enviaron datos validos para actualizar'}, 400)
      }
      if(filteredUpdates.birthDate){
        formattedBirthDate = filteredUpdates.birthDate.toISOString().split('T')[0]
        filteredUpdates.birthDate = formattedBirthDate
      }
      await this.userService.updateUserProfile(filteredUpdates, id)

      return c.json('Usuario actualizado correctamente')
    } catch (error) {
      return c.json('Hubo un error')
    }
  }
  changePassword = async (c:Context) =>{
    try
    {
      const body = await c.req.json();
      const result = passwordSchema.safeParse(body);
      if(!result.success){
        return c.json({ errors: result.error.formErrors.fieldErrors }, 400)
      }
      const decoded=await getUserIdByAuthorization(c);
      const [r]= await this.sessionService.isEnabled(decoded.sessionId);
      if(!r)
      {
        throw new Error("Invalid Token");
      }
      const user=await this.userService.findUserById(decoded.userId);
      if(!user)
      {
        throw new Error("User not found");
      }
      const {password, newPassword}=result.data;
      const pDecode=await decryptPassword(user?.password);
      if(pDecode===password)
      {

        const p=await encryptPassword(newPassword);
        await this.userService.updatePassword(p,decoded.userId);
        await this.userService.updateAllSessions(user.id);
        const id=generateUniqueId();
        const t=await generateJWT(user.id,id);
        const date= generateExpirationDate()
        await this.authService.createSession({
          id:id,
          userId: user.id,
          token: t,
          lifeTime: 3600,
          timeOut: date,
        })
        return c.json({message:"Password Updated!", token:`Bearer ${t}`},200);
      }
      throw new Error("Invalid Credentials")
    }
    catch(error:any)
    {
      console.error(error);
      return c.json({ error: error.message }, 401);
    }
  }
}
