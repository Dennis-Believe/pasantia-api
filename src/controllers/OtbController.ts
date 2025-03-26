import db from "@/db/db.client";
import { otb } from "@/db/schema/otb";
import { users } from "@/db/schema/users";
import { eq } from "drizzle-orm";
import crypto from 'crypto';
import { transporter } from "@/utils/userUtils";
import {env} from "../config/env"
import { z } from "zod";

const otbSchema = z.object({
  email: z.string().email()
});

async function sendEmail(email:any,token:any){
    try {
        const info = await transporter.sendMail({
          from: env.gmail_user,
          to: email,
          subject: "CODIGO DE AUTENTICACION",
          text:token,
        });
        return "ok"
      } catch (error: any) {
        return error;
      }
}
export const OtbController={
    async getOTB(c:any)
    {
        const { email } = otbSchema.parse(await c.req.json());
        console.log(email);
        const user = await db.query.users.findFirst({
            where: eq(users.email, email),
          });
          
        
        if(!user)
        {
            return  c.json({ error: 'Invalid credentials' }, 401);
        }
        const otbs=await db.query.otb.findFirst({
            where: eq(otb.userId,user.id),
        })
        if(!otbs)
        {
            const n=crypto.randomInt(1000, 1000000);
            const to=await db.insert(otb).values({userId:user.id, token: n }).returning();
            const r=await sendEmail(user.email,to[0].token);
            if(r=="ok")
            {
                return c.json({ message: 'OTB Send successful'})
            }
            return c.json({message: "ERROR ON SEND OTB"});
        }
        else
        {
            return c.json({message: "OTB exist"});
        }
    },
}