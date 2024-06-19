import { Schema, Types } from 'mongoose';
export interface Spam {
  userId: Types.ObjectId;
  reason: string;
}
export interface Post {
    _id: Types.ObjectId;
  userid: Types.ObjectId;
  name: string;
  description: string;
  image: string;
  spam:Spam[];
  is_blocked:boolean
}
