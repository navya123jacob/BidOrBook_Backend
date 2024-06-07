import mongoose, { Schema, model, Document, Types } from "mongoose";
import { Booking } from "../../Domain/Booking";

const bookingSchema = new Schema<Booking>({
  status: { type: String, required: true, enum: ['pending', 'confirmed','marked','booked'],default:'pending' },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  artistId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  location: {
    district: { type: String},
    state: { type: String},
    country: {type: String},
  },
  event: { type: String},
  payment_method: { type: String },
  payment_date: { type: Date },
  date_of_booking: { type: [Date] } ,
  amount:{ type: Number }
});

const BookingModel = model<Booking>('Booking', bookingSchema);

export default BookingModel;
