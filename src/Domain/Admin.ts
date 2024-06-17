import { Types } from "mongoose";
export interface Admin {
    _id: Types.ObjectId;
    email: string;
    password: string;
    isAdmin: boolean;
    refreshToken?: string;
  }
  