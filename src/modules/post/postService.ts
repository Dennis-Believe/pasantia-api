import { and, eq } from "drizzle-orm";
import db from "../../db/db.client";
import { posts } from "../../db/schema/posts";
export class PostService {
    private dbClient;
  
    constructor(dbClient = db) {
      this.dbClient = dbClient;
    }

    async createPost(newPost: typeof posts.$inferInsert)
    {
        return this.dbClient.insert(posts).values(newPost).returning({id:posts.id});
    }
    async getPostsById(id:string, page: number, pageSize:number)
    {
      const offset = ( page - 1 ) * pageSize;
      return this.dbClient.select().from(posts).where(and(eq(posts.userId, id), eq(posts.isDeleted, false))).limit(pageSize).offset(offset)
    }
    async deletePostsById(id: string)
    {
        return this.dbClient.update(posts).set({isDeleted: true}).where(eq(posts.id, id))
    }
    async putPostById(id:string,content:string,userId:string)
    {
      const post=await this.dbClient.query.posts.findFirst({
            where: eq(posts.id, id),
          })
      if(post && post.userId===userId)
      {
        const newPost=this.dbClient.update(posts).set({
          content
        }).where(eq(posts.id,id)).returning();
        return newPost;
      }
      else
      {
        return "Error el post no se encontro";
      }
      
    }
}
