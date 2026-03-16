import api from './axios';
import { ADMIN_ENDPOINTS } from './endpoints';
import type { ApiResponse, PaginatedResponse, Booking, BookingStatus } from '../types';

export interface BookingListParams {
  page?:   number;
  limit?:  number;
  status?: string;       // loosened so callers can pass any string filter
  search?: string;
  from?:   string;
  to?:     string;
}

export interface BookingStats {
  total:        number;
  pending:      number;
  inProgress:   number;
  completed:    number;
  cancelled:    number;
  todayRevenue: number;
}

export const adminBookingApi = {
  getAll: async (params: BookingListParams = {}) => {
    const res = await api.get<PaginatedResponse<Booking>>(
      ADMIN_ENDPOINTS.BOOKINGS.BASE,
      { params }
    );
    return res.data;
  },

  getById: async (id: string) => {
    const res = await api.get<ApiResponse<Booking>>(ADMIN_ENDPOINTS.BOOKINGS.DETAIL(id));
    return res.data.data;
  },

  updateStatus: async (id: string, status: BookingStatus, technicianId?: string) => {
    const res = await api.patch<ApiResponse<Booking>>(
      ADMIN_ENDPOINTS.BOOKINGS.STATUS(id),
      { status, ...(technicianId && { technicianId }) }
    );
    return res.data.data;
  },

  assignTechnician: async (bookingId: string, technicianId: string) => {
    const res = await api.patch<ApiResponse<Booking>>(
      ADMIN_ENDPOINTS.BOOKINGS.ASSIGN(bookingId),
      { technicianId }
    );
    return res.data.data;
  },

  cancel: async (id: string, reason?: string) => {
    const res = await api.patch<ApiResponse<Booking>>(
      ADMIN_ENDPOINTS.BOOKINGS.CANCEL(id),
      { reason }
    );
    return res.data.data;
  },

  getStats: async () => {
    const res = await api.get<ApiResponse<BookingStats>>(ADMIN_ENDPOINTS.BOOKINGS.STATS);
    return res.data.data;
  },
};

