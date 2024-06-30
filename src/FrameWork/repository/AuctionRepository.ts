import IAuctionRepo from '../../use_case/interface/RepositoryInterface/IAuctionRepo';
import AuctionModel from '../database/auctionModel';
import { Address, IAuction } from '../../Domain/Auction';
import PdfService from '../utils/Invoice'
const pdfService = PdfService;
class AuctionRepository implements IAuctionRepo {
  async create(auctionData: IAuction): Promise<IAuction> {
    const auction = new AuctionModel(auctionData);
    return await auction.save();
  }

  async updateStatusToInactive(): Promise<void> {
    const now = new Date();
    await AuctionModel.updateMany({ endingdate: { $lt: now }, status: 'active' }, { status: 'inactive' });
  }
  async getAllAuctions(userId: string,notId:string): Promise<any[]> {
    interface Query {
      userId?: string | { $ne: string };
      status?:string
    }
    
    let query: Query = {};
    
    if (userId!='1') {
      query.userId = userId;
      
      
    }else {
      query.userId = { $ne: notId };
      query.status='active'
  }
  return AuctionModel.find(query)
  .sort({ endingDate: -1 }) 
  .exec();
  }

  async deleteAuction(auctionId: string): Promise<void> {
    await AuctionModel.deleteOne({ _id: auctionId }).exec();
  }
  async findById(auctionId: string): Promise<IAuction | null> {
    return AuctionModel.findById(auctionId).exec();
  }

  async placeBid(auctionId: string, userId: string, amount: number): Promise<IAuction> {
    const bid = {
      userId,
      amount,
    };

    const auction = await AuctionModel.findByIdAndUpdate(
      auctionId,
      { $push: { bids: bid } },
      { new: true } 
    ).exec();

    if (!auction) {
      throw new Error('Auction not found');
    }

    return auction;
  }

  async cancelBid(auctionId: string, userId: string): Promise<IAuction> {
    const auction = await AuctionModel.findByIdAndUpdate(
      auctionId,
      { $pull: { bids: { userId } } },
      { new: true }
    ).exec();

    if (!auction) {
      throw new Error('Auction not found');
    }

    return auction;
  }
  async updateAuctionStripe(auction:IAuction): Promise<IAuction> {
   
    const updatedAuction = await AuctionModel.findByIdAndUpdate(auction._id,auction, { new: true }).exec();
    if (!updatedAuction) {
      throw new Error('Booking not found');
    }
    return updatedAuction;
  }

  async updateAuctionWallet(auctionId: string,address:Address): Promise<IAuction> {
    try {
      const updatedAuction = await AuctionModel.findByIdAndUpdate(
        auctionId,
        { paymentmethod:'wallet',payment:'paid',address,payment_date:Date.now() },
        { new: true }
      ).exec();

      if (!updatedAuction) {
        throw new Error('Auction not found');
      }
      
      return updatedAuction as IAuction;
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw new Error('Failed to update booking status');
    }
  }
  async getAuctionsByBidder(clientId: string): Promise<IAuction[]> {
    return AuctionModel.find({ 'bids.userId': clientId }) .sort({ endingdate: -1 }).exec();
  }
  
  async addSpam(auctionId: string, userId: string, reason: string): Promise<IAuction | null> {
    const spam = { userId, reason };
    const updatedAuction = await AuctionModel.findByIdAndUpdate(
      auctionId,
      { $push: { spam: spam } },
      { new: true }
    ).exec();
  
    if (!updatedAuction) {
      throw new Error('Auction not found');
    }
  
    return updatedAuction;
  }
  async removeSpam(auctionId: string, userId: string): Promise<IAuction | null> {
    const updatedAuction = await AuctionModel.findByIdAndUpdate(
      auctionId,
      { $pull: { spam: { userId } } },
      { new: true }
    ).exec();
  
    if (!updatedAuction) {
      throw new Error('Auction not found');
    }
  
    return updatedAuction;
  }
  async getAllAuctionsWithUserDetails(): Promise<IAuction[]> {
    return await AuctionModel.find()
      .populate('userId') 
      .populate({
        path: 'bids.userId', 
        model: 'User', 
      })
      .populate({
        path: 'spam.userId', 
        model: 'User', 
      })
      .exec();
  }
  
  
  
}

export default AuctionRepository;
