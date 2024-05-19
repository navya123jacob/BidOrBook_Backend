import { Request, Response } from 'express';
import { Post } from '../Domain/postEntity';
import { postUseCase } from '../use_case/postUseCase';
import UserUseCase from '../use_case/userUsecases'; // Import UserUseCase class
import { cloudinary } from '../FrameWork/utils/CloudinaryConfig';
import Encrypt from "../FrameWork/passwordRepository/hashpassword";
import UserRepository from "../FrameWork/repository/userRepository";
import jwtToken from "../FrameWork/passwordRepository/jwtpassword";

export class PostController {
    private userUseCase: UserUseCase; // Declare userUseCase as a class property

    constructor() {
     
      const encrypt = new Encrypt();
      const userRepository = new UserRepository(encrypt);
      const jwt = new jwtToken();
      this.userUseCase = new UserUseCase(encrypt, userRepository, jwt);
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

      
      const createdPost = await postUseCase.createPost(updateData);
      await this.userUseCase.addPostToUser(userid, createdPost._id);

      res.status(201).json({ message: 'Post created successfully', post: createdPost });
    } catch (error) {
      console.error('Error creating post:', error);
      res.status(500).json({ error: 'Failed to create post' });
    }
  }

  
  
}
