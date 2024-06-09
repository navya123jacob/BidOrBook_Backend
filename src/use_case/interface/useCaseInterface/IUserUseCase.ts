import { User } from "../../../Domain/userEntity";
import { Types, ObjectId } from "mongoose";

interface IUserUseCase {
  signup(user: User): Promise<{ status: number; data: { status: boolean; message: string } }>;
  resetPass1(email: string): Promise<{ status: number; data: { state: boolean; data?: User; message: string } }>;
  updatePass(email: string, newPassword: string): Promise<{ status: number; data: { message: string } } | { status: number; data: User; message: string }>;
  newUser(user: User): Promise<{ status: number; data: { status: boolean; message: string } }>;
  login(user: User): Promise<{ status: number; data: { message: string; accessToken: string; refreshToken: string } } | { status: number; data: { message: User; accessToken: string; refreshToken: string } }>;
  saveRefreshToken(id: string | undefined, refreshToken: string | undefined): Promise<{ status: number; data: any }>;
  updateUser(id: string, updateData: Partial<User>): Promise<User | null>;
  addPostToUser(userId: string, postId: Types.ObjectId): Promise<{ status: number; message: string }>
  getAllPosts(filters: { userid?: string; category?: string; searchPlaceholder?: string; usernotid?: string }): Promise<User[]>;
  singleUserPost(userId: string): Promise<any>;
 removePostFromUser(userId: string, postId: string): Promise<{ status: number; message: string }>;
addBookingIdToUser(artistId: string, bookingId: Types.ObjectId): Promise<{ status: number; data: { message: string } }>;
removeBookingIdFromUser(userId: string, bookingId: string): Promise<void>;
updateWallet(id: string, amount: number): Promise<User | null>;
deductFromWallet(userId: string, amount: number): Promise<User | null>;
updateWalletCancel(id: string, amount: number): Promise<User | null>
}

export default IUserUseCase;
