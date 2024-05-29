import { BookingRepository } from "../FrameWork/repository/BookingRepository";

export class BookingUseCase {
    constructor(private bookingRepository: BookingRepository) {}

    async checkdate(artistId: string, startDate: Date, endDate: Date) {
      const bookings = await this.bookingRepository.findByArtistIdAndDateRange(artistId, startDate, endDate);
      return bookings
    }

    async makeBooking(artistId: string, clientId: string, dates: Date[]) {
      const booking = await this.bookingRepository.createBooking(artistId, clientId, dates);
      return booking;
    }

    async getBookingsreq(artistId: string, len: boolean) {
      const bookings = await this.bookingRepository.getBookingsByArtistId(artistId);
      if (len) {
        return { length: bookings.length };
      }
      return { bookings };
    }
    async getBookingsConfirm(artistId: string, len: boolean) {
      const bookings = await this.bookingRepository.getBookingsByArtistIdConfirm(artistId);
      if (len) {
        return { length: bookings.length };
      }
      return { bookings };
    }
  }
