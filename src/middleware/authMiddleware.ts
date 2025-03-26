import type { Context, MiddlewareHandler } from 'hono'
import { setCookie } from 'hono/cookie'
import { env } from '../config/env'
import jwt from 'jsonwebtoken'
import db from '../db/db.client'
import { eq } from 'drizzle-orm'
import { users } from '../db/schema'
import { User } from '../types'

export const authenticate = (): MiddlewareHandler => {
  return async (c, next) => {
    const bearer = c.req.header('Authorization')
    if (!bearer) {
      const error = new Error('Unauthorized')
      return c.json({ error })
    }
    const token = bearer.split(' ')[1]
    try {
      const decoded = jwt.verify(token, env.key)
      if (typeof decoded === 'object' && decoded.id) {
        const user = await db.query.users.findFirst({
          where: eq(users.id, decoded.id),
        })
        if (user) {
          c.set('user', user)
          await next()
        } else {
          return c.json({ error: 'Invalid Token' })
        }
      }
    } catch (error) {
      return c.json({ error: 'Invalid Token' })
    }
  }
}
