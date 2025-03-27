import { Context, Next } from 'hono'
import { env } from '../../config/env'
import { verifyJwtToken } from '../../modules/auth/utils/authUtils'
import jwt from 'jsonwebtoken'
export const authenticate = async (c: Context, next: Next) => {
  try {
    const bearer = c.req.header('Authorization')
    if (!bearer) {
      const error = new Error('No autorizado')
      return c.json(error)
    }
    const token = bearer.split(' ')[1]
    console.log(token)
    if (!token) {
      return c.json({ error: 'Token no válido' }, 401)
    }
    try {
      const decoded: any = jwt.verify(token, env.key)
      if (decoded && decoded.userId) {
       c.set('user', { id: decoded.userId })
       await next()
      } else {
        return c.json({ error: 'Token no válido' })
      }
    } catch (error) {
      return c.json({ error: 'Token no válido' }, 401)
    }
  } catch (error) {
    return c.json('Hubo un error en la autenticación')
  }
}