import IAuctionUseCase from './interface/useCaseInterface/IAuctionUseCase';
import IAuctionRepo from './interface/RepositoryInterface/IAuctionRepo';
import { Address, IAuction } from '../Domain/Auction';

class AuctionUseCase implements IAuctionUseCase {
  private auctionRepo: IAuctionRepo;

  constructor(auctionRepo: IAuctionRepo) {
    this.auctionRepo = auctionRepo;
  }

  async createAuction(auctionData: IAuction): Promise<IAuction> {
    return await this.auctionRepo.create(auctionData);
  }

  async updateAuctionStatus(): Promise<void> {
    await this.auctionRepo.updateStatusToInactive();
  }
  async getAllAuctions(userId: string,notId:string): Promise<any[]> {
    return this.auctionRepo.getAllAuctions(userId,notId);
  }

  async deleteAuction(auctionId: string): Promise<void> {
    return this.auctionRepo.deleteAuction(auctionId);
  }
  async getAuctionById(auctionId: string): Promise<IAuction | null> {
    return await this.auctionRepo.findById(auctionId);
  }

  async placeBid(auctionId: string, userId: string, amount: number): Promise<IAuction> {
    return await this.auctionRepo.placeBid(auctionId, userId, amount);
  }
  async cancelBid(auctionId: string, userId: string): Promise<IAuction> {
    return this.auctionRepo.cancelBid(auctionId, userId);
  }
  async handleSuccessfulPayment(auctionId: string,address:Address): Promise<void> {
    const auction = await this.auctionRepo.findById(auctionId);
    if (!auction) {
      throw new Error('Auction not found ');
    }

    auction.payment = 'paid'; 
    auction.paymentmethod='stripe'
    auction.address=address
    await this.auctionRepo.updateAuctionStripe(auction);
  }
  async updateAuctionWallet(AuctionId: string,address:Address): Promise<IAuction> {
    return this.auctionRepo.updateAuctionWallet(AuctionId,address);
  }
  async getAuctionsByBidder(clientId: string): Promise<IAuction[]> {
    return await this.auctionRepo.getAuctionsByBidder(clientId);
  }
  async addSpam(auctionId: string, userId: string, reason: string): Promise<IAuction | null> {
    return await this.auctionRepo.addSpam(auctionId, userId, reason);
  }
  async removeSpam(auctionId: string, userId: string): Promise<IAuction | null> {
    return await this.auctionRepo.removeSpam(auctionId, userId);
  }
  async getAllAuctionsWithUserDetails(): Promise<IAuction[]> {
    return await this.auctionRepo.getAllAuctionsWithUserDetails();
  }
  
  
  
}

export default AuctionUseCase;
