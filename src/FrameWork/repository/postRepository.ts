import { PostModel } from "../database/postModel";
import { Post } from "../../Domain/postEntity";
import IPostRepository from "../../use_case/interface/RepositoryInterface/IpostRepo";

class PostRepository implements IPostRepository {
  async create(postInfo: Post): Promise<Post> {
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
    } catch (error) {
      throw new Error('Error deleting post: ' + (error as Error).message);
    }
  }
}

export default PostRepository;
