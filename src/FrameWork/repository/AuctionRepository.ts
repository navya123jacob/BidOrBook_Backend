import IAuctionRepo from '../../use_case/interface/RepositoryInterface/IAuctionRepo';
import AuctionModel from '../database/auctionModel';
import { IAuction } from '../../Domain/Auction';

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
    }
    
    let query: Query = {};
    
    if (userId!='1') {
      query.userId = userId;
    }else {
      query.userId = { $ne: notId };
  }
    return AuctionModel.find(query).exec();
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
}

export default AuctionRepository;
