import { Request, Response } from 'express';
import { BookingUseCase } from '../use_case/BookingUseCase';

export class BookingController {
  constructor(private bookingUseCase: BookingUseCase) {}

  async checkAvailability(req: Request, res: Response) {
    try {
      const { artistId, startDate, endDate } = req.body;
      const result = await this.bookingUseCase.execute(artistId, startDate, endDate);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
