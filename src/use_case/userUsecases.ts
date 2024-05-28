import {User} from "../Domain/userEntity";
import Encrypt from "../FrameWork/passwordRepository/hashpassword";
import UserRepository from "../FrameWork/repository/userRepository";
import jwtToken from "../FrameWork/passwordRepository/jwtpassword";
import { ObjectId } from 'mongodb'; 
import { Types } from "mongoose";

class UserUseCase {
  private Encrypt: Encrypt;
  private UserRepository: UserRepository;
  private JWTToken: jwtToken;

  constructor(
    Encrypt: Encrypt,
    UserRepository: UserRepository,
    JWTToken: jwtToken,
  ) {
    (this.Encrypt = Encrypt),
    (this.UserRepository = UserRepository),
    (this.JWTToken = JWTToken);
  }

  async signup(user: User) {
    
    const existingUser = await this.UserRepository.findByEmail(user.email);
    if (existingUser) {
      return {
        status: 401,
        data: {
          status:false,
          message: "User already exists",
        }
      };
    } else {
      return {
        status: 200,
        data: {
          status: true,
          message: 'Verification otp sent to your email!'
        }
      };
    }
  }

  async resetPass1(email:string) {
    const existingUser = await this.UserRepository.findByEmail(email);
    if (existingUser) {
      return {
        status: 200,
        data: {
          state: true,
          data: existingUser,
          message: "User exisists",
        }
      };
    } else {
      return {
        status: 400,
        data: {
          state: false,
          message: 'No user found'
        }
      };
    }
  }

  async updatePass(email: string, newPassword: string) {
    const userData = await this.UserRepository.findByEmail(email);
    if (!userData) {
        return { status: 404, data: { message: 'User not found.' } };
    }
    if (userData.is_google) {
        return { status: 400, data: { message: 'Password reset is not available for Google signed-up accounts. Please use Google to log in.' } };
    }

    const isSamePassword = await this.Encrypt.compare(newPassword, userData.password);
    if (isSamePassword) {
        return { status: 400, data: { message: 'The new password must be different from the current password' } };
    }

    const id = userData._id;
    if (id) {
        const updatedUserData = await this.UserRepository.findOneAndUpdate(id, { password: await this.Encrypt.generateHash(newPassword) });
        return { status: 200, data: updatedUserData, message: 'Password changed' };
    } else {
        return { status: 400, data: { message: 'User ID is undefined.' } };
    }
}

  async newUser(user:User){
    console.log(user);
   
    
    const hashedPass = await this.Encrypt.generateHash(user.password)
    const newUser = { ...user,is_verified:true,password: hashedPass }
    await this.UserRepository.save(newUser);
    return {
      status: 200,
      data: { status: true, message: 'Registration successful!' }
    }
  }
  async login(user: User) {
    try {
      const userData = await this.UserRepository.findByEmail(user.email);
      
      let accessToken = '';
      let refreshToken='';

      if (userData) {
        if (userData.is_blocked) {
          return {
            status: 400,
            data: {
              message: 'You have been blocked by admin!',
              token: ''
            }
          };
        }

        const passwordMatch = await this.Encrypt.compare(user.password, userData.password);

        if (passwordMatch || userData.is_google) {
          const userId = userData?._id.toHexString();
          if (userId) {
            accessToken = this.JWTToken.generateAccessToken(userId, 'user');
            console.log(accessToken)
            refreshToken = this.JWTToken.generateRefreshToken(userId);
            return {
              status: 200,
              data: {
                message: userData,
                accessToken,
                refreshToken
              }
            };
          }
        } else {
          return {
            status: 400,
            data: {
              message: 'Invalid email or password!',
              accessToken
            }
          };
        }
      } else {
        return {
          status: 400,
          data: {
            message: 'Invalid email or password!',
            accessToken
          }
        };
      }
    } catch (error) {
      console.error('Login failed:', error);

      return {
        status: 500,
        data: {
          message: 'Internal server error',
          token: ''
        }
      };
    }
  }

  async saveRefreshToken(id: string | undefined,refreshToken:string | undefined) {
    const User = await this.UserRepository.updateRefreshToken(id,refreshToken);
    if (User) {
      return {
        status: 200,
        data: User,
      };
    } else {
      return {
        status: 400,
        data: "Failed to add Token",
      };
    }
  }

  async updateUser(id: string, updateData: Partial<User>): Promise<User | null> {
    return this.UserRepository.updateUser(id, updateData);
  }

  async addPostToUser(userId: string, postId: ObjectId): Promise<void> {
    try {
      const user = await this.UserRepository.findById(userId);
      if (!user) {
        console.error('User not found');
        return;
      }

      user.posts.unshift(postId);
      await this.UserRepository.updateUser(userId, { posts: user.posts });
    } catch (error) {
      console.error('Error updating user posts:', error);
    }
  }

  
  async getAllPosts(filters: { userid?: string; category?: string;searchPlaceholder?: string;usernotid?:string}): Promise<User[]> {
    try {
      return await this.UserRepository.getAllPosts(filters);
    } catch (error) {
      throw new Error('Failed to fetch posts');
    }
  }
  async singleUserPost(userId: string): Promise<any> {
    try {
      return await this.UserRepository.singleUserPost(userId);
    } catch (error:unknown) {
      throw new Error('Error fetching user post: ' + (error as Error).message);
    }
  }

  async removePostFromUser(userId: string, postId: string): Promise<void> {
    try {
      await this.UserRepository.removePost(userId, postId);
    } catch (error:any) {
      throw new Error('Error removing post from user: ' + error.message);
    }
  }

  
  async addBookingIdToUser(artistId: string, bookingId: Types.ObjectId) {
    try {
      await this.UserRepository.addBookingIdToUser(artistId, bookingId);
      return {
        status: 200,
        data: { message: 'Booking ID added to user successfully' }
      };
    } catch (error) {
      throw new Error('Failed to add booking ID to user: ' + (error as Error).message);
    }
  }
 
}

export default UserUseCase;