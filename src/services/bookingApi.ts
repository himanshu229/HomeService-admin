import api from "./api";
import { Booking, BookingStatus, PaginatedResponse } from "../types";

export const bookingApi = {
  getAll: async (params: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
    from?: string;
    to?: string;
  }): Promise<PaginatedResponse<Booking>> => {
    const res = await api.get<PaginatedResponse<Booking>>("/admin/bookings", { params });
    return res.data;
  },

  getById: async (id: string): Promise<Booking> => {
    const res = await api.get<Booking>(`/admin/bookings/${id}`);
    return res.data;
  },

  updateStatus: async (
    id: string,
    status: BookingStatus,
    technicianId?: string
  ): Promise<Booking> => {
    const res = await api.patch<Booking>(`/admin/bookings/${id}/status`, {
      status,
      technicianId,
    });
    return res.data;
  },

  assignTechnician: async (bookingId: string, technicianId: string): Promise<Booking> => {
    const res = await api.patch<Booking>(`/admin/bookings/${bookingId}/assign`, {
      technicianId,
    });
    return res.data;
  },

  cancel: async (id: string, reason: string): Promise<Booking> => {
    const res = await api.patch<Booking>(`/admin/bookings/${id}/cancel`, { reason });
    return res.data;
  },

  getStats: async (): Promise<{
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    cancelled: number;
    revenue: number;
  }> => {
    const res = await api.get("/admin/bookings/stats");
    return res.data;
  },
};
