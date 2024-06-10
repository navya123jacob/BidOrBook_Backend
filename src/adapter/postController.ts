import { Request, Response } from 'express';
import IPostUseCase from '../use_case/interface/useCaseInterface/IPostUsecase';
import IUserUseCase from '../use_case/interface/useCaseInterface/IUserUseCase';
import { cloudinary } from '../FrameWork/utils/CloudinaryConfig';
import IPostController from '../use_case/interface/ControllerInterface/IpostController';
class PostController implements IPostController {
  private userUseCase: IUserUseCase;
  private postUseCase: IPostUseCase;

  constructor(userUseCase: IUserUseCase, postUseCase: IPostUseCase) {
    this.userUseCase = userUseCase;
    this.postUseCase = postUseCase;
  }

  async createPost(req: Request, res: Response): Promise<void> {
    try {
      console.log(req.file);
      const { userid, name, description } = req.body;
      const updateData: any = {
        userid,
        name,
        description
      };
      if (req.file) {
        try {
          const result = await cloudinary.uploader.upload(req.file.path);
          updateData.image = result.secure_url;
        } catch (error) {
          console.error('Cloudinary upload error:', error);
          res.status(400).json({ error: 'Failed to upload image to Cloudinary' });
          return;
        }
      }

      const createdPost = await this.postUseCase.createPost(updateData);
      await this.userUseCase.addPostToUser(userid, createdPost._id);

      res.status(201).json({ message: 'Post created successfully', post: createdPost });
    } catch (error) {
      console.error('Error creating post:', error);
      res.status(500).json({ error: 'Failed to create post' });
    }
  }

  async deletePost(req: Request, res: Response): Promise<void> {
    try {
      const { postId, userId } = req.body;

      await this.postUseCase.deletePost(postId);
      await this.userUseCase.removePostFromUser(userId, postId);

      res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
      console.error('Error deleting post:', error);
      res.status(500).json({ error: 'Failed to delete post' });
    }
  }
}

export default PostController;
