import BookingModel from '../database/bookingModel';
import { Booking } from '../../Domain/Booking';

export class BookingRepository {
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


  async createBooking(artistId: string, clientId: string, dates: Date[]): Promise<Booking> {
    
    const booking = await BookingModel.create({
      artistId,
      clientId,
      date_of_booking: dates,
      status: 'pending'
    });
  
    return booking;
  }

  async getBookingsByArtistId(artistId: string): Promise<Booking[]> {
    try {
      const bookings = await BookingModel.find({ artistId,status:'pending' }).exec();
      return bookings;
    } catch (error) {
      console.error('Error getting bookings by artist ID:', error);
      throw new Error('Failed to get bookings');
    }
  }
  async getBookingsByArtistIdConfirm(artistId: string): Promise<Booking[]> {
    try {
      const bookings = await BookingModel.find({ artistId,status:'confirmed' }).exec();
      return bookings;
    } catch (error) {
      console.error('Error getting bookings by artist ID:', error);
      throw new Error('Failed to get bookings');
    }
  }
  }
