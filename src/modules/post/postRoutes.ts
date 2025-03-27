import { Hono } from "hono";
import { PostController } from "./postController";
import { UserService } from "../user/userService";
import { PostService } from "./postService";
import { authenticate } from "../../middlewares/auth";


export const postRoutes= new Hono();

const postService=new PostService();
const userService=new UserService();
const postController=new PostController(postService,userService);

postRoutes.post('/',postController.createNewPost);
postRoutes.delete('/delete/:id',authenticate,postController.deletePost)