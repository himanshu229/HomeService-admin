import api from './axios';
import { ADMIN_ENDPOINTS } from './endpoints';
import type { ApiResponse, PaginatedResponse, Technician, TechnicianStatus } from '../types';

export interface TechnicianListParams {
  page?:   number;
  limit?:  number;
  status?: TechnicianStatus;
  search?: string;
}

export interface CreateTechnicianPayload {
  name:            string;
  phone:           string;
  email?:          string;
  experience:      number;
  specializations: string[];
  avatar?:         string;
}

export const adminTechnicianApi = {
  getAll: async (params: TechnicianListParams = {}) => {
    const res = await api.get<PaginatedResponse<Technician>>(
      ADMIN_ENDPOINTS.TECHNICIANS.BASE,
      { params }
    );
    return res.data;
  },

  getById: async (id: string) => {
    const res = await api.get<ApiResponse<Technician>>(ADMIN_ENDPOINTS.TECHNICIANS.DETAIL(id));
    return res.data.data;
  },

  getAvailable: async (serviceId?: string) => {
    const res = await api.get<ApiResponse<Technician[]>>(
      ADMIN_ENDPOINTS.TECHNICIANS.AVAILABLE,
      { params: serviceId ? { serviceId } : {} }
    );
    return res.data.data;
  },

  create: async (data: CreateTechnicianPayload) => {
    const res = await api.post<ApiResponse<Technician>>(ADMIN_ENDPOINTS.TECHNICIANS.BASE, data);
    return res.data.data;
  },

  update: async (id: string, data: Partial<CreateTechnicianPayload>) => {
    const res = await api.put<ApiResponse<Technician>>(ADMIN_ENDPOINTS.TECHNICIANS.DETAIL(id), data);
    return res.data.data;
  },

  delete: async (id: string) => {
    await api.delete<ApiResponse<null>>(ADMIN_ENDPOINTS.TECHNICIANS.DETAIL(id));
  },

  updateServices: async (id: string, serviceIds: string[]) => {
    const res = await api.put<ApiResponse<Technician>>(
      ADMIN_ENDPOINTS.TECHNICIANS.SERVICES(id),
      { serviceIds }
    );
    return res.data.data;
  },
};

