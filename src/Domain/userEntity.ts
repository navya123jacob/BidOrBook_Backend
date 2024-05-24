import { Types } from "mongoose";

export interface Address {
    address: string;
    pincode: number;
    state: string;
    district: string;
    country: string;
}

export interface User {
    _id: Types.ObjectId;
    isAdmin: boolean;
    Fname: string;
    Lname: string;
    email: string;
    addresses: Address[];
    phone: number;
    password: string;
    posts: Types.ObjectId[];
    auction: Types.ObjectId[];
    category: 'Photographer' | 'Artist';
    receivedReviews: Types.ObjectId[];
    givenReviews: Types.ObjectId[];
    purchasedItems: Types.ObjectId[];
    bookings: Types.ObjectId[];
    marked: Types.ObjectId[];
    is_verified: boolean;
    is_google: boolean;
    is_blocked: boolean;
    profile: string;
    description: string;
    refreshToken?: string;  
    
}
