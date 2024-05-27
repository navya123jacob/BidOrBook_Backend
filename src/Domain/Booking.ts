import {  Document, Types } from "mongoose";


export interface Booking extends Document {
    status: string;
    clientId: Types.ObjectId;
    artistId: Types.ObjectId;
    location: {
      address: string;
      pincode: number;
      state: string;
      district: string;
      country: string;
    };
    event: string;
    payment_method: string;
    payment_date: Date;
    date_of_booking: Date;
  }