import { MessageModelInterface as Message } from "../database/Message";
import { MessageModel } from "../database/Message";
class MessageRepository {
    async sendMessage(senderId: string, receiverId: string, message: string): Promise<Message> {
        const newMessage = new MessageModel({
            senderId,
            receiverId,
            message,
            createdAt: new Date(),
        });
        await newMessage.save();
        return newMessage;
    }

    async getMessages(senderId: string, receiverId: string): Promise<Message[]> {
        return await MessageModel.find({ senderId, receiverId }).sort({ createdAt: 'asc' }).exec();
    }
}

export default MessageRepository;
