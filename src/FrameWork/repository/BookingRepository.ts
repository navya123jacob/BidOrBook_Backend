import BookingModel from '../database/bookingModel';
import { Booking } from '../../Domain/Booking';
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

  async createBooking(artistId: string, clientId: string, dates: Date[], marked: boolean): Promise<Booking> {
    let booking;
    if (marked) {
      booking = await BookingModel.create({
        artistId,
        clientId,
        date_of_booking: dates,
        status: 'marked'
      });
    } else {
      booking = await BookingModel.create({
        artistId,
        clientId,
        date_of_booking: dates,
        status: 'pending'
      });
    }
    const populatedBooking = await BookingModel.findById(booking._id).populate('clientId').exec();
    return populatedBooking as Booking;
  }

  async getBookingsByArtistId(artistId: string): Promise<Booking[]> {
    try {
      const bookings = await BookingModel.find({ artistId, status: 'pending' }).populate('clientId').exec();
      return bookings;
    } catch (error) {
      console.error('Error getting bookings by artist ID:', error);
      throw new Error('Failed to get bookings');
    }
  }

  async getBookingsByArtistIdConfirm(artistId: string): Promise<Booking[]> {
    try {
      const bookings = await BookingModel.find({ artistId, status: 'confirmed' }).populate('clientId').exec();
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

  
}

export default BookingRepository;
