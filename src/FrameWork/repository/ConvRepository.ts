import { MessageModelInterface as Message } from "../database/Message";
import { MessageModel } from "../database/Message";
import IMessageRepository from "../../use_case/interface/RepositoryInterface/IconvRepo";
import { Types, ObjectId } from "mongoose";
import { UserModel } from "../database/userModel";
import { User } from "../../Domain/userEntity";

interface PopulatedChat {
  userId: User;
  messages: Message[];
}

class MessageRepository implements IMessageRepository {
  async sendMessage(senderId: ObjectId, receiverId: ObjectId, message: string, file: string | null, fileType: string | null): Promise<Message> {
    const newMessage = new MessageModel({
      senderId,
      receiverId,
      message,
      file,
      fileType,
      createdAt: new Date(),
    });
    await newMessage.save();
    return newMessage;
  }

  async getMessages(senderId: ObjectId, receiverId: ObjectId): Promise<Message[]> {
    return await MessageModel.find({ senderId, receiverId }).sort({ createdAt: 'asc' }).exec();
  }

  async getUserChats(userId: Types.ObjectId): Promise<PopulatedChat[]> {
    const messages = await MessageModel.find({
      $or: [{ senderId: userId }, { receiverId: userId }]
    }).sort({ createdAt: 'asc' }).exec();
  
    const userChats: { [key: string]: Message[] } = {};
  
    messages.forEach(message => {
      const otherUserId = (String(message.senderId) === String(userId)) ? String(message.receiverId) : String(message.senderId);
      if (!userChats[otherUserId]) {
        userChats[otherUserId] = [];
      }
      userChats[otherUserId].push(message);
    });
  
    const populatedUserChats: any = (await Promise.all(Object.entries(userChats).map(async ([key, value]) => {
      const user = await UserModel.findById(key).exec();
      if (user) {
        return { userId: user, messages: value };
      }
      return null;
    }))).filter((chat) => chat !== null);
  
    populatedUserChats.sort((a: PopulatedChat, b: PopulatedChat) => {
      const lastMessageA = a.messages[a.messages.length - 1].createdAt;
      const lastMessageB = b.messages[b.messages.length - 1].createdAt;
      return new Date(lastMessageB).getTime() - new Date(lastMessageA).getTime();
    });
  
    return populatedUserChats;
  }
}

export default MessageRepository;
