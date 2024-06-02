import { Post } from "../../../Domain/postEntity";

interface IPostUseCase {
  createPost(postInfo: Post): Promise<Post>;
  deletePost(postId: string): Promise<void>;
}

export default IPostUseCase;
