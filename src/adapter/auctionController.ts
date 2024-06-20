import { Request, Response } from 'express';
import IAuctionUseCase from '../use_case/interface/useCaseInterface/IAuctionUseCase';
import IAuctionController from '../use_case/interface/ControllerInterface/IauctionController';
import { cloudinary } from '../FrameWork/utils/CloudinaryConfig';
import { Server } from 'socket.io';
import { io } from '..';
import Stripe from 'stripe';
import IUserUseCase from '../use_case/interface/useCaseInterface/IUserUseCase';
import PdfService from '../FrameWork/utils/Invoice'
const pdfService = PdfService;
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';
const stripe = new Stripe(stripeSecretKey, { apiVersion: '2023-10-16' });

class AuctionController implements IAuctionController {
  private auctionUseCase: IAuctionUseCase;
  
  constructor(auctionUseCase: IAuctionUseCase,private stripe: Stripe, private userUseCase: IUserUseCase,) {
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
        initial:parseInt(initial),
        paymentmethod:'',
        payment:'pending',
        address: {
          addressline: '',
          district: '',
          state: '',
          country: '',
          pincode: 0,
          phonenumber:0,
        },
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
      const notId = req.query.notId as string || '';
      const auctions = await this.auctionUseCase.getAllAuctions(userId,notId);
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

      if (!auctionId || !userId || isNaN(amount) || amount <= 0) {
        res.status(400).json({ error: 'Invalid input' });
        return;
      }

      const auction = await this.auctionUseCase.getAuctionById(auctionId);
      if (!auction) {
        res.status(404).json({ error: 'Auction not found' });
        return;
      }

      const lastBidAmount = auction.bids.length > 0 ? auction.bids[auction.bids.length - 1].amount : auction.initial;
      if (amount <= lastBidAmount) {
        res.status(400).json({ error: `Bid amount must be greater than ${lastBidAmount}` });
        return;
      }

      const updatedAuction = await this.auctionUseCase.placeBid(auctionId, userId, amount);

      io.to(`auction_${auctionId}`).emit('new_bid', { auctionId, userId, amount });

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

      io.to(`auction_${auctionId}`).emit('cancel_bid', { auctionId, userId });

      res.status(200).json(updatedAuction);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }
  async createCheckoutSessionAuction(req: Request, res: Response): Promise<void> {
    try {
      const { auctionId, amount, artistId, clientId,address } = req.body;
  console.log(address)
      
      const successUrl = `http://localhost:5173/artpho/auction?id=${artistId}&session_id={CHECKOUT_SESSION_ID}`;
      
      const cancelUrl = `http://localhost:5173/artpho/auction?id=${artistId}&session_id={CHECKOUT_SESSION_ID}`;
  
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'inr',
              product_data: {
                name: `Auction ID: ${auctionId.toString()}`,
              },
              unit_amount: amount * 100,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          auctionId: auctionId? auctionId.toString() : '',
          addressline: address.addressline || '',
        district: address.district || '',
        state: address.state || '',
        country: address.country || '',
        pincode: address.pincode ? address.pincode : '',
        phonenumber: address.phonenumber ? address.phonenumber : '',

        },
      });
  
      res.json({ id: session.id, url: session.url });
    } catch (error) {
      console.error('Error creating Stripe checkout session:', error);
      res.status(500).json({ message: 'Failed to create checkout session' });
    }
  }

  async walletPaymentAuction(req: Request, res: Response): Promise<void> {
    try {
      const { auctionId, amount, clientId ,address} = req.body;
      
      if (!auctionId || !amount || !clientId) {
        res.status(400).json({ message: 'Missing required fields' });
        return;
      }
      
      const updatedWallet = await this.userUseCase.deductFromWallet(clientId, amount);
      if (!updatedWallet) {
        res.status(400).json({ message: 'Insufficient funds in wallet' });
        return;
      }
      
      const updatedAuction = await this.auctionUseCase.updateAuctionWallet(auctionId,address);
      
      // await pdfService.generateAndDownloadInvoice(updatedAuction, res);
      res.status(200).json({ message: 'Payment successful and auction updated', updatedAuction });
    } catch (error) {
      console.error('Error processing wallet payment:', error);
      res.status(500).json({ message: 'Failed to process wallet payment' });
    }
  }

  async getAuctionsByBidder(req: Request, res: Response): Promise<void> {
    try {
      const { clientId } = req.body;

      if (!clientId) {
        res.status(400).json({ error: 'ClientId is required' });
        return;
      }

      const auctions = await this.auctionUseCase.getAuctionsByBidder(clientId);
      res.status(200).json({ auctions });
    } catch (error) {
      console.error('Error fetching auctions by bidder:', error);
      res.status(500).json({ error: 'Failed to fetch auctions' });
    }
  }
  async addSpam(req: Request, res: Response): Promise<void> {
    try {
      const { auctionId, userId, reason } = req.body;
  
      if (!auctionId || !userId || !reason) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }
  
      const updatedAuction = await this.auctionUseCase.addSpam(auctionId, userId, reason);
  
      res.status(200).json({ message: 'Spam reported successfully', auction: updatedAuction });
    } catch (error) {
      console.error('Error reporting spam:', error);
      res.status(500).json({ error: 'Failed to report spam' });
    }
  }
  async removeSpam(req: Request, res: Response): Promise<void> {
    try {
      const { auctionId, userId } = req.body;
  
      if (!auctionId || !userId) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }
  
      const updatedAuction = await this.auctionUseCase.removeSpam(auctionId, userId);
  
      res.status(200).json({ message: 'Spam removed successfully', auction: updatedAuction });
    } catch (error) {
      console.error('Error removing spam:', error);
      res.status(500).json({ error: 'Failed to remove spam' });
    }
  }
  
  async getAllAuctionsWithUserDetails(req: Request, res: Response): Promise<void> {
    try {
      const auctions = await this.auctionUseCase.getAllAuctionsWithUserDetails();
      res.status(200).json({ auctions });
    } catch (error) {
      console.error('Error fetching auctions with user details:', error);
      res.status(500).json({ error: 'Failed to fetch auctions' });
    }
  }
  
  
}

export default AuctionController;
