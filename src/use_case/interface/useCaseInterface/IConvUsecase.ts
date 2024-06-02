import { MessageModelInterface  as Message }  from "../../../Domain/Message";

interface IMessageUseCase {
  sendMessage(senderId: string, receiverId: string, message: string): Promise<Message>;
  getMessages(senderId: string, receiverId: string): Promise<Message[]>;
}

export default IMessageUseCase;
