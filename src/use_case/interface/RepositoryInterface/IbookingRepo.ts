import { Booking } from "../../../Domain/Booking";

interface IBookingRepository {
  findByArtistIdAndDateRange(artistId: string, startDate: Date, endDate: Date): Promise<Date[]>;
  createBooking(artistId: string, clientId: string, dates: Date[], marked: boolean): Promise<Booking>;
  getBookingsByArtistId(artistId: string): Promise<Booking[]>;
  getBookingsByArtistIdConfirm(artistId: string): Promise<Booking[]>;
  getBookingsByArtistIdMarked(artistId: string): Promise<Booking[]>;
}

export default IBookingRepository;
