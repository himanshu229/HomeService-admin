import { useAppDispatch, useAppSelector } from '../store';
import {
  fetchBookings,
  updateBookingStatus,
  assignTechnician,
  setSelectedBooking,
  clearSelectedBooking,
} from '../store/slices/bookingSlice';
import type { Booking, BookingStatus } from '../types';

export const useBookings = () => {
  const dispatch = useAppDispatch();
  const { items, selectedItem, loading, error, total, page, limit } =
    useAppSelector((s) => s.bookings);

  return {
    bookings:     items,
    selected:     selectedItem,
    isLoading:    loading,
    error,
    total,
    page,
    limit,

    fetchAll: (params?: {
      page?: number;
      limit?: number;
      status?: string;
      search?: string;
      from?: string;
      to?: string;
    }) => dispatch(fetchBookings(params ?? {})),

    updateStatus: (id: string, status: BookingStatus, technicianId?: string) =>
      dispatch(updateBookingStatus({ id, status, technicianId })),

    assign: (bookingId: string, technicianId: string) =>
      dispatch(assignTechnician({ bookingId, technicianId })),

    select:      (b: Booking) => dispatch(setSelectedBooking(b)),
    deselect:    ()           => dispatch(clearSelectedBooking()),
  };
};
