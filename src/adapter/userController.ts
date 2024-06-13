import { Request, Response } from "express";
import IUserUsecases from "../use_case/interface/useCaseInterface/IUserUseCase";
import IMailService from "../use_case/interface/services/ISendMail";
import IGenerateOTP from "../use_case/interface/services/IgenerateOtp";
import { User } from "../Domain/userEntity";
import { cloudinary } from "../FrameWork/utils/CloudinaryConfig";
import IUserController from "../use_case/interface/ControllerInterface/IuserController";

class UserController implements IUserController {
  private userCase: IUserUsecases;
  private sendMailer: IMailService;
  private genOtp: IGenerateOTP;

  constructor(userCase: IUserUsecases, sendMailer: IMailService, genOtp: IGenerateOTP) {
    this.userCase = userCase;
    this.sendMailer = sendMailer;
    this.genOtp = genOtp;
  }

  async signup(req: Request, res: Response): Promise<void> {
    try {
      const user = await this.userCase.signup(req.body);
      if (user.data.status === true && req.body.is_google === true) {
        const newuser = await this.userCase.newUser(req.body);
        res.status(newuser.status).json(newuser.data);
      } else if (user.data.status === true) {
        req.app.locals.userData = req.body;
        const otp = await this.genOtp.generateOtp(4);
        console.log(otp);
        req.app.locals.otp = otp;
        this.sendMailer.sendVerificationEmail(req.body.email, otp);
        res.status(user.status).json(user.data);
      } else {
        res.status(user.status).json(user.data);
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async resendOtp(req: Request, res: Response): Promise<void> {
    try {
      const message = "OTP resent successfully";
      const email = req.app.locals.userData.email;
      const otpR = await this.genOtp.generateOtp(4); 
      console.log(otpR);
      req.app.locals.otp = otpR;
      await this.sendMailer.sendVerificationEmail(email, otpR); 
      res.status(200).json({ message });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
}

  async resetPass1(req: Request, res: Response): Promise<void> {
    try {
      const user = await this.userCase.resetPass1(req.body.email);
      
      if (user.data.state === true && user?.data?.data && user.data.data.is_google === true) {
        const data = {
          state: false,
          message: 'Password reset is not available for Google signed-up accounts'
        };
        res.status(200).json(data);
      } else if (user.data.state === true && user?.data?.data && user.data.data.is_google !== true && user.data.data.is_verified === true) {
        const data = {
          state: true,
          message: "OTP sent successfully"
        };
        const email = req.body.email;
        req.app.locals.email = email;
        const otp = await this.genOtp.generateOtp(4);
        console.log(otp);
        req.app.locals.otp = otp;
        this.sendMailer.sendVerificationEmail(email, otp);
        res.status(200).json(data);
      } else if (user.data.state === false) {
        const data = {
          state: false,
          message: "No user found"
        };
        res.status(200).json(data);
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async resetPass2(req: Request, res: Response): Promise<void> {
    try {
      const otpF = req.body.otp;
      const otpR = req.app.locals.otp;
      if (otpR === otpF) {
        req.app.locals.otp = null;
        const data = {
          state: true,
          message: 'Verification success',
          email: req.body.email
        };
        res.status(200).json(data);
      } else {
        const data = {
          message: "Invalid OTP"
        };
        res.status(400).json(data);
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async resendOtp2(req: Request, res: Response): Promise<void> {
    try {
      const message = "OTP resent successfully";
      const email = req.app.locals.email;
      const otpR = await this.genOtp.generateOtp(4);
      console.log(otpR);
      req.app.locals.otp = otpR;
      this.sendMailer.sendVerificationEmail(email, otpR);
      res.status(200).json({ message });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async setnewpass(req: Request, res: Response): Promise<void> {
    try {
      const email = req.app.locals.email;
      const user = await this.userCase.resetPass1(email);
      if (user) {
        const updated = await this.userCase.updatePass(email, req.body.password);
        res.status(updated.status).json(updated);
      } else {
        const data = {
          message: 'Failed to update password'
        };
        res.status(400).json(data);
      }
    } catch (err) {
      console.log(err);
      res.status(401).json(err);
    }
  }

  async verifyotp(req: Request, res: Response): Promise<void> {
    try {
      const otpF = req.body.otp;
      const otpR = req.app.locals.otp;
      if (otpR === otpF) {
        const user = await this.userCase.newUser(req.app.locals.userData);
        req.app.locals.userData = null;
        res.status(user.status).json(user.data);
      } else {
        res.status(400).json({ error: "Invalid OTP" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const user = await this.userCase.login(req.body);
      if (user) {
        const id = (user?.data?.message as User)?._id.toHexString();
        await this.userCase.saveRefreshToken(id, user.data.refreshToken);
        
        const secureFlag = process.env.NODE_ENV === 'production'; 
        res.cookie('userJWT', user.data.accessToken, {
          httpOnly: true,
          sameSite: 'none',
          secure: secureFlag, 
          maxAge: 30 * 24 * 60 * 60 * 1000
        });

        res.cookie('refreshToken', user.data.refreshToken, {
          httpOnly: true,
          sameSite: 'none',
          secure: secureFlag,
          maxAge: 30 * 24 * 60 * 60 * 1000 
        });
        const { accessToken, refreshToken, ...userData } = user.data;
        
        res.status(user?.status).json(userData);
      }
    } catch (err) {
      console.log(err);
      res.status(401).json(err);
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    try {
      res.cookie('userJWT', '', {
        httpOnly: true,
        sameSite: 'none',
        secure: process.env.NODE_ENV !== 'development',
        expires: new Date(0)
      });

      res.cookie('refreshToken', '', {
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

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { _id } = req.body;
      const updateData: any = {
        Fname: req.body.Fname,
        Lname: req.body.Lname,
        phone: req.body.phone,
        description: req.body.description
      };

      if (req.body.password) {
        updateData.password = req.body.password;
      }

      if (req.file) {
        try {
          const result = await cloudinary.uploader.upload(req.file.path);
          updateData.profile = result.secure_url;
        } catch (error) {
          console.error('Cloudinary upload error:', error);
          res.status(400).json({ error: 'Failed to upload image to Cloudinary' });
          return;
        }
      }

      const updatedUser = await this.userCase.updateUser(_id, updateData);

      if (!updatedUser) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }

      res.status(200).json({ success: true, user: updatedUser });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  }
  async SingleUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      let user=await this.userCase.SingleUser(id)
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }
      res.status(200).json({ success: true, user: user });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  }

  async getAllPosts(req: Request, res: Response): Promise<void> {
    try {
      const { userid, category, usernotid, searchPlaceholder } = req.body;
      const filters: { category?: string, userid?: string, usernotid?: string, searchPlaceholder?: string } = {};

      if (category) {
        filters.category = category as string;
        filters.usernotid = usernotid as string;
        if (searchPlaceholder) {
          filters.searchPlaceholder = searchPlaceholder as string;
        }
      }
      if (userid) {
        filters.userid = userid as string;
      }

      const posts = await this.userCase.getAllPosts(filters);
      res.status(200).json({ success: true, posts });
    } catch (error) {
      console.error('Error fetching posts:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  }

  async singleUserPost(req: Request, res: Response): Promise<void> {
    try {
      const userId: string = req.params.id;
      const user = await this.userCase.singleUserPost(userId);
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}

export default UserController;
