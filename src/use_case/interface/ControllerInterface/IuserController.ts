import { Request, Response } from "express";

interface IUserController {
  signup(req: Request, res: Response): Promise<void>;
  resendOtp(req: Request, res: Response): Promise<void>;
  resetPass1(req: Request, res: Response): Promise<void>;
  resetPass2(req: Request, res: Response): Promise<void>;
  resendOtp2(req: Request, res: Response): Promise<void>;
  setnewpass(req: Request, res: Response): Promise<void>;
  verifyotp(req: Request, res: Response): Promise<void>;
  login(req: Request, res: Response): Promise<void>;
  logout(req: Request, res: Response): Promise<void>;
  updateUser(req: Request, res: Response): Promise<void>;
  getAllPosts(req: Request, res: Response): Promise<void>;
  singleUserPost(req: Request, res: Response): Promise<void>;
  SingleUser(req: Request, res: Response): Promise<void>;
  spamUser(req: Request, res: Response): Promise<void>;
  unspamUser(req: Request, res: Response): Promise<void>
  
}

export default IUserController;
