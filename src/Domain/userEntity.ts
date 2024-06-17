import { Types } from "mongoose";

export interface Location {
    
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
    location: Location;
    phone: number;
    password: string;
    posts: Types.ObjectId[];
    auction: Types.ObjectId[];
    category: 'Photographer' | 'Artist';
    receivedReviews: Types.ObjectId[];
    givenReviews: Types.ObjectId[];
    purchasedItems: Types.ObjectId[];
    bookings: Types.ObjectId[];
    is_verified: boolean;
    is_google: boolean;
    is_blocked: boolean;
    profile: string;
    description: string;
    refreshToken?: string;  
    wallet:number
    
}
