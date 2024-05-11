import { Types } from "mongoose";
export interface User  {
    _id: Types.ObjectId;
    isAdmin: boolean;
    Fname: string;
    Lname: string;
    email: string;
    addresses: Types.ObjectId[];
    phone: number;
    password: string;
    client: boolean;
    artist: boolean;
    posts: Types.ObjectId[];
    auction: Types.ObjectId[];
    category: 'photographers' | 'artists';
    receivedReviews: Types.ObjectId[];
    givenReviews: Types.ObjectId[];
    purchasedItems: Types.ObjectId[];
    bookings: Types.ObjectId[];
    marked: Types.ObjectId[];
    is_verified:boolean;
    is_google:boolean;
    is_blocked:boolean
}