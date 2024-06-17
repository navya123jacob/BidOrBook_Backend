import { Request, Response } from 'express';
import IAdminUseCase from '../use_case/interface/useCaseInterface/IAdminUsecase';
import { Admin } from '../Domain/Admin';
import IAdminController from '../use_case/interface/ControllerInterface/IAdminController';

class AdminController implements IAdminController {
  private adminUseCase: IAdminUseCase;

  constructor(adminUseCase: IAdminUseCase) {
    this.adminUseCase = adminUseCase;
  }

  

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const tokens = await this.adminUseCase.login(email, password);
      res.cookie('adminJWT', tokens.accessToken, {
        httpOnly: true,
        sameSite: 'none',
        secure: process.env.NODE_ENV !== 'development',
        maxAge: 30 * 24 * 60 * 60 * 1000 
      });
      res.cookie('adminRefreshToken', tokens.refreshToken, {
        httpOnly: true,
        sameSite: 'none',
        secure: process.env.NODE_ENV !== 'development',
        maxAge: 30 * 24 * 60 * 60 * 1000 
      });
      res.status(200).json({ status: true, message: 'Login successful!' });
    } catch (error: any) {
      res.status(500).json({ status: false, message: error.message });
    }
  }

  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await this.adminUseCase.getAllUsers();
      res.status(200).json(users);
    } catch (error: any) {
      res.status(500).json({ status: false, message: error.message });
    }
  }

  async blockUser(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const user = await this.adminUseCase.blockUser(userId);
      res.status(200).json(user);
    } catch (error: any) {
      res.status(500).json({ status: false, message: error.message });
    }
  }

  async unblockUser(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const user = await this.adminUseCase.unblockUser(userId);
      res.status(200).json(user);
    } catch (error: any) {
      res.status(500).json({ status: false, message: error.message });
    }
  }
}

export default AdminController;
