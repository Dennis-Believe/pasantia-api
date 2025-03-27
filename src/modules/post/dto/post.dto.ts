import { z } from "zod";

export const postSchema = z.object({
    userId:z.string().min(5,'El User no puede ir vacio'),
    title: z.string().min(5, 'El nombre no puede ir vacío'),
    content: z.string(),    
})
export type POSTInput = z.infer<typeof postSchema>