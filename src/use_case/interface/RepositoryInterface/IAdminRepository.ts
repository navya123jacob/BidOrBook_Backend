import { Admin } from "../../../Domain/Admin";
import { User } from "../../../Domain/userEntity";

interface IAdminRepo {
  save(admin: Admin): Promise<Admin>;
  findById(_id: string): Promise<Admin | null>;
  findByEmail(email: string): Promise<Admin | null>;
  findOneAndUpdate(_id: string, update: Partial<Admin>): Promise<Admin | null>;
  getAllUsers(): Promise<User[]>;
  blockUser(userId: string): Promise<User | null>;
  unblockUser(userId: string): Promise<User | null>;
  getAdminDetails(): Promise<Admin | null>
}

export default IAdminRepo;
