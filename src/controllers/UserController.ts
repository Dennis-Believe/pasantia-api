import { UserService } from '../services/userService';
import { authSchema } from '../types';
import { encryptPassword } from '../utils/userUtils';
import { generateTokenOtb } from '../utils/tokenOTB';
import { Context } from 'hono';

export class userController {
  static createAccount = async (c: Context) => {
    try {
      const body = await c.req.json();

      // Validación
      const result = authSchema.safeParse(body);
      if (!result.success) {
        return c.json({ errors: result.error.formErrors.fieldErrors }, 400);
      }

      const { firstName, lastName, email, password, birthDate } = result.data;

      // Prevenir duplicados
      const userExist = await UserService.findUserByEmail(email);
      if (userExist) {
        return c.json('El usuario ya existe!', 400);
      }

      // Encriptar contraseña y formatear fecha
      const userPassword = await encryptPassword(password);
      const parsedBirthDate = new Date(birthDate);
      const formattedBirthDate = parsedBirthDate.toISOString().split('T')[0];

      // Crear usuario
      const [insertedUser] = await UserService.createUser({
        firstName,
        lastName,
        email,
        password: userPassword,
        birthDate: formattedBirthDate,
      });

      // Generar token OTB
      const tokenOTB = generateTokenOtb();
      await UserService.createOTB(insertedUser.id, +tokenOTB);

      return c.json('Creado correctamente');
    } catch (error) {
      console.error(error);
      return c.json('Hubo un error', 500);
    }
  };

  static getUserById = async (c: Context) => {
    try {
      const getUserFromHeader = c.get('user');
      const user = await UserService.findUserById(getUserFromHeader.id);

      if (!user) {
        return c.json('Usuario no encontrado', 404);
      }

      return c.json(user);
    } catch (error) {
      console.error(error);
      return c.json('Hubo un error', 500);
    }
  };
}