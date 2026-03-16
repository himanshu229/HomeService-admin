import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Booking, BookingStatus, SliceState } from "../../types";
import { adminBookingApi } from "../../api/booking.api";

type BookingState = SliceState<Booking>;

const initialState: BookingState = {
  items: [],
  selectedItem: null,
  loading: false,
  error: null,
  total: 0,
  page: 1,
  limit: 10,
};

export const fetchBookings = createAsyncThunk(
  "bookings/fetchAll",
  async (
    params: { page?: number; limit?: number; status?: string; search?: string } = {},
    { rejectWithValue }
  ) => {
    try {
      return await adminBookingApi.getAll(params);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message ?? "Failed to fetch bookings");
    }
  }
);

export const updateBookingStatus = createAsyncThunk(
  "bookings/updateStatus",
  async (
    { id, status, technicianId }: { id: string; status: BookingStatus; technicianId?: string },
    { rejectWithValue }
  ) => {
    try {
      return await adminBookingApi.updateStatus(id, status, technicianId);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message ?? "Failed to update booking");
    }
  }
);

export const assignTechnician = createAsyncThunk(
  "bookings/assignTechnician",
  async (
    { bookingId, technicianId }: { bookingId: string; technicianId: string },
    { rejectWithValue }
  ) => {
    try {
      return await adminBookingApi.assignTechnician(bookingId, technicianId);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message ?? "Failed to assign technician");
    }
  }
);

const bookingSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {
    setSelectedBooking(state, action) {
      state.selectedItem = action.payload;
    },
    clearSelectedBooking(state) {
      state.selectedItem = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookings.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.total = action.payload.total;
        state.page = action.payload.page;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        const idx = state.items.findIndex((b) => b.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(assignTechnician.fulfilled, (state, action) => {
        const idx = state.items.findIndex((b) => b.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      });
  },
});

export const { setSelectedBooking, clearSelectedBooking } = bookingSlice.actions;
export default bookingSlice.reducer;
