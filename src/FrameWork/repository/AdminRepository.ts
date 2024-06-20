import { Admin } from "../../Domain/Admin";
import { User } from "../../Domain/userEntity";
import { AdminModel } from "../database/AdminModel";
import { UserModel } from "../database/userModel";
import IAdminRepo from "../../use_case/interface/RepositoryInterface/IAdminRepository";
import Encrypt from "../passwordRepository/hashpassword";
import { Types } from "mongoose";

class AdminRepository implements IAdminRepo {
  private encrypt: Encrypt;

  constructor(encrypt: Encrypt) {
    this.encrypt = encrypt;
  }

  async save(admin: Admin) {
    const newAdmin = new AdminModel(admin);
    await newAdmin.save();
    return newAdmin;
  }

  async findById(_id: string): Promise<Admin | null> {
    const admin = await AdminModel.findById(_id);
    return admin;
  }

  async findByEmail(email: string): Promise<Admin | null> {
    const admin = await AdminModel.findOne({ email });
    return admin;
  }

  async findOneAndUpdate(_id: Types.ObjectId | string, update: Partial<Admin>): Promise<Admin | null> {
    const admin = await AdminModel.findOneAndUpdate(
      { _id: new Types.ObjectId(_id) },
      { $set: update },
      { new: true }
    );
    return admin;
  }

  async getAllUsers(): Promise<User[]> {
    return await UserModel.find().populate('spam.userId');

  }

  async blockUser(userId: string): Promise<User | null> {
    const user = await UserModel.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId, 
      { $set: { is_blocked: !user.is_blocked } }, 
      { new: true }
    );
  
    return updatedUser;
  }
  

  async unblockUser(userId: string): Promise<User | null> {
    return await UserModel.findByIdAndUpdate(userId, { is_blocked: false }, { new: true });
  }
  
}

export default AdminRepository;
