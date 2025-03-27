import { z } from "zod";

export const postSchema = z.object({
    title: z.string().min(5, 'El nombre no puede ir vacío'),
    content: z.string(),    
})
export type POSTInput = z.infer<typeof postSchema>


export const updatePostSchema = z.object({
    content: z.string(),    
})
export type updatePOST = z.infer<typeof updatePostSchema>