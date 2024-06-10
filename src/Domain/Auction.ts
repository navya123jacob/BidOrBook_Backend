import { Document, Types } from 'mongoose';

export interface IAuction extends Document {
  name:string;
  description:string;
  userId: Types.ObjectId;
  image: string;
  bids: { userId: Types.ObjectId; amount: number }[];
  startingdate: Date;
  endingdate: Date;
  status: 'active' | 'inactive';
  initial: number;
}
