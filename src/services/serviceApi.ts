import api from "./api";
import { Service, PaginatedResponse } from "../types";

export const serviceApi = {
  getAll: async (params: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    status?: string;
  }): Promise<PaginatedResponse<Service>> => {
    const res = await api.get<PaginatedResponse<Service>>("/admin/services", { params });
    return res.data;
  },

  getById: async (id: string): Promise<Service> => {
    const res = await api.get<Service>(`/admin/services/${id}`);
    return res.data;
  },

  create: async (data: Partial<Service>): Promise<Service> => {
    const res = await api.post<Service>("/admin/services", data);
    return res.data;
  },

  update: async (id: string, data: Partial<Service>): Promise<Service> => {
    const res = await api.put<Service>(`/admin/services/${id}`, data);
    return res.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/admin/services/${id}`);
  },

  toggleStatus: async (id: string): Promise<Service> => {
    const res = await api.patch<Service>(`/admin/services/${id}/toggle-status`);
    return res.data;
  },

  uploadImage: async (id: string, file: File): Promise<{ imageUrl: string }> => {
    const form = new FormData();
    form.append("image", file);
    const res = await api.post<{ imageUrl: string }>(
      `/admin/services/${id}/image`,
      form,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return res.data;
  },
};
