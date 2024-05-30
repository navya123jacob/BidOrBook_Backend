import { MessageModelInterface as Message} from "../Domain/Message";
import MessageRepository from "../FrameWork/repository/ConvRepository";

class MessageUseCase {
    private messageRepository: MessageRepository;

    constructor(messageRepository: MessageRepository) {
        this.messageRepository = messageRepository;
    }

    async sendMessage(senderId: string, receiverId: string, message: string): Promise<Message> {
       
        return await this.messageRepository.sendMessage(senderId, receiverId, message);
    }

    async getMessages(senderId: string, receiverId: string): Promise<Message[]> {
        return await this.messageRepository.getMessages(senderId, receiverId);
    }
}

export default MessageUseCase;
