import { Request, Response } from 'express';
import IMessageUseCase from '../use_case/interface/useCaseInterface/IConvUsecase';
import IMessageController from '../use_case/interface/ControllerInterface/IConvController';

class MessageController implements IMessageController {
    private messageUseCase: IMessageUseCase;

    constructor(messageUseCase: IMessageUseCase) {
        this.messageUseCase = messageUseCase;
    }

    async sendMessage(req: Request, res: Response): Promise<void> {
        try {
            const { senderId, receiverId, message } = req.body;
            const sentMessage = await this.messageUseCase.sendMessage(senderId, receiverId, message);
            res.status(201).json(sentMessage);
        } catch (error) {
            console.error('Error sending message:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getMessages(req: Request, res: Response): Promise<void> {
        try {
            const { senderId, receiverId } = req.params;
            const messages = await this.messageUseCase.getMessages(senderId, receiverId);
            res.status(200).json(messages);
        } catch (error) {
            console.error('Error getting messages:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

export default MessageController;
