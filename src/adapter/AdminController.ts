import { Request, Response } from 'express';
import IAdminUseCase from '../use_case/interface/useCaseInterface/IAdminUsecase';
import { Admin } from '../Domain/Admin';
import IAdminController from '../use_case/interface/ControllerInterface/IAdminController';
import { cloudinary } from '../FrameWork/utils/CloudinaryConfig';
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
      res.status(200).json(tokens.admin);
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
      console.log(userId)
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
  async logout(req: Request, res: Response): Promise<void> {
    try {
      res.cookie('adminJWT', '', {
        httpOnly: true,
        sameSite: 'none',
        secure: process.env.NODE_ENV !== 'development',
        expires: new Date(0)
      });

      res.cookie('adminRefreshToken', '', {
        httpOnly: true,
        sameSite: 'none',
        secure: process.env.NODE_ENV !== 'development',
        expires: new Date(0)
      });

      res.status(200).json("Logged Out Successfully");
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "An error occurred while logging out" });
    }
  }
  async updateAdmin(req: Request, res: Response): Promise<void> {
    try {
      const { _id } = req.body;
      const updateData: any = {
        Fname: req.body.Fname,
        Lname: req.body.Lname,
      };

      if (req.files && (req.files as any).profile) {
        try {
          const profileFile = (req.files as any).profile[0];
          const result = await cloudinary.uploader.upload(profileFile.path);
          updateData.profile = result.secure_url;
        } catch (error) {
          console.error('Cloudinary upload error:', error);
          res.status(400).json({ error: 'Failed to upload profile image to Cloudinary' });
          return;
        }
      }

      if (req.files && (req.files as any).bg) {
        try {
          const bgFile = (req.files as any).bg[0];
          const result = await cloudinary.uploader.upload(bgFile.path);
          updateData.bg = result.secure_url;
        } catch (error) {
          console.error('Cloudinary upload error:', error);
          res.status(400).json({ error: 'Failed to upload background image to Cloudinary' });
          return;
        }
      }

      const updatedAdmin = await this.adminUseCase.updateAdmin(_id, updateData);

      if (!updatedAdmin) {
        res.status(404).json({ success: false, message: 'Admin not found' });
        return;
      }

      res.status(200).json({ success: true, admin: updatedAdmin });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  }
}

export default AdminController;
