import { User } from "../../../Domain/userEntity";
import { ObjectId, Types } from "mongoose";

interface IUserRepo {
    save(user: User): Promise<User>;
    findById(_id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findOneAndUpdate(_id: Types.ObjectId | string, update: Partial<User>): Promise<User | null>;
    updateRefreshToken(_id: any, refreshToken: any): Promise<User | null>;
    updateUser(id: string, userData: Partial<User>): Promise<User | null>;
    getAllPosts(filters: { userid?: string; category?: string; usernotid?: string; searchPlaceholder?: string }): Promise<any>;
    singleUserPost(userId: string): Promise<any>;
    removePost(userId: string, postId: string): Promise<void>;
    addBookingIdToUser(artistId: string, bookingId: Types.ObjectId): Promise<void>;
}

export default IUserRepo;
