import IBookingRepository from "./interface/RepositoryInterface/IbookingRepo";
import { IBookingUseCase } from "./interface/useCaseInterface/IBookingUseCase";
import { Booking, Location } from "../Domain/Booking";

export class BookingUseCase implements IBookingUseCase {
    constructor(private bookingRepository: IBookingRepository,
      
    ) {}

    async checkdate(artistId: string, startDate: Date, endDate: Date): Promise<Date[]> {
        const bookings = await this.bookingRepository.findByArtistIdAndDateRange(artistId, startDate, endDate);
        return bookings;
    }

    async makeBooking(artistId: string, clientId: string, dates: Date[], marked: boolean,event:string,location:Location): Promise<Booking> {
        const booking = await this.bookingRepository.createBooking(artistId, clientId, dates, marked,event,location);
        return booking;
    }

    async getBookingsreq(artistId: string, len: boolean): Promise<{ length: number } | { bookings: Booking[] }> {
        const bookings = await this.bookingRepository.getBookingsByArtistId(artistId);
        if (len) {
            return { length: bookings.length };
        }
        return { bookings };
    }

    async getBookingsConfirm(artistId: string, len: boolean): Promise<{ length: number } | { bookings: Booking[] }> {
        const bookings = await this.bookingRepository.getBookingsByArtistIdConfirm(artistId);
        if (len) {
            return { length: bookings.length };
        }
        return { bookings };
    }

    async getMarked(artistId: string, len: boolean): Promise<{ length: number } | { bookings: Booking[] }> {
        const bookings = await this.bookingRepository.getBookingsByArtistIdMarked(artistId);
        if (len) {
            return { length: bookings.length };
        }
        return { bookings };
    }

    async singleBooking(artistId: string,clientId: string): Promise<Booking|null> { 
        try {
          const booking = await this.bookingRepository.singleBooking(artistId,clientId);
         return booking
        } catch (error) {
          throw new Error('Failed to add booking ID to user: ' + (error as Error).message);
        }
      }
      async cancelBooking(bookingId: string, userId: string): Promise<void> {
        await this.bookingRepository.deleteBooking(bookingId);
       
      }

      async updateBooking(_id: string,event: string, location: Location,date_of_booking: Date[],status: string): Promise<Booking> {
        return this.bookingRepository.updateBooking(_id, event, location, date_of_booking, status);
    }
      async cancelPaymentReq(_id: string): Promise<Booking> {
        return this.bookingRepository.cancelPaymentReq(_id);
    }

}
