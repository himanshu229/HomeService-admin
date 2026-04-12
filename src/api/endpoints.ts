// Centralised admin API endpoint constants.
// Functions are used for parameterised paths.

export const ADMIN_ENDPOINTS = {
  AUTH: {
    LOGIN:           '/auth/admin/login',
    ME:              '/auth/admin/me',
    LOGOUT:          '/auth/admin/logout',
    CHANGE_PASSWORD: '/auth/admin/change-password',
  },

  SERVICES: {
    BASE:            '/admin/services',
    DETAIL:          (id: string) => `/admin/services/${id}`,
    IMAGE:           (id: string) => `/admin/services/${id}/image`,
    TOGGLE:          (id: string) => `/admin/services/${id}/toggle`,
    TOGGLE_POPULAR:  (id: string) => `/admin/services/${id}/toggle-popular`,
    CATEGORIES:      '/admin/categories',
    CATEGORY_DETAIL: (id: string) => `/admin/categories/${id}`,
  },

  BOOKINGS: {
    BASE:   '/admin/bookings',
    STATS:  '/admin/bookings/stats',
    DETAIL: (id: string) => `/admin/bookings/${id}`,
    STATUS: (id: string) => `/admin/bookings/${id}/status`,
    ASSIGN: (id: string) => `/admin/bookings/${id}/assign`,
    CANCEL: (id: string) => `/admin/bookings/${id}/cancel`,
  },

  TECHNICIANS: {
    BASE:      '/admin/technicians',
    DETAIL:    (id: string) => `/admin/technicians/${id}`,
    AVAILABLE: '/admin/technicians/available',
    TOGGLE:    (id: string) => `/admin/technicians/${id}/toggle`,
    SERVICES:  (id: string) => `/admin/technicians/${id}/services`,
  },

  USERS: {
    BASE:   '/admin/users',
    DETAIL: (id: string) => `/admin/users/${id}`,
  },

  DASHBOARD: {
    STATS:  '/admin/dashboard/stats',
    CHARTS: '/admin/dashboard/charts',
  },
} as const;
