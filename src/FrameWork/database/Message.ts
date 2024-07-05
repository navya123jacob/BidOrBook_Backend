import mongoose, { Schema } from 'mongoose';
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
        required: false
    },
    file: {
        type: String,
        required: false
    },
    fileType: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const MessageModel = mongoose.model<MessageModelInterface>('Message', MessageSchema);

export { MessageModel, MessageModelInterface };
