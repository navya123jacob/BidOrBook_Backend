import {User} from "../Domain/userEntity";
import Encrypt from "../FrameWork/passwordRepository/hashpassword";
import UserRepository from "../FrameWork/repository/userRepository";
import jwtToken from "../FrameWork/passwordRepository/jwtpassword";
import { ObjectId } from 'mongodb'; 

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
      console.log(userData)
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

  
  async getAllPosts(filters: { userid?: string; category?: string }): Promise<User[]> {
    try {
      return await this.UserRepository.getAllPosts(filters);
    } catch (error) {
      throw new Error('Failed to fetch posts');
    }
  }

  async removePostFromUser(userId: string, postId: string): Promise<void> {
    try {
      await this.UserRepository.removePost(userId, postId);
    } catch (error:any) {
      throw new Error('Error removing post from user: ' + error.message);
    }
  }
 
}

export default UserUseCase;