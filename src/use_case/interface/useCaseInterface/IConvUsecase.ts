import { MessageModelInterface  as Message }  from "../../../Domain/Message";
import { ObjectId } from "mongoose";
interface IMessageUseCase {
  sendMessage(senderId: ObjectId, receiverId: ObjectId, message: string): Promise<Message>;
  getMessages(senderId: ObjectId, receiverId: ObjectId): Promise<Message[]>;
}

export default IMessageUseCase;
