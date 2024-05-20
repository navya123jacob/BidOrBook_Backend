
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
 
  async deletePost(postId: string): Promise<void> {
    try {
      await PostModel.findByIdAndDelete(postId);
    } catch (error:any) {
      throw new Error('Error deleting post: ' + error.message);
    }
  }


}

const postRepository = new PostRepository();
export { postRepository };
