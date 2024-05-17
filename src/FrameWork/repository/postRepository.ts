
import { PostModel } from "../database/postModel";
import { Post } from "../../Domain/postEntity";
class PostRepository {
  async create(postInfo: Post): Promise<Post> {
    try {
      const post = new PostModel(postInfo);
      return await post.save();
    } catch (error) {
      throw new Error('Failed to create post');
    }
  }
  async createPost(postInfo: Post): Promise<Post> {
    try {
      const post = new PostModel(postInfo);
      return await post.save();
    } catch (error) {
      throw new Error('Failed to create post');
    }
  }

}

const postRepository = new PostRepository();
export { postRepository };
