import { User } from "../../Domain/userEntity";
import { UserModel } from "../database/userModel";
import IUserRepo from "../../use_case/interface/userRepo";
import Encrypt from "../passwordRepository/hashpassword";

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
    const user = await UserModel.findById({ _id });
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await UserModel.findOne({ email });
    return user;
  }

  async newUser(user: User){
    const hashedPass = await this.encrypt.generateHash(user.password);
    const newUser = { ...user, is_verified: true, password: hashedPass };
    await this.save(newUser); // Using the save method of the UserRepository class
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

}

export default UserRepository;
