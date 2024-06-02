import { Post } from "../../../Domain/postEntity";

interface IPostRepository {
  create(postInfo: Post): Promise<Post>;
  deletePost(postId: string): Promise<void>;
}

export default IPostRepository;
