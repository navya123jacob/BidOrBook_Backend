import { BookingRepository } from "../FrameWork/repository/BookingRepository";

export class BookingUseCase {
    constructor(private bookingRepository: BookingRepository) {}

    async checkdate(artistId: string, startDate: Date, endDate: Date) {
      const bookings = await this.bookingRepository.findByArtistIdAndDateRange(artistId, startDate, endDate);
      return bookings
    }

    async makeBooking(artistId: string, clientId: string, startDate: Date[]) {
      const booking = await this.bookingRepository.createBooking(artistId, clientId, startDate);
      return booking;
    }
  }
