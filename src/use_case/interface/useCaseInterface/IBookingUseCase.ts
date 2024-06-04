import { Booking } from "../../../Domain/Booking";

export interface IBookingUseCase {
    checkdate(artistId: string, startDate: Date, endDate: Date): Promise<Date[]>;
    makeBooking(artistId: string, clientId: string, dates: Date[], marked: boolean): Promise<Booking>;
    getBookingsreq(artistId: string, len: boolean): Promise<{ length: number } | { bookings: Booking[] }>;
    getBookingsConfirm(artistId: string, len: boolean): Promise<{ length: number } | { bookings: Booking[] }>;
    getMarked(artistId: string, len: boolean): Promise<{ length: number } | { bookings: Booking[] }>;
    singleBooking(artistId: string,clientId: string): Promise<Booking|null>;
    cancelBooking(bookingId: string, userId: string): Promise<void>
}
