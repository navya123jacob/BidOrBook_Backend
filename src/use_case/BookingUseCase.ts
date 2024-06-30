import IBookingRepository from "./interface/RepositoryInterface/IbookingRepo";
import { IBookingUseCase } from "./interface/useCaseInterface/IBookingUseCase";
import { Booking, Location } from "../Domain/Booking";
import { User } from "../Domain/userEntity";

export class BookingUseCase implements IBookingUseCase {
    constructor(private bookingRepository: IBookingRepository,
      
    ) {}

    async checkdate(artistId: string, startDate: Date, endDate: Date,bookingId:string): Promise<Date[]> {
        const bookings = await this.bookingRepository.findByArtistIdAndDateRange(artistId, startDate, endDate,bookingId);
        return bookings;
    }

    async makeBooking(artistId: string, clientId: string, dates: Date[], marked: boolean,event:string,location:Location): Promise<Booking> {
        const booking = await this.bookingRepository.createBooking(artistId, clientId, dates, marked,event,location);
        return booking;
    }

    async getBookingsreq(artistId: string,clientId:string): Promise< { bookings: Booking[] }> {
        const bookings = await this.bookingRepository.getBookingsByArtistId(artistId,clientId);
        
        return { bookings };
    }

    async getBookingsConfirm(artistId: string,clientId:string): Promise< { bookings: Booking[] }> {
        const bookings = await this.bookingRepository.getBookingsByArtistIdConfirm(artistId,clientId);
       
        return { bookings };
    }

    async getMarked(artistId: string,clientId:string): Promise< { bookings: Booking[] }> {
      let bookings
      
        bookings = await this.bookingRepository.getBookingsByArtistIdMarked(artistId,clientId)
        
        return { bookings };
    }
    async getDone(artistId: string,clientId:string): Promise< { bookings: Booking[] }> {
      let bookings
      
        bookings = await this.bookingRepository.getBookingsByArtistIdDone(artistId,clientId)
        
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

      async updateBooking(_id: string,event: string, location: Location,date_of_booking: Date[],status: string,amount:number): Promise<Booking> {
        return this.bookingRepository.updateBooking(_id, event, location, date_of_booking, status,amount);
    }
      async cancelPaymentReq(_id: string): Promise<Booking> {
        return this.bookingRepository.cancelPaymentReq(_id);
    }


    async handleSuccessfulPayment(bookingId: string): Promise<void> {
        const booking = await this.bookingRepository.findBySessionId(bookingId);
        if (!booking) {
          throw new Error('Booking not found for the given session ID');
        }
    
        booking.status = 'booked'; 
        booking.payment_method='stripe'
        booking.payment_date = new Date(Date.now());
        await this.bookingRepository.updateBookingStripe(booking);
      }
      async updateBookingStatus(bookingId: string, status: string): Promise<Booking> {
        return this.bookingRepository.updateBookingStatus(bookingId, status);
      }
      async findAvailablePeople(startDate: Date, endDate: Date,category:string,usernotid:string): Promise<User[]> {
        const availablePeople = await this.bookingRepository.findAvailablePeopleByDateRange(startDate, endDate,category,usernotid);
        return availablePeople;
      }
      async getAllBookingsByArtistAndClient(): Promise<Booking[]> {
        return await this.bookingRepository.findBookingsByArtistAndClient();
      }

}
