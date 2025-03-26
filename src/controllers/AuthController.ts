import { z } from 'zod';
import db from '@/db/db.client'; 
import jwt from 'jsonwebtoken'
import { eq } from 'drizzle-orm';
import { users } from '@/db/schema/users';
import {env} from '../config/env'
import { decryptPassword } from '@/utils/userUtils';
import { otb } from '@/db/schema/otb';
import { setCookie } from 'hono/cookie';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  tokenOtb: z.number()
});

export const loginController = {
    
    async login(c: any) {
        try {
        const { email, password, tokenOtb } = loginSchema.parse(await c.req.json());
        

        const user = await db.query.users.findFirst({
            where: eq(users.email,email),
        });
        if (!user || user.state) {
            return c.json({ error: 'Invalid credentials' }, 401);
        }
        const t= await db.query.otb.findFirst({where: eq(otb.userId,user.id)});
        
        if(!t || tokenOtb!=t.token)
        {
            return c.json({message:"Error with OTB"});
        }
        const decryptedPassword = await decryptPassword(user.password);
        
        
        if (password !== decryptedPassword) {
        return c.json({ error: 'Invalid credentials' }, 401);
        }
        
        const payload = { userId: user.id };
        const secret = env.key || 'secret_key';
        const token = jwt.sign(payload, secret, { expiresIn: '10m' });
        

        setCookie(c,"token",token,{httpOnly:true, secure:true, sameSite: "Strict"});

        
        await db.delete(otb).where(eq(otb.id,t.id));
        

        await db.update(users).set({state:true}).where(eq(users.id,user.id));
        
        return c.json({ message: 'Login successful', token: `Bearer ${token}` });
        } catch (error) {
        return c.json({ error: 'Invalid request data' }, 400);
        }
    },
};

