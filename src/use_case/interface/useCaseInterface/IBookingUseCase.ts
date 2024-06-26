import { Booking ,Location} from "../../../Domain/Booking";
import { User } from "../../../Domain/userEntity";

export interface IBookingUseCase {
    checkdate(artistId: string, startDate: Date, endDate: Date,bookingId:string): Promise<Date[]>;
    makeBooking(artistId: string, clientId: string, dates: Date[], marked: boolean,event:string,location:Location): Promise<Booking>;
    getBookingsreq(artistId: string,clientId:string): Promise< { bookings: Booking[] }>;
    getBookingsConfirm(artistId: string,clientId:string): Promise< { bookings: Booking[] }>;
    getMarked(artistId: string,clientId:string): Promise< { bookings: Booking[] }>;
    singleBooking(artistId: string,clientId: string): Promise<Booking|null>;
    cancelBooking(bookingId: string, userId: string): Promise<void>;
    updateBooking(_id: string,event: string, location: Location,date_of_booking: Date[],status: string,amount:number): Promise<Booking>;
    cancelPaymentReq(_id: string): Promise<Booking>;
    handleSuccessfulPayment(sessionId: string): Promise<void>;
    updateBookingStatus(bookingId: string, status: string): Promise<Booking>;
    findAvailablePeople(startDate: Date, endDate: Date,category:string,usernotid:string): Promise<User[]>;
    getAllBookingsByArtistAndClient(): Promise<Booking[]>;
    getDone(artistId: string,clientId:string): Promise< { bookings: Booking[] }>
}
