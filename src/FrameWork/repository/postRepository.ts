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
  async markPostAsSpam(postId: string, userId: string, reason: string): Promise<void> {
    try {
      await PostModel.findByIdAndUpdate(postId, {
        $push: { spam: { userId, reason } }
      });
    } catch (error) {
      throw new Error('Error marking post as spam: ' + (error as Error).message);
    }
  }
  async unmarkPostAsSpam(postId: string, userId: string): Promise<void> {
    try {
      await PostModel.findByIdAndUpdate(postId, {
        $pull: { spam: { userId } }
      });
    } catch (error) {
      throw new Error('Error unmarking post as spam: ' + (error as Error).message);
    }
  }
  async getPostsWithSpam(): Promise<Post[]> {
    try {
      const posts = await PostModel.find({
        $or: [
          { spam: { $exists: true, $ne: [] } },
          { is_blocked: true }
        ]
      })
      .populate('userid', '_id Fname Lname email profile')
      .populate('spam.userId', '_id Fname Lname email profile');

      return posts.map(post => post.toObject() as Post);
    } catch (error) {
      throw new Error('Error fetching posts with spam: ' + (error as Error).message);
    }
  }
  async updatePostStatus(postId:string, isBlocked:boolean): Promise<void> {
   await PostModel.findByIdAndUpdate(postId, { is_blocked: isBlocked });
    
  };

}

export default PostRepository;
