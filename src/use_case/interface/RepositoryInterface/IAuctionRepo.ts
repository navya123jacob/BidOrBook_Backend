import { IAuction } from "../../../Domain/Auction";

export default interface IAuctionRepo {
  create(auctionData: IAuction): Promise<IAuction>;
  updateStatusToInactive(): Promise<void>;
  getAllAuctions(userId: string,notId:string): Promise<any[]>;
  deleteAuction(auctionId: string): Promise<void>;
  findById(auctionId: string): Promise<IAuction | null>;
  placeBid(auctionId: string, userId: string, amount: number): Promise<IAuction>;
  cancelBid(auctionId: string, userId: string): Promise<IAuction >

}
