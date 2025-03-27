import { Context, Next } from 'hono'
import { verifyJwtToken } from '../modules/auth/utils/authUtils'
import { getCookie } from 'hono/cookie'
export const authenticate = async (c: Context, next: Next) => {
  try {
    const token = getCookie(c,'token');
    if (!token) {
      const error = new Error('No autorizado')
      return c.json(error)
    }
    try {
        const decoded: any = await verifyJwtToken(token)
        if(decoded && decoded.userId){
            c.set('user',{id:decoded.userId})
            await next()
        }else{
            return c.json({error:'Token no valido'})
        }
    } catch (error) {
        return c.json('Token no válido')
    }
  } catch (error) {
    return c.json('Hubo un error en la autenticación')
  }
}