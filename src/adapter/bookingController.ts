import { Request, Response } from 'express';
import UserUseCase from '../use_case/userUsecases';
import { BookingUseCase } from '../use_case/BookingUseCase';
import { Types } from 'mongoose';

export class BookingController {
  constructor(
    private bookingUseCase: BookingUseCase,
    private userUseCase: UserUseCase
  ) {}

  async checkAvailability(req: Request, res: Response) {
    try {
      const { artistId, startDate, endDate } = req.body;
      const result = await this.bookingUseCase.checkdate(artistId, startDate, endDate);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async makeBookingreq(req: Request, res: Response) {
    try {
      const { artistId, clientId, dates } = req.body;
      
      const booking = await this.bookingUseCase.makeBooking(artistId, clientId, dates);
      const bookingId = new Types.ObjectId();

      await this.userUseCase.addBookingIdToUser(artistId, bookingId);
      res.json(booking);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error'+ (error as Error).message });
    }
  }

  async getBookingsreq(req: Request, res: Response) {
    try {
      const { artistId, len } = req.body;
      if (!artistId) {
        return res.status(400).json({ message: 'artistId is required' });
      }

      const result = await this.bookingUseCase.getBookingsreq(artistId as string, len === 'true');
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
  async getBookingsConfirm(req: Request, res: Response) {
    try {
      const { artistId, len } = req.body;
      if (!artistId) {
        return res.status(400).json({ message: 'artistId is required' });
      }

      const result = await this.bookingUseCase.getBookingsConfirm(artistId as string, len === 'true');
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
