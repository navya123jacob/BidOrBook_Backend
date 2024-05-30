import mongoose, {  Schema } from 'mongoose';
import { MessageModelInterface } from '../../Domain/Message';



const MessageSchema = new Schema<MessageModelInterface>({
    senderId: {
        type: Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    receiverId: {
        type: Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    message: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const MessageModel = mongoose.model<MessageModelInterface>('Message', MessageSchema);

export { MessageModel, MessageModelInterface };
