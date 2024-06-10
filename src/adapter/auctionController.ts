import { Request, Response } from 'express';
import IAuctionUseCase from '../use_case/interface/useCaseInterface/IAuctionUseCase';
import IAuctionController from '../use_case/interface/ControllerInterface/IauctionController';
import { cloudinary } from '../FrameWork/utils/CloudinaryConfig';
class AuctionController implements IAuctionController {
  private auctionUseCase: IAuctionUseCase;

  constructor(auctionUseCase: IAuctionUseCase) {
    this.auctionUseCase = auctionUseCase;
  }

  async createAuction(req: Request, res: Response): Promise<void> {
    try {
      
      const {name,description, userId, initial,  endingdate } = req.body;
      const auctionData: any = {
        name,
        description,
        userId,
        endingdate,
        initial:parseInt(initial)
      };

      if (req.file) {
        try {
          const result = await cloudinary.uploader.upload(req.file.path);
          auctionData.image = result.secure_url;
        } catch (error) {
          console.error('Cloudinary upload error:', error);
          res.status(400).json({ error: 'Failed to upload image to Cloudinary' });
          return;
        }
      }

      const createdAuction = await this.auctionUseCase.createAuction(auctionData);
      res.status(201).json({ message: 'Auction created successfully', auction: createdAuction });
    } catch (error) {
      console.error('Error creating auction:', error);
      res.status(500).json({ error: 'Failed to create auction' });
    }
  }

  async updateAuctionStatus(req: Request, res: Response): Promise<void> {
    try {
      await this.auctionUseCase.updateAuctionStatus();
      res.status(200).json({ message: 'Auction statuses updated' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update auction statuses' });
    }
  }

  async getAllAuctions(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const auctions = await this.auctionUseCase.getAllAuctions(userId);
      res.status(200).json({ auctions });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }

  async deleteAuction(req: Request, res: Response): Promise<void> {
    try {
        const auctionId = req.params.id;;
      
      
      const auction = await this.auctionUseCase.getAuctionById(auctionId);

      if (!auction) {
        res.status(404).json({ message: 'Auction not found' });
        return;
      }

      if (auction.image) {
        const imageUrlParts = auction.image.split('/');
        const publicId = imageUrlParts[imageUrlParts.length - 1].split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      }

      await this.auctionUseCase.deleteAuction(auctionId);
      res.status(200).json({ message: 'Auction deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }

  async placeBid(req: Request, res: Response): Promise<void> {
    try {
      const { auctionId, amount, userId } = req.body;
      
      if (isNaN(amount) || amount <= 0) {
        res.status(400).json({ error: 'Invalid bid amount' });
        return;
      }

      const auction = await this.auctionUseCase.getAuctionById(auctionId);
      if (!auction) {
        res.status(404).json({ error: 'Auction not found' });
        return;
      }

      if (auction.bids.length === 0 && amount <= auction.initial) {
        res.status(400).json({ error: 'Bid amount must be greater than the initial bid' });
        return;
      } else if (auction.bids.length > 0 && amount <= auction.bids[auction.bids.length - 1].amount) {
        res.status(400).json({ error: 'Bid amount must be greater than the last bid amount' });
        return;
      }

      const updatedAuction = await this.auctionUseCase.placeBid(auctionId, userId, amount);
      res.status(200).json({ message: 'Bid placed successfully', auction: updatedAuction });
    } catch (error) {
      console.error('Error placing bid:', error);
      res.status(500).json({ error: 'Failed to place bid' });
    }
  }
  async cancelBid(req: Request, res: Response): Promise<void> {
    try {
      const { auctionId, userId } = req.body;
      const updatedAuction = await this.auctionUseCase.cancelBid(auctionId, userId);
      res.status(200).json(updatedAuction);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }
}

export default AuctionController;
