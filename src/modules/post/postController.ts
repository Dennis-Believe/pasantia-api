import { Context } from "hono";
import { PostService } from "./postService";
import { postSchema, updatePostSchema } from "./dto/post.dto";
import { UserService } from "../user/userService";
import { getUserIdByAuthorization, verifyJwtToken } from "../auth/utils/authUtils";


export class PostController{

    private postService:PostService;
    private userService:UserService;

    constructor(postService:PostService, userService:UserService)
    {
        this.postService=postService;
        this.userService=userService;
    }

    createNewPost = async (c: Context) => {
        try{
            const body=await c.req.json();
            const decoded=await getUserIdByAuthorization(c);
            const result=postSchema.safeParse(body);
            if (!result.success) {
                return c.json({ errors: result.error.formErrors.fieldErrors }, 400)
            }
            const{title, content}=result.data;
            const u=await this.userService.findUserById(decoded.userId);
            if(!u)
            {
                throw(new Error("User not found"));
            }
            const [insertedPost]=await this.postService.createPost({
                userId:decoded.userId,
                title,
                content
            });
            return c.json("New Post created id: "+insertedPost.id)

        }
        catch(error:any)
        {
            console.error(error);
            return c.json({ error: error.message }, 401);
        }
        
    }
    updatePost = async(c:Context) =>{
        try
        {
            const decoded=await getUserIdByAuthorization(c);
            const id=c.req.param("id");
            if(!id)
            {
                throw new Error("Id not found")
            }
            const body=await c.req.json();
            const result=updatePostSchema.safeParse(body)
            if (!result.success) {
                return c.json({ errors: result.error.formErrors.fieldErrors }, 400)
            }
            const {content}=result.data;
            const up=await this.postService.putPostById(id,content,decoded.userId);
            if(up!="Error el post no se encontro")
            {
                return c.json("Contenido actualizado!")
            }
            throw new Error("Error el post no pertenece al usuario")
            
            
        }
        catch(error:any)
        {
            console.error(error);
            return c.json({ error: error.message }, 401);
        }
    }
    deletePost = async (c:Context) => {
        try {
            const id = c.req.param('id')
            await this.postService.deletePostsById(id);
            return c.json('Post eliminado correctamente')
        } catch (error) {
            return c.json('Error, no se elimino el post',500)
        }
    }
}