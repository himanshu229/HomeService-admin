import api from "./api";
import { Technician, TechnicianStatus, PaginatedResponse } from "../types";

export const technicianApi = {
  getAll: async (params: {
    page?: number;
    limit?: number;
    status?: TechnicianStatus;
    search?: string;
  }): Promise<PaginatedResponse<Technician>> => {
    const res = await api.get<PaginatedResponse<Technician>>("/admin/technicians", { params });
    return res.data;
  },

  getById: async (id: string): Promise<Technician> => {
    const res = await api.get<Technician>(`/admin/technicians/${id}`);
    return res.data;
  },

  create: async (data: Partial<Technician>): Promise<Technician> => {
    const res = await api.post<Technician>("/admin/technicians", data);
    return res.data;
  },

  update: async (id: string, data: Partial<Technician>): Promise<Technician> => {
    const res = await api.put<Technician>(`/admin/technicians/${id}`, data);
    return res.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/admin/technicians/${id}`);
  },

  getAvailable: async (serviceId?: string): Promise<Technician[]> => {
    const res = await api.get<Technician[]>("/admin/technicians/available", {
      params: { serviceId },
    });
    return res.data;
  },
};
