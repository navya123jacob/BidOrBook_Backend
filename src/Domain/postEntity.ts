import { Schema, Types } from 'mongoose';

export interface Post {
    _id: Types.ObjectId;
  userid: Types.ObjectId;
  name: string;
  description: string;
  image: string;
}
