import { ObjectId } from 'mongoose';
import { Document } from 'mongoose';

export interface MessageModelInterface extends Document{
    senderId: ObjectId;
    receiverId: ObjectId;
    message: string;
    createdAt: Date;
    file:string;
    fileType:string;
    
}
