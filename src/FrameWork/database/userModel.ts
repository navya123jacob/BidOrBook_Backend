import mongoose, { Document, Model, Schema } from "mongoose";
import { User } from "../../Domain/userEntity";

const userSchema: Schema<User & Document> = new mongoose.Schema({
    isAdmin: { type: Boolean, default: false },
    Fname: { type: String, required: true },
    Lname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    location: { 
        state: { type: String, default:'' },
        district: { type: String, default:'' },
        country: { type: String, default:''}
    },  
    phone: { type: Number, default: 0 },
    password: { type: String, default: "" },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post', default: [] }],
    auction: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Auction', default: [] }],
    category: { type: String, enum: ['Photographer', 'Artist'], default: "Photographer" },
    receivedReviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review', default: [] }],
    givenReviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review', default: [] }],
    purchasedItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PurchasedItem', default: [] }],
    bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking', default: [] }],
    is_verified: { type: Boolean, default: false },
    is_google: { type: Boolean, default: false },
    is_blocked: { type: Boolean, default: false },
    profile: {
        type: String,
        default: 'https://res.cloudinary.com/dvgwqkegd/image/upload/v1715854222/dummy_profile_ozs8gh.jpg'
    },
    description: { type: String, default: "" },
    refreshToken: { type: String, default: "" },
    wallet: { type: Number, default: 0 },
    spam: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        reason: { type: String, required: true }
    }]
});

const UserModel: Model<User & Document> = mongoose.model<User & Document>('User', userSchema);

export { UserModel };
