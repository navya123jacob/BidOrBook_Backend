import { Post } from "../Domain/postEntity";
import IPostUseCase from "./interface/useCaseInterface/IPostUsecase";
import IPostRepository from "./interface/RepositoryInterface/IpostRepo";

class PostUseCase implements IPostUseCase {
  constructor(private postRepository: IPostRepository) {}

  async createPost(postInfo: Post): Promise<Post> {
    try {
      const post = await this.postRepository.create(postInfo);
      return post;
    } catch (error) {
      throw new Error('Failed to create post');
    }
  }

  async deletePost(postId: string): Promise<void> {
    try {
      await this.postRepository.deletePost(postId);
    } catch (error:any) {
      throw new Error('Error deleting post: ' + error.message);
    }
  }
}

export default PostUseCase;
