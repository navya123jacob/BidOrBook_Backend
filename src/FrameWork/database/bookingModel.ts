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
  status: { type: String, required: true, enum: ['pending', 'confirmed', 'cancelled'] },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  artistId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  location: { 
    type: addressSchema,
    required: true
  },
  event: { type: String, required: true },
  payment_method: { type: String, required: true },
  payment_date: { type: Date, required: true },
  date_of_booking: { type: Date, default: Date.now }
});

const BookingModel = model<Booking>('Booking', bookingSchema);

export default BookingModel;
