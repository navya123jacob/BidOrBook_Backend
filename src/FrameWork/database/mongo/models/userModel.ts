import mongoose,{ Document,Model, Schema, Types } from "mongoose";
import { Iuser } from "../../../../Entity/userEntity";
const userSchema :Schema<Iuser>= new mongoose.Schema({
    isAdmin: Boolean,
    Fname: String,
    Lname: String,
    email: String,
    addresses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Address' }],
    phone: Number,
    password: String,
    client: Boolean,
    artist: Boolean,
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    auction:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Auction'}],
    category: { type: String, enum: ['photographers', 'artists'] },
    receivedReviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    givenReviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    purchasedItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PurchasedItem' }],
    bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }],
    marked: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  });

  const userModel:Model<Iuser> = mongoose.model('User',userSchema)
export default userModel