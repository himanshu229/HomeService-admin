import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Service, SliceState } from "../../types";
import { serviceApi } from "../../services/serviceApi";

type ServiceState = SliceState<Service>;

const initialState: ServiceState = {
  items: [],
  selectedItem: null,
  loading: false,
  error: null,
  total: 0,
  page: 1,
  limit: 10,
};

export const fetchServices = createAsyncThunk(
  "services/fetchAll",
  async (params: { page?: number; limit?: number; search?: string } = {}, { rejectWithValue }) => {
    try {
      return await serviceApi.getAll(params);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message ?? "Failed to fetch services");
    }
  }
);

export const createService = createAsyncThunk(
  "services/create",
  async (data: Partial<Service>, { rejectWithValue }) => {
    try {
      return await serviceApi.create(data);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message ?? "Failed to create service");
    }
  }
);

export const updateService = createAsyncThunk(
  "services/update",
  async ({ id, data }: { id: string; data: Partial<Service> }, { rejectWithValue }) => {
    try {
      return await serviceApi.update(id, data);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message ?? "Failed to update service");
    }
  }
);

export const deleteService = createAsyncThunk(
  "services/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await serviceApi.delete(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message ?? "Failed to delete service");
    }
  }
);

export const toggleServiceStatus = createAsyncThunk(
  "services/toggleStatus",
  async (id: string, { rejectWithValue }) => {
    try {
      return await serviceApi.toggleStatus(id);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message ?? "Failed to toggle status");
    }
  }
);

const serviceSlice = createSlice({
  name: "services",
  initialState,
  reducers: {
    setSelectedService(state, action) {
      state.selectedItem = action.payload;
    },
    clearSelectedService(state) {
      state.selectedItem = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchAll
      .addCase(fetchServices.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.total = action.payload.total;
        state.page = action.payload.page;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // create
      .addCase(createService.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        state.total += 1;
      })
      // update
      .addCase(updateService.fulfilled, (state, action) => {
        const idx = state.items.findIndex((s) => s.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      // delete
      .addCase(deleteService.fulfilled, (state, action) => {
        state.items = state.items.filter((s) => s.id !== action.payload);
        state.total -= 1;
      })
      // toggleStatus
      .addCase(toggleServiceStatus.fulfilled, (state, action) => {
        const idx = state.items.findIndex((s) => s.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      });
  },
});

export const { setSelectedService, clearSelectedService } = serviceSlice.actions;
export default serviceSlice.reducer;
