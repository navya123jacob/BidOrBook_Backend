import { Request, Response } from 'express';

interface IPostController {
  createPost(req: Request, res: Response): Promise<void>;
  deletePost(req: Request, res: Response): Promise<void>;
  markPostAsSpam(req: Request, res: Response): Promise<void>;
  UnmarkPostAsSpam(req: Request, res: Response): Promise<void>;
  getPostsWithSpam(req: Request, res: Response): Promise<void>;
  blockPost(req: Request, res: Response): Promise<void>;
  unblockPost(req: Request, res: Response): Promise<void>;
}

export default IPostController;
