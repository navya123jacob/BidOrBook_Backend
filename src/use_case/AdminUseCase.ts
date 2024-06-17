import { Admin } from "../Domain/Admin";
import { User } from "../Domain/userEntity";
import IAdminUseCase from "./interface/useCaseInterface/IAdminUsecase";
import IAdminRepo from "./interface/RepositoryInterface/IAdminRepository";
import Encrypt from "../FrameWork/passwordRepository/hashpassword";
import JWTToken from "../FrameWork/passwordRepository/jwtpassword";

class AdminUseCase implements IAdminUseCase {
  private adminRepo: IAdminRepo;
  private encrypt: Encrypt;
  private jwtToken: JWTToken;

  constructor(adminRepo: IAdminRepo, encrypt: Encrypt, jwtToken: JWTToken) {
    this.adminRepo = adminRepo;
    this.encrypt = encrypt;
    this.jwtToken = jwtToken;
  }

 

  async login(email: string, password: string): Promise<{ accessToken: string; refreshToken: string }> {
    const admin = await this.adminRepo.findByEmail(email);
    if (!admin) {
      throw new Error('Invalid email or password');
    }

    const isMatch = await this.encrypt.compare(password, admin.password);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }
    const adminId = admin?._id.toHexString();
    const accessToken = this.jwtToken.generateAccessToken(adminId, 'admin');
    const refreshToken = this.jwtToken.generateRefreshToken(adminId);

    await this.adminRepo.findOneAndUpdate(adminId, { refreshToken });

    return { accessToken, refreshToken };
  }

  async getAllUsers(): Promise<User[]> {
    return await this.adminRepo.getAllUsers();
  }

  async blockUser(userId: string): Promise<User | null> {
    return await this.adminRepo.blockUser(userId);
  }

  async unblockUser(userId: string): Promise<User | null> {
    return await this.adminRepo.unblockUser(userId);
  }
}

export default AdminUseCase;
