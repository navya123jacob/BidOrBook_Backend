import { User } from "../../Domain/userEntity";
import { Post } from "../../Domain/postEntity";
import { UserModel } from "../database/userModel";
import IUserRepo from "../../use_case/interface/RepositoryInterface/IuserRepo";
import Encrypt from "../passwordRepository/hashpassword";
import { PostModel } from "../database/postModel";
import { Types } from "mongoose";
import mongoose, { ObjectId } from 'mongoose';

class UserRepository implements IUserRepo {
  private encrypt: Encrypt;

  constructor(encrypt: Encrypt) {
    this.encrypt = encrypt;
  }

  async save(user: User){
    const newUser = new UserModel(user);
    await newUser.save();
    return newUser;
  }

  async findById(_id: string): Promise<User | null> {
    const user = await UserModel.findById(_id);
    return user;
  }
  
  async findByEmail(email: string): Promise<User | null> {
    const user = await UserModel.findOne({ email });
    return user;
  }

  
async findOneAndUpdate(_id: Types.ObjectId | string, update: Partial<User>): Promise<User | null> {
  const user = await UserModel.findOneAndUpdate(
      { _id: new Types.ObjectId(_id) },
      { $set: update },
      { new: true }
  );
  return user;
}


  async newUser(user: User){
    const hashedPass = await this.encrypt.generateHash(user.password);
    const newUser = { ...user, is_verified: true, password: hashedPass };
    await this.save(newUser); 
    return {
      status: 200,
      data: { status: true, message: 'Registration successful!' }
    };
  }

  async updateRefreshToken(_id: any, refreshToken: any): Promise<User | null> {
    const update = { refreshToken }; 
    const user = await UserModel.findOneAndUpdate(
      { _id },
      { $set: update },
      { new: true }
    );
    return user;
  }

  async updateUser(id: string, userData: Partial<User>) {
    return await UserModel.findByIdAndUpdate(id, userData, { new: true });
  }

  async updateWallet(id: string, amount: number): Promise<User | null> {
    

    return await UserModel.findOneAndUpdate(
        { _id: id },
        { $set: { wallet: amount } },
        { new: true }
    ).exec();
}
  async updateWalletCancel(id: string, amount: number): Promise<User | null> {
    const user = await UserModel.findById(id).exec();
    if (!user) {
        throw new Error("User not found");
    }

    const newWalletAmount = user.wallet + amount;

    return await UserModel.findOneAndUpdate(
        { _id: id },
        { $set: { wallet: newWalletAmount } },
        { new: true }
    ).exec();
}



  async getAllPosts(filters: { userid?: string; category?: string; usernotid?: string;searchPlaceholder?: string}): Promise<any> {
    try {
      const query: any = {is_blocked:false};
      
      if (filters.category) {
        query.category = filters.category;
        query._id = { $ne: filters.usernotid };
        if (filters.searchPlaceholder) {
          const words = filters.searchPlaceholder.trim().split(/\s+/); 
          const firstName = words[0];
          const lastName = words.slice(1).join(' ').trim(); 
        
          const firstNameRegex = new RegExp(firstName, 'i');
          const lastNameRegex = new RegExp(lastName, 'i');
        
          const conditions = words.map(word => (
            {
              $or: [
                { $regexMatch: { input: { $trim: { input: '$Fname' } }, regex: new RegExp(word, 'i') } }, // Search in Fname
                { $regexMatch: { input: { $trim: { input: '$Lname' } }, regex: new RegExp(word, 'i') } }, // Search in Lname
                { $regexMatch: { input: { $trim: { input: '$location.district' } }, regex: new RegExp(word, 'i') } }, // Search in district
                { $regexMatch: { input: { $trim: { input: '$location.state' } }, regex: new RegExp(word, 'i') } }, // Search in state
                { $regexMatch: { input: { $trim: { input: '$location.country' } }, regex: new RegExp(word, 'i') } }  // Search in country
              ]
            }
          ));
        
          query.$expr = { $and: conditions };
        }
        
        const usersWithPosts = await UserModel.find(query).populate({
          path: 'posts',
          match: { is_blocked: false } 
        }).exec();
        const filteredUsers = usersWithPosts.filter(user => user.posts.length > 0);
  
        return filteredUsers;
      } else if (filters.userid) {
        query.userid = filters.userid;
  
        const userWithPosts = await PostModel.find(query).exec();
      
        if (!userWithPosts) {
          return [];
        }
  
        return userWithPosts;
      } else {
        return [];
      }
    } catch (error) {
      throw new Error('Failed to fetch posts');
    }
  }

  async singleUserPost(userId: string): Promise<any> {
    try {
      return await UserModel.findOne({ _id: userId }).populate('posts').exec();
    } catch (error:any) {
      throw new Error('Error fetching user post: ' + error.message);
    }
  }


  async removePost(userId: string, postId: string): Promise<void> {
    try {
      await UserModel.findByIdAndUpdate(userId, { $pull: { posts: postId } });
    } catch (error:any) {
      throw new Error('Error removing post from user: ' + error.message);
    }
  }

  async addBookingIdToUser(artistId: string, bookingId: Types.ObjectId) { 
    try {
      const user = await UserModel.findById(artistId);
      if (user) {
        user.bookings.push(bookingId);
        await user.save();
      } else {
        throw new Error('User not found');
      }
    } catch (error) {
      throw new Error('Failed to add booking ID to user: ' + (error as Error).message);
    }
  }

  async pullBookingId(userId: string, bookingId: string): Promise<void> {
    try {

      await UserModel.findByIdAndUpdate(
        { _id: userId },
        {
          $pull: { bookings: bookingId }
        }
      ).exec();
    } catch (error) {
      console.error('Error removing booking ID from user:', error);
      throw new Error('Failed to remove booking ID from user');
    }
  }
  async spamUser(userId: Types.ObjectId, spamInfo: { userId: Types.ObjectId, reason: string }): Promise<User | null> {
    const user = await UserModel.findById(userId);
    if (user) {
        user.spam.push(spamInfo);
        await user.save();
        return user;
    } else {
        throw new Error('User not found');
    }
}

async  unspamUserRepository (userId: string,id:string): Promise<User|null> {
  const user = await UserModel.findById(id);
  if (!user) {
    return user
  }

  if (user.spam) {
    user.spam = user.spam.filter(s => s.userId.toString() !== userId);
    await user.save();
  }
  return user;
};
async addReceivedReview(userId: string, review: { userId: Types.ObjectId, stars: number, review: string }): Promise<User | null> {
  const user = await UserModel.findById(userId);
  
  if (user) {
    user.receivedReviews.push(review);
    await user.save();
    return user;
  } else {
    throw new Error('User not found');
  }
}
async removeReceivedReview(userId: string, reviewUserId: string): Promise<User | null> {
  const user = await UserModel.findById(userId);

  if (user) {
    user.receivedReviews = user.receivedReviews.filter(review => {return review.userId.toString() !== reviewUserId});
    await user.save();
    return user;
  } else {
    throw new Error('User not found');
  }
}
async getUserReviews(userId: string): Promise<User | null> {
  const user = await UserModel.findById(userId).populate('receivedReviews.userId');
  if (user) {
    return user;
  } else {
    throw new Error('User not found');
  }
}

  
}

export default UserRepository;
