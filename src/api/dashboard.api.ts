import api from './axios';
import { ADMIN_ENDPOINTS } from './endpoints';
import type { ApiResponse } from '../types';

export interface DashboardStats {
  totalUsers:       number;
  totalBookings:    number;
  totalRevenue:     number;
  totalTechnicians: number;
  bookingsToday:    number;
  revenueToday:     number;
  pendingBookings:  number;
  completionRate:   number;
}

export interface ChartData {
  bookingsByDate:      Array<{ date: string; count: number }>;
  revenueByDate:       Array<{ date: string; amount: number }>;
  bookingsByStatus:    Array<{ status: string; count: number }>;
  topServices:         Array<{ name: string; count: number; revenue: number }>;
}

export const dashboardApi = {
  getStats: () =>
    api.get<ApiResponse<DashboardStats>>(ADMIN_ENDPOINTS.DASHBOARD.STATS),

  getCharts: (from?: string, to?: string) =>
    api.get<ApiResponse<ChartData>>(ADMIN_ENDPOINTS.DASHBOARD.CHARTS, {
      params: { from, to },
    }),
};
