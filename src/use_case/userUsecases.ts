import { User } from "../Domain/userEntity";
import { Types, ObjectId } from "mongoose";
import IUserRepo from "./interface/RepositoryInterface/IuserRepo";
import Hashpassword from "./interface/services/Ihashpassword";
import JWT from "./interface/services/Ijwt";
import IUserUseCase from "./interface/useCaseInterface/IUserUseCase";

class UserUseCase implements IUserUseCase {
  private Encrypt: Hashpassword;
  private userRepository: IUserRepo;
  private jwtToken: JWT;

  constructor(
    Encrypt: Hashpassword,
    userRepository: IUserRepo,
    jwtToken: JWT,
  ) {
    this.Encrypt = Encrypt;
    this.userRepository = userRepository;
    this.jwtToken = jwtToken;
  }
  
  async signup(user: User): Promise<{ status: number; data: { status: boolean; message: string } }> {
    const existingUser = await this.userRepository.findByEmail(user.email);
    if (existingUser) {
      return {
        status: 401,
        data: {
          status: false,
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

  async resetPass1(email: string): Promise<{ status: number; data: { state: boolean; data?: User; message: string } }> {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      return {
        status: 200,
        data: {
          state: true,
          data: existingUser,
          message: "User exists",
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

  async updatePass(email: string, newPassword: string): Promise<{ status: number; data: { message: string } } | { status: number; data: User; message: string }> {
    const userData = await this.userRepository.findByEmail(email);
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
        const updatedUserData = await this.userRepository.findOneAndUpdate(id, { password: await this.Encrypt.generateHash(newPassword) });
        if (updatedUserData) {
            return { status: 200, data: updatedUserData, message: 'Password changed' };
        } else {
            return { status: 404, data: { message: 'User not found.' } };
        }
    } else {
        return { status: 400, data: { message: 'User ID is undefined.' } };
    }
}

async newUser(user: User): Promise<{ status: number; data: { status: boolean; message: string } }> {
  const hashedPass = await this.Encrypt.generateHash(user.password);
  const newUser = { ...user, is_verified: true, password: hashedPass };
  await this.userRepository.save(newUser);
  return {
      status: 200,
      data: { status: true, message: 'Registration successful!' }
  };
}
async login(user: User): Promise<{ status: number; data: { message: string; accessToken: string; refreshToken: string } } | { status: number; data: { message: User; accessToken: string; refreshToken: string } }> {
  try {
      const userData = await this.userRepository.findByEmail(user.email);
      let accessToken = '';
      let refreshToken = '';

      if (userData) {
          if (userData.is_blocked) {
              return {
                  status: 400,
                  data: {
                      message: 'You have been blocked by admin!',
                      accessToken: '',
                      refreshToken: ''
                  }
              };
          }

          const passwordMatch = await this.Encrypt.compare(user.password, userData.password);

          if (passwordMatch || userData.is_google) {
              const userId = userData?._id.toHexString();
              if (userId) {
                  accessToken = this.jwtToken.generateAccessToken(userId, 'user');
                  refreshToken = this.jwtToken.generateRefreshToken(userId);
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
                      accessToken: '',
                      refreshToken: ''
                  }
              };
          }
      } else {
          return {
              status: 400,
              data: {
                  message: 'Invalid email or password!',
                  accessToken: '',
                  refreshToken: ''
              }
          };
      }
  } catch (error) {
      console.error('Login failed:', error);

      return {
          status: 500,
          data: {
              message: 'Internal server error',
              accessToken: '',
              refreshToken: ''
          }
      };
  }

  return {
      status: 500,
      data: {
          message: 'Unexpected error',
          accessToken: '',
          refreshToken: ''
      }
  };
}

async saveRefreshToken(id: string | undefined, refreshToken: string | undefined): Promise<{ status: number; data: unknown }> {
  const user = await this.userRepository.updateRefreshToken(id, refreshToken);
  if (user) {
    return {
      status: 200,
      data: user,
    };
  } else {
    return {
      status: 400,
      data: "Failed to add Token",
    };
  }
}

async updateUser(id: string, updateData: Partial<User>): Promise<User | null> {
  return this.userRepository.updateUser(id, updateData);
}
async SingleUser(id: string): Promise<User | null> {
  return this.userRepository.findById(id)
}
async updateWallet(id: string, amount: number): Promise<User | null> {
  return this.userRepository.updateWallet(id,amount);
}
async updateWalletCancel(id: string, amount: number): Promise<User | null> {
  return this.userRepository.updateWalletCancel(id,amount);
}

async addPostToUser(userId: string, postId: Types.ObjectId): Promise<{ status: number; message: string }> {
  try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
          console.error('User not found');
          return { status: 404, message: 'User not found' };
      }

      user.posts.unshift(postId);
      await this.userRepository.updateUser(userId, { posts: user.posts });
      return { status: 200, message: 'Post added successfully' };
  } catch (error) {
      console.error('Error updating user posts:', error);
      return { status: 500, message: 'Error updating user posts' };
  }
}

async singleUserPost(userId: string): Promise<unknown> {
  try {
      return await this.userRepository.singleUserPost(userId);
  } catch (error: unknown) {
      throw new Error('Error fetching user post: ' + (error as Error).message);
  }
}
async removePostFromUser(userId: string, postId: string): Promise<{ status: number; message: string }> {
  try {
      await this.userRepository.removePost(userId, postId);
      return { status: 200, message: 'Post removed successfully' };
  } catch (error) {
      console.error('Error removing post from user:', error);
      return { status: 500, message: 'Error removing post from user' };
  }
}

async getAllPosts(filters: { userid?: string; category?: string; searchPlaceholder?: string; usernotid?: string }): Promise<User[]> {
  try {
      return await this.userRepository.getAllPosts(filters);
  } catch (error) {
      console.error('Failed to fetch posts:', error);
      throw new Error('Failed to fetch posts');
  }
}

async addBookingIdToUser(artistId: string, bookingId: Types.ObjectId): Promise<{ status: number; data: { message: string } }> {
  try {
      await this.userRepository.addBookingIdToUser(artistId, bookingId);
      return {
          status: 200,
          data: { message: 'Booking ID added to user successfully' }
      };
  } catch (error) {
      console.error('Failed to add booking ID to user:', error);
      return {
          status: 500,
          data: { message: 'Failed to add booking ID to user' }
      };
  }
}

async removeBookingIdFromUser(userId: string, bookingId: string): Promise<void> {
  await this.userRepository.pullBookingId(userId, bookingId);
}
async deductFromWallet(userId: string, amount: number): Promise<User | null> {
  const user = await this.userRepository.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  if (user.wallet < amount) {
    return null; 
  }
  const newBalance = user.wallet - amount;
  return this.userRepository.updateWallet(userId, newBalance);
}

async spamUser(userId: Types.ObjectId, spamInfo: { userId: Types.ObjectId, reason: string }): Promise<{ status: number; data: { status: boolean; message: string } }> {
  try {
      const user = await this.userRepository.spamUser(userId, spamInfo);
      return {
          status: 200,
          data: { status: true, message: 'User has been marked as spam.' }
      };
  } catch (error) {
      return {
          status: 500,
          data: { status: false, message: (error as Error).message }
      };
  }
}
async unspamUserUseCase(userId: string,id: string): Promise<User|null>{
  return await this.userRepository.unspamUserRepository(userId,id);
};
async getUserWallet(userId: string): Promise<number> {
  const user = await this.userRepository.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  return user.wallet;
}
async addReceivedReview(userId: string, review: { userId: Types.ObjectId, stars: number, review: string }): Promise<User | null> {
  return this.userRepository.addReceivedReview(userId, review);
}
async removeReceivedReview(userId: string, reviewUserId: string): Promise<User | null> {
  return this.userRepository.removeReceivedReview(userId, reviewUserId);
}
async getUserReviews(userId: string): Promise<User | null> {
  return this.userRepository.getUserReviews(userId);
}

}

export default UserUseCase;
