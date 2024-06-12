import { IAuction } from "../../../Domain/Auction";

export default interface IAuctionUseCase {
  createAuction(auctionData: IAuction): Promise<IAuction>;
  updateAuctionStatus(): Promise<void>;
  getAllAuctions(userId: string,notId:string): Promise<any[]>;
  deleteAuction(auctionId: string): Promise<void>;
  getAuctionById(auctionId: string): Promise<IAuction | null>;
  placeBid(auctionId: string, userId: string, amount: number): Promise<IAuction>;
  cancelBid(auctionId: string, userId: string): Promise<IAuction>
}
