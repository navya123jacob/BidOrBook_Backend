import { Post } from "../../../Domain/postEntity";

interface IPostUseCase {
  createPost(postInfo: Post): Promise<Post>;
  deletePost(postId: string): Promise<void>;
  markPostAsSpam(postId: string, userId: string, reason: string): Promise<void> ;
  unmarkPostAsSpam(postId: string, userId: string): Promise<void>;
  getPostsWithSpam(): Promise<Post[]>;
  blockPost (postId:string):Promise<void>;
  unblockPost(postId:string):Promise<void>
}

export default IPostUseCase;
