import { Address, IAuction } from "../../../Domain/Auction";

export default interface IAuctionUseCase {
  createAuction(auctionData: IAuction): Promise<IAuction>;
  updateAuctionStatus(): Promise<void>;
  getAllAuctions(userId: string,notId:string): Promise<any[]>;
  deleteAuction(auctionId: string): Promise<void>;
  getAuctionById(auctionId: string): Promise<IAuction | null>;
  placeBid(auctionId: string, userId: string, amount: number): Promise<IAuction>;
  cancelBid(auctionId: string, userId: string): Promise<IAuction>;
  handleSuccessfulPayment(auctionId: string,address:Address): Promise<void>;
  updateAuctionWallet(AuctionId: string,address:Address): Promise<IAuction>;
  getAuctionsByBidder(clientId: string): Promise<IAuction[]>;
  addSpam(auctionId: string, userId: string, reason: string): Promise<IAuction | null>;
  removeSpam(auctionId: string, userId: string): Promise<IAuction | null>;
  getAllAuctionsWithUserDetails(): Promise<IAuction[]>;
}
