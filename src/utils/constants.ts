export const APP_NAME = process.env.REACT_APP_APP_NAME ?? 'SummerFix Admin';
export const APP_VERSION = process.env.REACT_APP_APP_VERSION ?? '1.0.0';
export const TOKEN_KEY = process.env.REACT_APP_TOKEN_KEY ?? 'sf_token';
export const API_BASE_URL = process.env.REACT_APP_API_URL ?? 'http://localhost:5000/api';

export const BOOKING_STATUS_LABELS: Record<string, string> = {
  PENDING:             'Pending',
  CONFIRMED:           'Confirmed',
  TECHNICIAN_ASSIGNED: 'Technician Assigned',
  ON_THE_WAY:          'On the Way',
  IN_PROGRESS:         'In Progress',
  COMPLETED:           'Completed',
  CANCELLED:           'Cancelled',
};

export const BOOKING_STATUS_COLORS: Record<string, string> = {
  PENDING:             '#F59E0B',
  CONFIRMED:           '#3B82F6',
  TECHNICIAN_ASSIGNED: '#8B5CF6',
  ON_THE_WAY:          '#06B6D4',
  IN_PROGRESS:         '#10B981',
  COMPLETED:           '#22C55E',
  CANCELLED:           '#EF4444',
};

export const TECHNICIAN_STATUS_LABELS: Record<string, string> = {
  active:   'Active',
  inactive: 'Inactive',
  on_job:   'On Job',
};

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  CASH:   'Cash',
  UPI:    'UPI',
  CARD:   'Card',
  WALLET: 'Wallet',
};

export const ADMIN_ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN:       'Admin',
  SUB_ADMIN:   'Sub Admin',
};

export const DEFAULT_PAGE_SIZE = 10;

export const DATE_FORMAT = 'DD MMM YYYY';
export const DATETIME_FORMAT = 'DD MMM YYYY, hh:mm A';
