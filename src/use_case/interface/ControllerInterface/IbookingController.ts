import { Request, Response } from 'express';

interface BookingControllerInterface {
  checkAvailability(req: Request, res: Response): Promise<void>;
  makeBookingreq(req: Request, res: Response): Promise<void>;
  getBookingsreq(req: Request, res: Response): Promise<void>;
  getBookingsConfirm(req: Request, res: Response): Promise<void>;
  getMarked(req: Request, res: Response): Promise<void>;
  getSingleBooking(req: Request, res: Response): Promise<void>;
  cancelBooking(req: Request, res: Response): Promise<void>;
  updateBooking(req: Request, res: Response): Promise<void>;
  cancelPaymentReq(req: Request, res: Response): Promise<void>;
  handleWebhook(req: Request, res: Response): Promise<void>;
  createCheckoutSession(req: Request, res: Response): Promise<void>;
}

export default BookingControllerInterface;
