import api from "./api";
import { AdminUser } from "../types";

interface LoginResponse {
  user: AdminUser;
  token: string;   // mapped from accessToken
}

// Backend wraps responses: { success, data: { user, accessToken, refreshToken } }
interface BackendLoginResponse {
  success: boolean;
  data: {
    user: AdminUser;
    accessToken: string;
    refreshToken: string;
  };
}

export const authApi = {
  login: async (credentials: { email: string; password: string }): Promise<LoginResponse> => {
    const res = await api.post<BackendLoginResponse>("/auth/admin/login", credentials);
    // Normalise to the shape consumed by the Redux slice
    return { user: res.data.data.user, token: res.data.data.accessToken };
  },

  getMe: async (): Promise<AdminUser> => {
    const res = await api.get<{ success: boolean; data: AdminUser }>("/auth/admin/me");
    return res.data.data;
  },

  logout: async (): Promise<void> => {
    await api.post("/admin/auth/logout");
  },

  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<void> => {
    await api.put("/admin/auth/change-password", data);
  },
};
