import { Request, Response } from 'express';

export default interface IAuctionController {
  createAuction(req: Request, res: Response): Promise<void>;
  updateAuctionStatus(req: Request, res: Response): Promise<void>;
  getAllAuctions(req: Request, res: Response): Promise<void>;
  deleteAuction(req: Request, res: Response): Promise<void>;
  placeBid(req: Request, res: Response): Promise<void>;
  cancelBid(req: Request, res: Response): Promise<void>;
  createCheckoutSessionAuction(req: Request, res: Response): Promise<void>;
  walletPaymentAuction(req: Request, res: Response): Promise<void>;
  getAuctionsByBidder(req: Request, res: Response): Promise<void> 

}
