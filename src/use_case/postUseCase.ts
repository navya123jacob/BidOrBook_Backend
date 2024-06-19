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
  async markPostAsSpam(postId: string, userId: string, reason: string): Promise<void> {
    try {
      await this.postRepository.markPostAsSpam(postId, userId, reason);
    } catch (error: any) {
      throw new Error('Error marking post as spam: ' + error.message);
    }
  }
  async unmarkPostAsSpam(postId: string, userId: string): Promise<void> {
    try {
      await this.postRepository.unmarkPostAsSpam(postId, userId);
    } catch (error: any) {
      throw new Error('Error unmarking post as spam: ' + error.message);
    }
  }
  async getPostsWithSpam(): Promise<Post[]> {
    try {
      return await this.postRepository.getPostsWithSpam();
    } catch (error) {
      throw new Error('Error executing use case: ' + (error as Error).message);
    }
  }
  async blockPost (postId:string):Promise<void> {
    await this.postRepository.updatePostStatus(postId, true);
  };
  
  async unblockPost(postId:string):Promise<void> {
    await this.postRepository.updatePostStatus(postId, false);
  };

}

export default PostUseCase;
