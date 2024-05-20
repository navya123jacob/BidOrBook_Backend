

import { Post } from "../Domain/postEntity";
import { postRepository } from "../FrameWork/repository/postRepository";

class PostUseCase {
  async createPost(postInfo: Post): Promise<Post> {
    try {
      const post = await postRepository.create(postInfo);
      return post;
    } catch (error) {
      throw new Error('Failed to create post');
    }
  }
  async deletePost(postId: string): Promise<void> {
    try {
      await postRepository.deletePost(postId);
    } catch (error:any) {
      throw new Error('Error deleting post: ' + error.message);
    }
  }

}

const postUseCase = new PostUseCase();
export { postUseCase };
