import { Context, Next } from 'hono'
import { verifyJwtToken } from '../modules/auth/utils/authUtils'
import { SessionService } from '../modules/sessions/sessionService'
import { HTTPException } from 'hono/http-exception'

export const authenticate = async (c: Context, next: Next) => {
  const sessionService = new SessionService();
  try {
    const bearer = c.req.header('Authorization')
    if (!bearer) {
          throw new HTTPException(401, { message: 'No autorizado' })
    }
    const token = bearer.split(' ')[1]

    try {
      const decoded: any = await verifyJwtToken(token)
      if (decoded && decoded.userId && decoded.sessionId) {
        const [result] = await sessionService.isEnabled(decoded.sessionId)
        const enabled = result.isEnabled;
        if(!enabled){
          throw new HTTPException(401, { message: 'Token no válido' })
        }
        c.set('user', { id: decoded.userId , sessionId: decoded.sessionId})
        await next()
      } else {
        throw new HTTPException(401, { message: 'Token no válido' })
      }
    } catch (error) {
      throw new HTTPException(401, { message: 'Token no válido' })
    }
  } catch (error) {
    if(error instanceof HTTPException) {
      throw error
    }
    throw new HTTPException(401, { message: 'Error de autenticación' });
  }
}