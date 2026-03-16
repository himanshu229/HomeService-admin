import api from './axios';
import { ADMIN_ENDPOINTS } from './endpoints';
import type { ApiResponse, AdminUser } from '../types';

export interface LoginCredentials {
  email:    string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user:  AdminUser;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword:     string;
}

export const adminAuthApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const res = await api.post<ApiResponse<{ accessToken: string; user: AdminUser }>>(
      ADMIN_ENDPOINTS.AUTH.LOGIN,
      credentials
    );
    return {
      token: res.data.data.accessToken,
      user:  res.data.data.user,
    };
  },

  getMe: () =>
    api.get<ApiResponse<AdminUser>>(ADMIN_ENDPOINTS.AUTH.ME),

  logout: () =>
    api.post<ApiResponse<null>>(ADMIN_ENDPOINTS.AUTH.LOGOUT),

  changePassword: (data: ChangePasswordPayload) =>
    api.put<ApiResponse<null>>(ADMIN_ENDPOINTS.AUTH.CHANGE_PASSWORD, data),
};
