import BookingModel from '../database/bookingModel';
import { Booking, Location } from '../../Domain/Booking';
import IBookingRepository from '../../use_case/interface/RepositoryInterface/IbookingRepo';

export class BookingRepository implements IBookingRepository {
  async findByArtistIdAndDateRange(artistId: string, startDate: Date, endDate: Date): Promise<Date[]> {
    try {
      const bookings = await BookingModel.find({
        artistId: artistId,
        date_of_booking: { $elemMatch: { $gte: startDate, $lte: endDate } }
      }).exec();
      
      const datesOfBookings: Date[] = bookings.flatMap(booking => booking.date_of_booking);
      return datesOfBookings;
    } catch (error) {
      console.error('Error finding bookings by artist ID and date range:', error);
      throw new Error('Failed to find bookings');
    }
  }

  async createBooking(artistId: string, clientId: string, dates: Date[], marked: boolean,event:string,location:Location): Promise<Booking> {
    let booking;
    if (marked) {
      booking = await BookingModel.create({
        artistId,
        clientId,
        date_of_booking: dates,
        status: 'marked',
        event,
        location
      });
    } else {
      booking = await BookingModel.create({
        artistId,
        clientId,
        date_of_booking: dates,
        status: 'pending',
        event,
        location
      });
    }
    const populatedBooking = await BookingModel.findById(booking._id).populate('clientId').exec();
    return populatedBooking as Booking;
  }

  async getBookingsByArtistId(artistId: string): Promise<Booking[]> {
    try {
      const bookings = await BookingModel.find({
        artistId,
        status: { $in: ['pending', 'confirmed'] }
      }).populate('clientId').exec();
      
      return bookings;
    } catch (error) {
      console.error('Error getting bookings by artist ID:', error);
      throw new Error('Failed to get bookings');
    }
  }

  async getBookingsByArtistIdConfirm(artistId: string): Promise<Booking[]> {
    try {
      const bookings = await BookingModel.find({ artistId, status: 'booked' }).populate('clientId').exec();
      return bookings;
    } catch (error) {
      console.error('Error getting bookings by artist ID:', error);
      throw new Error('Failed to get bookings');
    }
  }

  async getBookingsByArtistIdMarked(artistId: string): Promise<Booking[]> {
    try {
      const bookings = await BookingModel.find({ artistId, status: 'marked' }).populate('clientId').exec();
      return bookings;
    } catch (error) {
      console.error('Error getting bookings by artist ID:', error);
      throw new Error('Failed to get bookings');
    }
  }

  async singleBooking(artistId: string, clientId: string): Promise<Booking|null> {
    try {
      const booking = await BookingModel.findOne({ artistId, clientId }).populate('clientId').exec();
      
      return booking;
    } catch (error) {
      throw new Error('Failed to add booking ID to user: ' + (error as Error).message);
    }
  }

  async deleteBooking(bookingId: string): Promise<void> {
    try {
      await BookingModel.findByIdAndDelete({_id:bookingId}).exec();
    } catch (error) {
      console.error('Error deleting booking:', error);
      throw new Error('Failed to delete booking');
    }
  }

  async updateBooking(
    _id: string,
    event: string,
    location: Location,
    date_of_booking: Date[],
    status: string,
    amount:number
  ): Promise<Booking> {
    try {
      const updatedBooking = await BookingModel.findByIdAndUpdate(
        _id,
        { event, location, date_of_booking, status,amount },
        { new: true }
      ).populate('clientId').exec();

      if (!updatedBooking) {
        throw new Error('Booking not found');
      }

      return updatedBooking as Booking;
    } catch (error) {
      console.error('Error updating booking:', error);
      throw new Error('Failed to update booking');
    }
  }

  async cancelPaymentReq(_id: string): Promise<Booking> {
    try {
      const updatedBooking = await BookingModel.findByIdAndUpdate(
        _id,
        {  status:'pending',amount:0 },
        { new: true }
      ).populate('clientId').exec();

      if (!updatedBooking) {
        throw new Error('Booking not found');
      }

      return updatedBooking as Booking;
    } catch (error) {
      console.error('Error updating booking:', error);
      throw new Error('Failed to update booking');
    }
  }

  async findBySessionId(bookingId: string): Promise<Booking | null> {
    return BookingModel.findOne({ _id: bookingId }).exec();
  }

  async updateBookingStripe(booking: Booking): Promise<Booking> {
    console.log(booking)
    const updatedBooking = await BookingModel.findByIdAndUpdate(booking._id, booking, { new: true }).exec();
    if (!updatedBooking) {
      throw new Error('Booking not found');
    }
    return updatedBooking;
  }
}

export default BookingRepository;
