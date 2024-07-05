import { MessageModelInterface  as Message }  from "../../../Domain/Message";
import { ObjectId,Types } from "mongoose";
import { User } from "../../../Domain/userEntity";
interface IMessageUseCase {
  sendMessage(senderId: ObjectId, receiverId: ObjectId, message: string, file: string | null, fileType: string | null): Promise<Message>
  getMessages(senderId: ObjectId, receiverId: ObjectId): Promise<Message[]>;
  getUserChats(userId: Types.ObjectId): Promise<{ userId: User, messages: Message[] }[]>
}

export default IMessageUseCase;
