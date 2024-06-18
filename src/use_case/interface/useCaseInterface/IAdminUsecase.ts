import { Admin } from "../../../Domain/Admin";
import { User } from "../../../Domain/userEntity";

interface IAdminUseCase {
  login(email: string, password: string): Promise<{ accessToken: string; refreshToken: string,admin:Admin }>;
  getAllUsers(): Promise<User[]>;
  blockUser(userId: string): Promise<User | null>;
  unblockUser(userId: string): Promise<User | null>;
}

export default IAdminUseCase;
