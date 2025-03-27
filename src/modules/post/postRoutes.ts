import { Hono } from "hono";
import { PostController } from "./postController";
import { UserService } from "../user/userService";
import { PostService } from "./postService";


export const postRoutes= new Hono();

const postService=new PostService();
const userService=new UserService();
const postController=new PostController(postService,userService);

postRoutes.post('/',postController.createNewPost);
postRoutes.put('/update/:id',postController.updatePost);