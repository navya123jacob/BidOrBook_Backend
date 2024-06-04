import { Request, Response } from 'express';
import IUserUseCase from '../use_case/interface/useCaseInterface/IUserUseCase';
import { IBookingUseCase } from '../use_case/interface/useCaseInterface/IBookingUseCase';
import { Types } from 'mongoose';
import { Booking } from '../Domain/Booking';
import BookingControllerInterface from '../use_case/interface/ControllerInterface/IbookingController';

export class BookingController implements BookingControllerInterface {
  constructor(
    private bookingUseCase: IBookingUseCase,
    private userUseCase: IUserUseCase
  ) {}

  async checkAvailability(req: Request, res: Response): Promise<void> {
    try {
      const { artistId, startDate, endDate } = req.body;
      const result = await this.bookingUseCase.checkdate(artistId, startDate, endDate);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async makeBookingreq(req: Request, res: Response): Promise<void> {
    try {
      let { artistId, clientId, dates, marked } = req.body;
      
      const booking = await this.bookingUseCase.makeBooking(artistId, clientId, dates, marked);
      const bookingId = booking._id

      await this.userUseCase.addBookingIdToUser(artistId, bookingId);
      res.json(booking);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error'+ (error as Error).message });
    }
  }

  async getBookingsreq(req: Request, res: Response): Promise<void> {
    try {
      const { artistId, len } = req.body;
      if (!artistId) {
        res.status(400).json({ message: 'artistId is required' });
        return;
      }

      const result = await this.bookingUseCase.getBookingsreq(artistId as string, len === 'true');
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getBookingsConfirm(req: Request, res: Response): Promise<void> {
    try {
      const { artistId, len } = req.body;
      if (!artistId) {
        res.status(400).json({ message: 'artistId is required' });
        return;
      }

      const result = await this.bookingUseCase.getBookingsConfirm(artistId as string, len === 'true');
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getMarked(req: Request, res: Response): Promise<void> {
    try {
      const { artistId, len } = req.body;
      if (!artistId) {
        res.status(400).json({ message: 'artistId is required' });
        return;
      }

      const result = await this.bookingUseCase.getMarked(artistId as string, len === 'true');
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
            
            res.status(404).json({ message: 'Booking not found' });
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
    const { bookingId, userId } = req.body;
    if (!bookingId || !userId) {
      res.status(400).json({ message: 'bookingId and userId are required' });
      return;
    }

    await this.bookingUseCase.cancelBooking(bookingId, userId);
    await this.userUseCase.removeBookingIdFromUser(userId, bookingId);
    res.status(200).json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error: ' + (error as Error).message });
  }
}


}
