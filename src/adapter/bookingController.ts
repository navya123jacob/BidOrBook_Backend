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
      const { artistId, clientId, startDate } = req.body;
      
      const booking = await this.bookingUseCase.makeBooking(artistId, clientId, startDate);
      const bookingId = new Types.ObjectId();

      await this.userUseCase.addBookingIdToUser(artistId, bookingId);
      res.json(booking);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error'+ (error as Error).message });
    }
  }
}
