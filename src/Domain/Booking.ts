import { Document, Types } from "mongoose";
export interface Location {
  district: string;
  state: string;
  country: string;
}
export interface Booking extends Document {
  status: string;
  clientId: Types.ObjectId;
  artistId: Types.ObjectId;
  location: Location;
  event: string;
  payment_method: string;
  payment_date: Date;
  date_of_booking: Date[]; 
}
