import { Context } from "hono";
import { PostService } from "./postService";
import { postSchema } from "./dto/post.dto";
import { UserService } from "../user/userService";


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
            const result=postSchema.safeParse(body);
            if (!result.success) {
                return c.json({ errors: result.error.formErrors.fieldErrors }, 400)
            }
            const{userId, title, content}=result.data;
            const u=await this.userService.findUserById(userId);
            if(!u)
            {
                throw(new Error("User not found"));
            }
            const [insertedPost]=await this.postService.createPost({
                userId,
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