import BookingModel from '../database/bookingModel';
import { Booking } from '../../Domain/Booking';

export class BookingRepository {
    async findByArtistIdAndDateRange(artistId: string, startDate: Date, endDate: Date): Promise<Date[]> {
      const bookings = await BookingModel.find({
        artistId: artistId,
        date_of_booking: { $gte: startDate, $lte: endDate }
      }).exec();
      console.log(bookings)
      // Extract the date_of_booking values from the retrieved bookings
      const datesOfBookings = bookings.length?bookings.map(booking => booking.date_of_booking):[];
  
      return datesOfBookings;
    }
  }
