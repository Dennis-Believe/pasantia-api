import { eq } from "drizzle-orm";
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
    async getPostsById(id:string)
    {
      return  this.dbClient.query.posts.findMany({where: eq(posts.userId, id)})
    }
}