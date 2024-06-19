import BookingModel from '../database/bookingModel';
import { Booking, Location } from '../../Domain/Booking';
import IBookingRepository from '../../use_case/interface/RepositoryInterface/IbookingRepo';
import { User } from '../../Domain/userEntity';
import { UserModel } from '../database/userModel';
import { Types } from 'mongoose';

 class BookingRepository implements IBookingRepository {
  async findByArtistIdAndDateRange(artistId: string, startDate: Date, endDate: Date, bookingId: string): Promise<Date[]> {
    try {
      const query: any = {
        artistId: artistId,
        status: 'booked',
        date_of_booking: { $elemMatch: { $gte: startDate, $lte: endDate } }
      };
      
      if (bookingId) {
        query._id = { $ne: bookingId };
      }
      
      const bookings = await BookingModel.find(query).exec();
      
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
        location,
        amount:0,
        payment_method:'',
        
      });
    } else {
      booking = await BookingModel.create({
        artistId,
        clientId,
        date_of_booking: dates,
        status: 'pending',
        event,
        location,
        amount:0,
        payment_method:'',
      });
    }
    const populatedBooking = await BookingModel.findById(booking._id).populate('clientId').exec();
    return populatedBooking as Booking;
  }

  async getBookingsByArtistId(artistId: string,clientId:string): Promise<Booking[]> {
    try {let bookings;
      if(artistId){
       bookings = await BookingModel.find({
        artistId,
        status: { $in: ['pending', 'confirmed'] }
      }).populate('clientId').exec();}
      else{
        bookings = await BookingModel.find({
          clientId,
          status: { $in: ['pending', 'confirmed'] }
        }).populate('artistId').exec();
      }
      
      return bookings;
    } catch (error) {
      console.error('Error getting bookings by artist ID:', error);
      throw new Error('Failed to get bookings');
    }
  }

  async getBookingsByArtistIdConfirm(artistId: string,clientId:string): Promise<Booking[]> {
    try {let bookings;
      if(artistId){
       bookings = await BookingModel.find({ artistId, status: 'booked' }).populate('clientId').exec();}
       else{
        bookings = await BookingModel.find({ clientId, status: 'booked' }).populate('artistId').exec();}
      return bookings;
    } catch (error) {
      console.error('Error getting bookings by artist ID:', error);
      throw new Error('Failed to get bookings');
    }
  }

  async getBookingsByArtistIdMarked(artistId: string,clientId:string): Promise<Booking[]> {
    try {let bookings;
      if(artistId){
       bookings = await BookingModel.find({ artistId, status: 'marked' }).populate('clientId').exec();}
       else{
        bookings = await BookingModel.find({ clientId, status: 'marked' }).populate('artistId').exec();}
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
   
    const updatedBooking = await BookingModel.findByIdAndUpdate(booking._id, booking, { new: true }).exec();
    if (!updatedBooking) {
      throw new Error('Booking not found');
    }
    return updatedBooking;
  }
  async updateBookingStatus(bookingId: string, status: string): Promise<Booking> {
    try {
      const updatedBooking = await BookingModel.findByIdAndUpdate(
        bookingId,
        { status,payment_method:'wallet' },
        { new: true }
      ).exec();

      if (!updatedBooking) {
        throw new Error('Booking not found');
      }

      return updatedBooking as Booking;
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw new Error('Failed to update booking status');
    }
  }
  async findAvailablePeopleByDateRange(startDate: Date, endDate: Date,category:string,usernotid:string): Promise<User[]> {
    try {
      const userNotObjectId = new Types.ObjectId(usernotid);
      const bookings = await BookingModel.find({
        status: 'booked',
        date_of_booking: {
          $elemMatch: {
            $gte: startDate,
            $lte: endDate
          }
        }
      }).select('artistId');
  
      const bookedArtistIds = bookings.map(booking => booking.artistId);
  
      const availableArtists = await UserModel.aggregate([
        {
          $match: {
            _id: { $nin: bookedArtistIds, $ne: userNotObjectId },
            category,
            posts: { $exists: true, $ne: [] } 
          }
        },
        {
          $lookup: {
            from: 'posts', 
            localField: 'posts',
            foreignField: '_id',
            as: 'posts'
          }
        },
        {
          $match: {
            'posts.0': { $exists: true } 
          }
        }
      ]);
  
      return availableArtists;
    } catch (error) {
      console.error('Error finding available people by date range:', error);
      throw new Error('Failed to find available people');
    }
}

}
export default BookingRepository
