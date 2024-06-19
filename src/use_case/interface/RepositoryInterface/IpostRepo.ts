import { Post } from "../../../Domain/postEntity";

interface IPostRepository {
  create(postInfo: Post): Promise<Post>;
  deletePost(postId: string): Promise<void>;
  markPostAsSpam(postId: string, userId: string, reason: string): Promise<void>;
  unmarkPostAsSpam(postId: string, userId: string): Promise<void>;
  getPostsWithSpam(): Promise<Post[]>;
  updatePostStatus(postId:string, isBlocked:boolean): Promise<void> ;
}

export default IPostRepository;
