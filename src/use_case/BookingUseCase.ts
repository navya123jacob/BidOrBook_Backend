import { BookingRepository } from "../FrameWork/repository/BookingRepository";

export class BookingUseCase {
    constructor(private bookingRepository: BookingRepository) {}

    async execute(artistId: string, startDate: Date, endDate: Date) {
      const bookings = await this.bookingRepository.findByArtistIdAndDateRange(artistId, startDate, endDate);
      return bookings
    }
  }
