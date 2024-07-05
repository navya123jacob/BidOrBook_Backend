import { Admin } from "../Domain/Admin";
import { User } from "../Domain/userEntity";
import IAdminUseCase from "./interface/useCaseInterface/IAdminUsecase";
import IAdminRepo from "./interface/RepositoryInterface/IAdminRepository";
import Encrypt from "../FrameWork/passwordRepository/hashpassword";
import AdminJWTToken from "../FrameWork/passwordRepository/adminjwtpassword";
import { cloudinary } from "../FrameWork/utils/CloudinaryConfig";
import { IEvent } from "../Domain/Event";

class AdminUseCase implements IAdminUseCase {
  private adminRepo: IAdminRepo;
  private encrypt: Encrypt;
  private jwtToken: AdminJWTToken;

  constructor(adminRepo: IAdminRepo, encrypt: Encrypt, jwtToken: AdminJWTToken) {
    this.adminRepo = adminRepo;
    this.encrypt = encrypt;
    this.jwtToken = jwtToken;
  }

 

  async login(email: string, password: string): Promise<{ accessToken: string; refreshToken: string,admin:Admin }> {
    const admin = await this.adminRepo.findByEmail(email);
    if (!admin) {
      throw new Error('Invalid email or password');
    }
    if(!admin.isAdmin){
      throw new Error('Not Admin');
    }

    const isMatch = await this.encrypt.compare(password, admin.password);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }
    const adminId = admin?._id.toHexString();
    const accessToken = this.jwtToken.generateAccessToken(adminId, 'admin');
    const refreshToken = this.jwtToken.generateRefreshToken(adminId);

    await this.adminRepo.findOneAndUpdate(adminId, { refreshToken });

    return { accessToken, refreshToken,admin };
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
  async updateAdmin(_id: string, updateData: Partial<Admin>): Promise<Admin | null> {
    return await this.adminRepo.findOneAndUpdate(_id, updateData);
  }
  async getAdminDetails(): Promise<Admin | null> {
    return await this.adminRepo.getAdminDetails();
  }
  async getEvents(type: 'photographer' | 'artist'): Promise<IEvent[]> {
    return await this.adminRepo.getEvents(type);
  }

  async deleteEvent(eventId: string): Promise<void> {
    return await this.adminRepo.deleteEvent(eventId);
  }
  async createEvent(event: IEvent): Promise<IEvent> {
    return await this.adminRepo.createEvent(event);
  }
  
}

export default AdminUseCase;
