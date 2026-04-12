import api from './axios';
import { ADMIN_ENDPOINTS } from './endpoints';
import type { ApiResponse, PaginatedResponse, Customer } from '../types';

export interface UserListParams {
  page?:   number;
  limit?:  number;
  search?: string;
}

export interface CreateCustomerPayload {
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  dob: string;
}

export const adminUserApi = {
  getAll: (params: UserListParams = {}) =>
    api.get<PaginatedResponse<Customer>>(ADMIN_ENDPOINTS.USERS.BASE, { params }),

  create: (payload: CreateCustomerPayload) =>
    api.post<ApiResponse<Customer>>(ADMIN_ENDPOINTS.USERS.BASE, payload),

  getById: (id: string) =>
    api.get<ApiResponse<Customer>>(ADMIN_ENDPOINTS.USERS.DETAIL(id)),

  delete: (id: string) =>
    api.delete<ApiResponse<null>>(ADMIN_ENDPOINTS.USERS.DETAIL(id)),
};
