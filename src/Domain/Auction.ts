import { Document, Types } from 'mongoose';
export interface Spam {
  userId: Types.ObjectId;
  reason: string;
}
export interface Address{
  addressline: string;
  district: string;
  state: string;
  country: string;
  pincode: number;
  phonenumber: number;
}
export interface IAuction extends Document {
  name: string;
  description: string;
  userId: Types.ObjectId;
  image: string;
  bids: { userId: Types.ObjectId; amount: number }[];
  startingdate: Date;
  endingdate: Date;
  status: 'active' | 'inactive';
  initial: number;
  paymentmethod: 'wallet' | 'stripe' | '';
  payment: 'pending' | 'paid';
  address: {
    addressline: string;
    district: string;
    state: string;
    country: string;
    pincode: number;
    phonenumber: number;
    
  };
  spam:Spam[];
}
