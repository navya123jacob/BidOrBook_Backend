import { MessageModelInterface as Message } from "../Domain/Message";
import IMessageRepository from "./interface/RepositoryInterface/IconvRepo";
import IMessageUseCase from "./interface/useCaseInterface/IConvUsecase";
import { ObjectId } from 'mongoose';
class MessageUseCase implements IMessageUseCase {
    private messageRepository: IMessageRepository;

    constructor(messageRepository: IMessageRepository) {
        this.messageRepository = messageRepository;
    }

    async sendMessage(senderId: ObjectId, receiverId: ObjectId, message: string): Promise<Message> {
        try {
          const sentMessage = await this.messageRepository.sendMessage(senderId, receiverId, message);
          return sentMessage;
        } catch (error) {
          throw new Error('Failed to send message: ' + (error as Error).message);
        }
      }
      
      


    async getMessages(senderId: ObjectId, receiverId: ObjectId): Promise<Message[]> {
        try {
            const messages = await this.messageRepository.getMessages(senderId, receiverId);
            return messages;
        } catch (error) {
            throw new Error('Failed to get messages: ' + (error as Error).message);
        }
    }
}

export default MessageUseCase;
