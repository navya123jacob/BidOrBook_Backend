import IAuctionUseCase from './interface/useCaseInterface/IAuctionUseCase';
import IAuctionRepo from './interface/RepositoryInterface/IAuctionRepo';
import { IAuction } from '../Domain/Auction';

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
  async getAllAuctions(userId: string): Promise<any[]> {
    return this.auctionRepo.getAllAuctions(userId);
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
}

export default AuctionUseCase;
