import { Context, Next } from 'hono'
import { verifyJwtToken } from '../modules/auth/utils/authUtils'

export const authenticate = async (c: Context, next: Next) => {
  try {
    const bearer = c.req.header('Authorization')
    if (!bearer) {
      const error = new Error('No autorizado')
      return c.json(error)
    }
    const token = bearer.split(' ')[1]

    try {
      const decoded: any = await verifyJwtToken(token)
      if (decoded && decoded.userId) {
        c.set('user', { id: decoded.userId })
        await next()
      } else {
        return c.json({ error: 'Token no valido' })
      }
    } catch (error) {
      return c.json('Token no válido')
    }
  } catch (error) {
    return c.json('Hubo un error en la autenticación')
  }
}