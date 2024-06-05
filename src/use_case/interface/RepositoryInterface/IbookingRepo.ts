import { Booking, Location } from "../../../Domain/Booking";

interface IBookingRepository {
  findByArtistIdAndDateRange(artistId: string, startDate: Date, endDate: Date): Promise<Date[]>;
  createBooking(artistId: string, clientId: string, dates: Date[], marked: boolean,event:string,location:Location): Promise<Booking>;
  getBookingsByArtistId(artistId: string): Promise<Booking[]>;
  getBookingsByArtistIdConfirm(artistId: string): Promise<Booking[]>;
  getBookingsByArtistIdMarked(artistId: string): Promise<Booking[]>;
  singleBooking(artistId: string,clientId: string): Promise<Booking|null>;
  deleteBooking(bookingId: string): Promise<void>;
  updateBooking( _id: string,event: string,location: Location,date_of_booking: Date[],status: string): Promise<Booking>;
}

export default IBookingRepository;
