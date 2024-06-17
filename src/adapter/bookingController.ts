import { Request, Response } from 'express';
import IUserUseCase from '../use_case/interface/useCaseInterface/IUserUseCase';
import { IBookingUseCase } from '../use_case/interface/useCaseInterface/IBookingUseCase';
import { Types } from 'mongoose';
import { Booking } from '../Domain/Booking';
import BookingControllerInterface from '../use_case/interface/ControllerInterface/IbookingController';
import Stripe from 'stripe';
import IAuctionUseCase from '../use_case/interface/useCaseInterface/IAuctionUseCase';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';
const stripe = new Stripe(stripeSecretKey, { apiVersion: '2023-10-16' });


export class BookingController implements BookingControllerInterface {
  constructor(
    private bookingUseCase: IBookingUseCase,
    private userUseCase: IUserUseCase,
    private stripe: Stripe,
    private auctionUseCase:IAuctionUseCase
  ) {}

  async checkAvailability(req: Request, res: Response): Promise<void> {
    try {
      const { artistId, startDate, endDate,bookingId } = req.body;
      const result = await this.bookingUseCase.checkdate(artistId, startDate, endDate,bookingId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async makeBookingreq(req: Request, res: Response): Promise<void> {
    try {
      let { artistId, clientId, dates, marked,event,location} = req.body;
      
      const booking = await this.bookingUseCase.makeBooking(artistId, clientId, dates, marked,event,location);
      const bookingId = booking._id

      await this.userUseCase.addBookingIdToUser(artistId, bookingId);
      res.json(booking);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error'+ (error as Error).message });
    }
  }

  async getBookingsreq(req: Request, res: Response): Promise<void> {
    try {
      const { artistId,clientId, len } = req.body;
      // if (!artistId) {
      //   res.status(400).json({ message: 'artistId is required' });
      //   return;
      // }

      const result = await this.bookingUseCase.getBookingsreq(artistId as string, clientId as string);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getBookingsConfirm(req: Request, res: Response): Promise<void> {
    try {
      const { artistId,clientId, len } = req.body;
      // if (!artistId) {
      //   res.status(400).json({ message: 'artistId is required' });
      //   return;
      // }

      const result = await this.bookingUseCase.getBookingsConfirm(artistId as string,clientId as string);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getMarked(req: Request, res: Response): Promise<void> {
    try {
      const { artistId,clientId, len } = req.body;
      // if (!artistId) {
      //   res.status(400).json({ message: 'artistId is required' });
      //   return;
      // }

      const result = await this.bookingUseCase.getMarked(artistId as string,clientId as string);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getSingleBooking(req: Request, res: Response): Promise<void> {
    try {
        const { artistId, clientId } = req.params;
        const booking: Booking | null = await this.bookingUseCase.singleBooking(artistId, clientId);

        if (booking === null) {
            
          res.status(200).json(null);

        } else {
           
            res.status(200).json(booking);
        }
    } catch (error) {
        console.error('Error getting single booking:', error);
        res.status(500).json({ message: 'Failed to get single booking' });
    }
}

async cancelBooking(req: Request, res: Response): Promise<void> {
  try {
    const { bookingId, userId,clientId,amount,status } = req.body;
    if (!bookingId || !userId) {
      res.status(400).json({ message: 'bookingId and userId are required' });
      return;
    }
 
    await this.bookingUseCase.cancelBooking(bookingId, userId);
    await this.userUseCase.removeBookingIdFromUser(userId, bookingId);
    
    if(clientId && status=='booked'){
      await this.userUseCase.updateWalletCancel(clientId,amount);
    }
    res.status(200).json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error: ' + (error as Error).message });
  }
}

async updateBooking(req: Request, res: Response): Promise<void> {
  try {
    const { _id, event, location, date_of_booking,amount } = req.body;

    if (!_id || !event || !location || !date_of_booking ||!amount) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    const updatedBooking = await this.bookingUseCase.updateBooking(
      _id,
      event,
      location,
      date_of_booking,
      'confirmed',
      amount
    );

    res.status(200).json(updatedBooking);
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ message: 'Failed to update booking' });
  }
}
async cancelPaymentReq(req: Request, res: Response): Promise<void> {
  try {
    const { _id } = req.body;

    if (!_id ) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    const updatedBooking = await this.bookingUseCase.cancelPaymentReq(
      _id
    );

    res.status(200).json(updatedBooking);
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ message: 'Failed to update booking' });
  }
}
async createCheckoutSession(req: Request, res: Response): Promise<void> {
  try {
    const { bookingId, amount, artistId, clientId } = req.body;

    
    const successUrl = `http://localhost:5173/artprof/client?id=${artistId}&session_id={CHECKOUT_SESSION_ID}`;
    
    const cancelUrl = `http://localhost:5173/artprof/client?id=${artistId}&session_id={CHECKOUT_SESSION_ID}`;

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: `Booking ID: ${bookingId.toString()}`,
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
        bookingId: bookingId? bookingId.toString() : ''
      },
    });

    res.json({ id: session.id, url: session.url });
  } catch (error) {
    console.error('Error creating Stripe checkout session:', error);
    res.status(500).json({ message: 'Failed to create checkout session' });
  }
}




async handleWebhook(req: Request, res: Response): Promise<void> {
  
  const sig = req.headers['stripe-signature'] as string;
  let event;

  try {
    event = this.stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err) {
    console.error(`Webhook Error: ${(err as Error).message}`);
    res.status(400).send(`Webhook Error: ${(err as Error).message}`);
    return;
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any;
    const metadata = session.metadata 

    const { bookingId,auctionId,addressline,district,state,country,pincode,phonenumber } = metadata;

    console.log('Payment successful for Booking ID:', bookingId);
    if(bookingId){
    await this.bookingUseCase.handleSuccessfulPayment(bookingId);}
    if(auctionId){
      let address={addressline,district,state,country,pincode:parseInt(pincode),phonenumber:parseInt(phonenumber)}
      await this.auctionUseCase.handleSuccessfulPayment(auctionId,address);
    }
  }

  res.json({ received: true });
}

async walletPayment(req: Request, res: Response): Promise<void> {
  try {
    const { bookingId, amount, clientId } = req.body;
    
    if (!bookingId || !amount || !clientId) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }
    
    const updatedWallet = await this.userUseCase.deductFromWallet(clientId, amount);
    if (!updatedWallet) {
      res.status(400).json({ message: 'Insufficient funds in wallet' });
      return;
    }
    
    const updatedBooking = await this.bookingUseCase.updateBookingStatus(bookingId, 'booked');
    res.status(200).json({ message: 'Payment successful and booking updated', updatedBooking });
  } catch (error) {
    console.error('Error processing wallet payment:', error);
    res.status(500).json({ message: 'Failed to process wallet payment' });
  }
}

async findAvailablePeople(req: Request, res: Response): Promise<void> {
  try {
    const { startDate, endDate,category } = req.body;
    if (!startDate || !endDate) {
      res.status(400).json({ message: 'startDate and endDate are required' });
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    const result = await this.bookingUseCase.findAvailablePeople(start, end,category);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error: ' + (error as Error).message });
  }
}

}





