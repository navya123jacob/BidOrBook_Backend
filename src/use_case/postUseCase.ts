

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
  

}

const postUseCase = new PostUseCase();
export { postUseCase };
