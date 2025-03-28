import { Context, Next } from 'hono'
import { verifyJwtToken } from '../modules/auth/utils/authUtils'
import { SessionService } from '../modules/sessions/sessionService'

export const authenticate = async (c: Context, next: Next) => {
  const sessionService = new SessionService();
  try {
    const bearer = c.req.header('Authorization')
    if (!bearer) {
      const error = new Error('No autorizado')
      return c.json(error)
    }
    const token = bearer.split(' ')[1]

    try {
      const decoded: any = await verifyJwtToken(token)
      if (decoded && decoded.userId && decoded.sessionId) {
        const result = await sessionService.isEnabled(decoded.sessionId)
        console.log(result);
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