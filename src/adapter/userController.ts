import { Request, Response } from "express";
import Userusecase from "../use_case/userUsecases"; //for giving types
import jwt, { JwtPayload } from "jsonwebtoken";
import sendMail from "../FrameWork/utils/sendMail";
import GenerateOTP from "../FrameWork/utils/generateOtp";
import { User } from "../Domain/userEntity";
import { cloudinary } from "../FrameWork/utils/CloudinaryConfig";
import asyncHandler from 'express-async-handler';
class UserController {
  private userCase: Userusecase;
  private sendMailer: sendMail;
  private genOtp: GenerateOTP;
  
  

  constructor(userCase: Userusecase, sendMailer: sendMail, genOtp: GenerateOTP) {
    this.userCase = userCase;
    this.sendMailer = sendMailer; 
    this.genOtp = genOtp;
  }

  async signup(req: Request, res: Response) {
    try {
      const user = await this.userCase.signup(req.body)
      if(user.data.status==true && req.body.is_google==true){
       
        const newuser= await this.userCase.newUser(req.body)
        res.status(newuser.status).json(newuser.data);
      }else if(user.data.status===true){
        req.app.locals.userData= req.body
        const otp = await this.genOtp.generateOtp(4)
        console.log(otp);
        req.app.locals.otp = otp;
        this.sendMailer.sendVerificationEmail(req.body.email, otp);
        res.status(user.status).json(user.data);
      }
      else {
        res.status(user.status).json(user.data);
      }
    } catch (error) {
     console.log(error);
    }
  }

  async resendOtp(req: Request, res: Response) {
    try {
      
      const message ="OTP resent successfully"
      const email = req.app.locals.userData.email
      const otpR = await this.genOtp.generateOtp(4)
      console.log(otpR)
      req.app.locals.otp = otpR;
      this.sendMailer.sendVerificationEmail(email, otpR);
      res.status(200).json(message);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async resetPass1(req: Request, res: Response) {
    try {
      const user = await this.userCase.resetPass1(req.body.email)
      console.log(user)
      if (user.data.state === true && user?.data?.data && user.data.data.is_google == true) {
        const status= 200
        const data= {
          state:false,
          message:'Password reset is not available for Google signed-up accounts'
        }
        res.status(status).json(data);
      } else if (user.data.state === true && user?.data?.data&& user.data.data.is_google!=true && user.data.data.is_verified==true) {
        const data={
          state:true,
          message: "OTP sent successfully"
        }
        const email = req.body.email
        req.app.locals.email= email
        const otp = await this.genOtp.generateOtp(4)
        req.app.locals.otp = otp;
        this.sendMailer.sendVerificationEmail(email, otp);
        res.status(200).json(data);
      }else if (user.data.state===false){
        const data = {
          state: false,
          message: "No user found"
        }
        res.status(200).json(data);
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async checkMailOtp(req: Request, res: Response) {
    try {
      console.log(req.body.email)
      const user = await this.userCase.resetPass1(req.body.email);
      console.log(user)
      if (user.data.state === true && user?.data?.data) {
        const data = {
          state: false,
          message: 'User already exists with the given email'
        };
        res.status(200).json(data);
      } else if (user.data.state === false) {
        const email = req.body.email;
        const otp = await this.genOtp.generateOtp(4);
        this.sendMailer.sendVerificationEmail(email, otp);
        const data = {
          state: true,
          message: "OTP sent successfully"
        };
        req.app.locals.email = email;
        req.app.locals.otp = otp;
        res.status(200).json(data);
      } else {
        res.status(400).json({
          state: false,
          message: "Unexpected state"
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }


  async resetPass2(req: Request, res: Response) {
    try {
      let otpF=req.body.otp
      let otpR = req.app.locals.otp
      if (otpR=== otpF) {
        req.app.locals.otp = null;
        const status= 200
        const data={
          state:true,
          message:'Verification success'
        }
        res.status(status).json(data);
      } else {
        const data={
          message: "Invalid OTP"
        }
        res.status(400).json(data);
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async resendOtp2(req: Request, res: Response) {
    try {
      const message = "OTP resent successfully"
      const email = req.app.locals.email
      const otpR = await this.genOtp.generateOtp(4)
      req.app.locals.otp = otpR;
      this.sendMailer.sendVerificationEmail(email, otpR);
      res.status(200).json(message);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  
  async verifyotp(req: Request, res: Response) {
    try {
      console.log('inside')
        let otpF=req.body.otp
      let otpR = req.app.locals.otp
      if (otpR=== otpF) {
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

  async login(req: Request, res: Response) {
    try {
      const user = await this.userCase.login(req.body);
      console.log(user)
      if (user) {
        const id = (user?.data?.message as User)?._id.toHexString();
        await this.userCase.saveRefreshToken(id, user.data.refreshToken);
        res.cookie('userJWT', user.data.accessToken, {
          httpOnly: true,
          sameSite: 'none',
          secure: process.env.NODE_ENV !== 'development',
          maxAge: 30 * 24 * 60 * 60 * 1000
        });
  
        res.cookie('refreshToken', user.data.refreshToken, {
          httpOnly: true,
          sameSite: 'none',
          secure: process.env.NODE_ENV !== 'development',
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

  async logout(req: Request, res: Response) {
    try {
      res.cookie("userId","",{
        httpOnly: true,
        expires: new Date(0),
      });
      res.status(200).json("Logged Out Successfully");
    } catch (error) {
      console.log(error)
    }
  }

  async updateUser  (req: Request, res: Response): Promise<void> {
    try {
      
      const { _id } = req.body;
      const updateData: any = {
        Fname: req.body.Fname,
        Lname: req.body.Lname,
        phone: req.body.phone,
      };
     console.log(req.file)
     console.log('above is file')
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
      console.log(updatedUser)
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

  }

export default UserController;

// req.app.locals.sharedData in the signup controller, its value will be accessible from any other route controllers or middleware functions within the same application instance. 