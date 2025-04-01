import { Context } from 'hono'
import { HTTPException } from 'hono/http-exception';
import { UserService } from './userService'
import { passwordSchema, updateUserProfileSchema, userSchema } from './dto/user.dto'
import {
  decryptPassword,
  encryptPassword,
  generateExpirationDate,
  generateJWT,
  generateTokenOtb,
  generateUniqueId,
  sendEmail,
} from '../auth/utils/authUtils'
import { OTBService } from '../otb/otbService'
import { SessionService } from '../sessions/sessionService'
export class UserController {
  private userService: UserService
  private otbService: OTBService
  private sessionService : SessionService
  constructor(
    userService: UserService,
    otbService: OTBService,
    sessionService: SessionService,
  ) {
    this.userService = userService
    this.otbService = otbService
    this.sessionService = sessionService
  }

  createAccount = async (c: Context) => {
    try {
      const body = await c.req.json()

      // Validación
      const result = userSchema.safeParse(body)
      if (!result.success) {
        return c.json({ message: 'Datos inválidos', errors: result.error.formErrors.fieldErrors }, 400);
      }

      const { firstName, lastName, email, password, birthDate } = result.data

      // Prevenir duplicados
      const userExist = await this.userService.findUserByEmail(email)
      if (userExist) {
        throw new HTTPException(409, { message: 'El usuario ya existe!' });
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
      if (error instanceof HTTPException) {
        throw error
      }
      throw new HTTPException(500, { message: 'Hubo un error al crear el usuario' });
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
        return c.json({ message: 'Datos inválidos', errors: result.error.formErrors.fieldErrors }, 400);
      }
      const filteredUpdates : any = Object.entries(result.data).reduce(
        (acc, [key, value])=> (value !== undefined ? { ...acc, [key] : value } : acc),
        {}
      )
      if(Object.keys(filteredUpdates).length ===0){
        throw new HTTPException(400, { message: 'No se enviaron datos válidos para actualizar' });
      }
      if(filteredUpdates.birthDate){
        formattedBirthDate = filteredUpdates.birthDate.toISOString().split('T')[0]
        filteredUpdates.birthDate = formattedBirthDate
      }
      await this.userService.updateUserProfile(filteredUpdates, id)

      return c.json('Usuario actualizado correctamente')
    } catch (error) {
      if (error instanceof HTTPException) {
        throw error
      }
      throw new HTTPException(500, { message: 'Hubo un error al actualizar el usuario' });
    }
  }
  changePassword = async (c:Context) =>{
    try
    {
      const body = await c.req.json();
      const result = passwordSchema.safeParse(body);
      if (!result.success) {
        return c.json({ message: 'Datos inválidos', errors: result.error.formErrors.fieldErrors }, 400);
      }
      const decoded = c.get('user') 
      const [r]= await this.sessionService.isEnabled(decoded.sessionId);
      if(!r)
      {
        throw new HTTPException(401, { message: 'Token inválido' });
      }
      const user=await this.userService.findUserById(decoded.id);
      if(!user)
      {
        throw new HTTPException(404, { message: 'Usuario no encontrado' });
      }
      const {password, newPassword}=result.data;
      const pDecode=await decryptPassword(user?.password);
      if(pDecode===password)
      {

        const p=await encryptPassword(newPassword);
        await this.userService.updatePassword(p,decoded.id);
        await this.sessionService.updateAllSessions(user.id);
        const id=generateUniqueId();
        const t=await generateJWT(user.id,id);
        const date= generateExpirationDate()
        await this.sessionService.createSession({
          id:id,
          userId: user.id,
          token: t,
          lifeTime: 3600,
          timeOut: date,
        })
        return c.json({message:"Password Updated!", token:`Bearer ${t}`},200);
      }
      throw new HTTPException(401, { message: 'Credenciales inválidas' });
    }
    catch(error:any)
    {
      if (error instanceof HTTPException) {
        throw error
      }
      throw new HTTPException(500, { message: error.message });
    }
  }
}
