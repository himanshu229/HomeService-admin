// ─── Auth ────────────────────────────────────────────────────────────────────
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "super_admin" | "admin" | "support";
  avatar?: string;
}

export interface AuthState {
  user: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// ─── Service ─────────────────────────────────────────────────────────────────
export type ServiceStatus = "published" | "unpublished";

export interface Service {
  id: string;
  name: string;
  category: { name: string; emoji: string } | string;
  categoryId?: string;
  price: number;
  aboutService?: string;
  whatsIncluded?: string;
  warranty?: string;
  status: ServiceStatus;
  popular?: boolean;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  emoji: string;
  serviceCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

// ─── Booking ─────────────────────────────────────────────────────────────────
export type BookingStatus =
  | "pending"
  | "technician_assigned"
  | "on_the_way"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  serviceId: string;
  serviceName: string;
  technicianId: string | null;
  technicianName: string | null;
  address: string;
  scheduledDate: string;
  scheduledTime: string;
  status: BookingStatus;
  totalAmount: number;
  notes?: string;
  createdAt: string;
}

// ─── Technician ───────────────────────────────────────────────────────────────
export type TechnicianStatus = "active" | "inactive" | "on_job";

export interface Technician {
  id: string;
  name: string;
  email: string;
  phone: string;
  specializations: string[];
  status: TechnicianStatus;
  rating: number;
  totalJobs: number;
  avatar?: string;
  joinedAt: string;
}

// ─── User ─────────────────────────────────────────────────────────────────────
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalBookings: number;
  createdAt: string;
}

// ─── Offer ────────────────────────────────────────────────────────────────────
export type DiscountType = "percentage" | "flat";

export interface Offer {
  id: string;
  code: string;
  title: string;
  description: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderAmount: number;
  maxUses: number;
  usedCount: number;
  expiresAt: string;
  isActive: boolean;
}

// ─── API Response wrapper ────────────────────────────────────────────────────
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  limit: number;
}

// ─── Generic slice state ──────────────────────────────────────────────────────
export interface SliceState<T> {
  items: T[];
  selectedItem: T | null;
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
}
