import api from './axios';
import { ADMIN_ENDPOINTS } from './endpoints';
import type { ApiResponse, PaginatedResponse, Customer } from '../types';

export interface UserListParams {
  page?:   number;
  limit?:  number;
  search?: string;
}

export const adminUserApi = {
  getAll: (params: UserListParams = {}) =>
    api.get<PaginatedResponse<Customer>>(ADMIN_ENDPOINTS.USERS.BASE, { params }),

  getById: (id: string) =>
    api.get<ApiResponse<Customer>>(ADMIN_ENDPOINTS.USERS.DETAIL(id)),

  delete: (id: string) =>
    api.delete<ApiResponse<null>>(ADMIN_ENDPOINTS.USERS.DETAIL(id)),
};
