import mongoose, { Schema, model, Document, Types } from "mongoose";
import { Booking } from "../../Domain/Booking";

const addressSchema = new Schema({
  address: { type: String, required: true },
  pincode: { type: Number, required: true },
  state: { type: String, required: true },
  district: { type: String, required: true },
  country: { type: String, required: true }
});

const bookingSchema = new Schema<Booking>({
  status: { type: String, required: true, enum: ['pending', 'confirmed','marked'],default:'pending' },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  artistId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  location: { 
    type: addressSchema,
    
  },
  event: { type: String},
  payment_method: { type: String },
  payment_date: { type: Date },
  date_of_booking: { type: [Date] } 
});

const BookingModel = model<Booking>('Booking', bookingSchema);

export default BookingModel;
