import api from './axios';
import { ADMIN_ENDPOINTS } from './endpoints';
import type { ApiResponse, PaginatedResponse, Service, ServiceCategory } from '../types';

export interface ServiceListParams {
  page?:   number;
  limit?:  number;
  search?: string;
  status?: string;
}

export interface CreateServicePayload {
  name:        string;
  categoryId:  string;
  description: string;
  price:       number;
  duration:    number;
  emoji:       string;
  warranty?:   string;
  popular?:    boolean;
}

export const adminServiceApi = {
  getAll: async (params: ServiceListParams = {}) => {
    const res = await api.get<PaginatedResponse<Service>>(
      ADMIN_ENDPOINTS.SERVICES.BASE,
      { params }
    );
    return res.data;
  },

  getById: async (id: string) => {
    const res = await api.get<ApiResponse<Service>>(ADMIN_ENDPOINTS.SERVICES.DETAIL(id));
    return res.data.data;
  },

  create: async (data: CreateServicePayload) => {
    const res = await api.post<ApiResponse<Service>>(ADMIN_ENDPOINTS.SERVICES.BASE, data);
    return res.data.data;
  },

  update: async (id: string, data: Partial<CreateServicePayload>) => {
    const res = await api.put<ApiResponse<Service>>(ADMIN_ENDPOINTS.SERVICES.DETAIL(id), data);
    return res.data.data;
  },

  delete: async (id: string) => {
    await api.delete<ApiResponse<null>>(ADMIN_ENDPOINTS.SERVICES.DETAIL(id));
  },

  toggleStatus: async (id: string) => {
    const res = await api.patch<ApiResponse<Service>>(ADMIN_ENDPOINTS.SERVICES.TOGGLE(id));
    return res.data.data;
  },

  uploadImage: (id: string, file: File) => {
    const form = new FormData();
    form.append('image', file);
    return api.post<ApiResponse<{ imageUrl: string }>>(
      ADMIN_ENDPOINTS.SERVICES.IMAGE(id),
      form,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
  },

  // Categories
  getCategories: async () => {
    const res = await api.get<ApiResponse<ServiceCategory[]>>(ADMIN_ENDPOINTS.SERVICES.CATEGORIES);
    return res.data.data;
  },

  createCategory: async (data: { name: string; emoji: string; description?: string; color?: string }) => {
    const res = await api.post<ApiResponse<ServiceCategory>>(ADMIN_ENDPOINTS.SERVICES.CATEGORIES, data);
    return res.data.data;
  },

  updateCategory: async (id: string, data: Partial<{ name: string; emoji: string; description: string; color: string }>) => {
    const res = await api.put<ApiResponse<ServiceCategory>>(ADMIN_ENDPOINTS.SERVICES.CATEGORY_DETAIL(id), data);
    return res.data.data;
  },

  deleteCategory: async (id: string) => {
    await api.delete<ApiResponse<null>>(ADMIN_ENDPOINTS.SERVICES.CATEGORY_DETAIL(id));
  },
};

