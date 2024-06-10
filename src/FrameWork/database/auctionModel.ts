import mongoose, { Schema,  Model, model } from 'mongoose';
import { IAuction } from '../../Domain/Auction';


const auctionSchema = new Schema< IAuction>({
  name:{type:String},
  description:{type:String},
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  image: { type: String, required: true },
  bids: { 
    userId:{type: String}, amount:{type:Number}},
  startingdate: { type: Date, default: Date.now, required: true },
  endingdate: { type: Date, required: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active', required: true },
  initial:{type:Number}
});


auctionSchema.pre('save', function (next) {
  const auction = this as  IAuction;
  if (new Date() > auction.endingdate) {
    auction.status = 'inactive';
  }
  next();
});


auctionSchema.methods.updateStatus = async function () {
  if (new Date() > this.endingdate && this.status === 'active') {
    this.status = 'inactive';
    await this.save();
  }
};

const AuctionModel: Model< IAuction> = model< IAuction>('Auction', auctionSchema);

export default AuctionModel;
