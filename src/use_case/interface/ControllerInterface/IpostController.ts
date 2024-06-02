import { Request, Response } from 'express';

interface IPostController {
  createPost(req: Request, res: Response): Promise<void>;
  deletePost(req: Request, res: Response): Promise<void>;
}

export default IPostController;
