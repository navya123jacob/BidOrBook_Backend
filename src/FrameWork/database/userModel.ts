import mongoose, { Document, Model, Schema } from "mongoose";
import { User } from "../../Domain/userEntity";

const userSchema: Schema<User> = new mongoose.Schema({
    isAdmin: { type: Boolean, default: false },
    Fname: String,
    Lname: String,
    email: String,
    addresses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Address', default: [] }],
    phone: { type: Number, default: 0 },
    password: { type: String, default: "" },
    client: { type: Boolean, default: false },
    artist: { type: Boolean, default: false },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post', default: [] }],
    auction: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Auction', default: [] }],
    category: { type: String, enum: ['photographers', 'artists'], default: "photographers" },
    receivedReviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review', default: [] }],
    givenReviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review', default: [] }],
    purchasedItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PurchasedItem', default: [] }],
    bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking', default: [] }],
    marked: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],
    is_verified: { type: Boolean, default: false },
    is_google: { type: Boolean, default: false },
    is_blocked: { type: Boolean, default: false }
});

const UserModel: Model<User> = mongoose.model('User', userSchema);

export { UserModel };
