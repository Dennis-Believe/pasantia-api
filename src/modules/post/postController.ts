import { Context } from "hono";
import { PostService } from "./postService";
import { postSchema, updatePostSchema } from "./dto/post.dto";
import { UserService } from "../user/userService";
import { HTTPException } from "hono/http-exception";

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
            const decoded= c.get('user');
            console.log(decoded)
            const result=postSchema.safeParse(body);
            if (!result.success) {
                return c.json({ errors: result.error.formErrors.fieldErrors }, 400)
            }
            const{title, content}=result.data;
            const u=await this.userService.findUserById(decoded.id);
            if (!u) {
                throw new HTTPException(404, { message: "Usuario no encontrado" });
            }
            const [insertedPost]=await this.postService.createPost({
                userId:decoded.id,
                title,
                content
            });
            return c.json("New Post created id: "+insertedPost.id)

        }
        catch(error:any)
        {
            if (error instanceof HTTPException) {
                throw error
              }
            throw new HTTPException(500, { message: error.message });
        }
        
    }
    updatePost = async(c:Context) =>{
        try
        {
            const decoded= c.get('user');
            const id=c.req.param("id");
            if(!id) {
                throw new HTTPException(400, { message: "Id no proporcionado" });
            }
            const body=await c.req.json();
            const result=updatePostSchema.safeParse(body)
            if (!result.success) {
                return c.json({ errors: result.error.formErrors.fieldErrors }, 400)
            }
            const {content}=result.data;
            const up =await this.postService.putPostById(id,content,decoded.id);
            return c.json(up)          
        }
        catch(error: any)
        {
            if (error instanceof HTTPException) {
                throw error
              }
            throw new HTTPException(500, { message: error.message });
        }
    }
    deletePost = async (c:Context) => {
        try {
            const id = c.req.param('id')
            await this.postService.deletePostsById(id);
            return c.json('Post eliminado correctamente')
        } catch (error) {
            throw new HTTPException(500, { message: "Error al eliminar el post" });
        }
    }
    getPosts = async (c: Context) => {
        try {
          const {pageSize, page } = c.req.query()
          const posts = await this.postService.getPosts(+page,+pageSize);
          const totalItems = await this.postService.getTotalPosts()
          return c.json({pageSize,page, totalItems: totalItems[0].count.toString(), posts})
        } catch (error) {
          throw new HTTPException(500, { message: "Hubo un error al obtener los posts" });
        }
      }
}