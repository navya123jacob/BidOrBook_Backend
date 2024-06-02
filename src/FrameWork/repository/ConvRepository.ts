import { MessageModelInterface as Message } from "../database/Message";
import { MessageModel } from "../database/Message";
import IMessageRepository from "../../use_case/interface/RepositoryInterface/IconvRepo";
import { ObjectId } from "mongoose";
class MessageRepository implements IMessageRepository {
    async sendMessage(senderId: ObjectId, receiverId: ObjectId, message: string): Promise<Message> {
        
        const newMessage = new MessageModel({
          senderId,
          receiverId,
          message,
          createdAt: new Date(),
        });
        await newMessage.save();
        return newMessage;
      }
      
      

    async getMessages(senderId: ObjectId, receiverId: ObjectId): Promise<Message[]> {
       
        return await MessageModel.find({ senderId, receiverId }).sort({ createdAt: 'asc' }).exec();
    }
}

export default MessageRepository;
