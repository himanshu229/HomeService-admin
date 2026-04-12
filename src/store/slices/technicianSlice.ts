import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Technician, TechnicianStatus, SliceState } from "../../types";
import { adminTechnicianApi } from "../../api/technician.api";

type TechnicianState = SliceState<Technician>;

const initialState: TechnicianState = {
  items: [],
  selectedItem: null,
  loading: false,
  error: null,
  total: 0,
  page: 1,
  limit: 10,
};

export const fetchTechnicians = createAsyncThunk(
  "technicians/fetchAll",
  async (
    params: { page?: number; limit?: number; status?: TechnicianStatus; search?: string } = {},
    { rejectWithValue }
  ) => {
    try {
      return await adminTechnicianApi.getAll(params);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message ?? "Failed to fetch technicians");
    }
  }
);

export const createTechnician = createAsyncThunk(
  "technicians/create",
  async (data: Partial<Technician>, { rejectWithValue }) => {
    try {
      return await adminTechnicianApi.create(data as any);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message ?? "Failed to create technician");
    }
  }
);

export const updateTechnician = createAsyncThunk(
  "technicians/update",
  async ({ id, data }: { id: string; data: Partial<Technician> }, { rejectWithValue }) => {
    try {
      return await adminTechnicianApi.update(id, data as any);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message ?? "Failed to update technician");
    }
  }
);

export const deleteTechnician = createAsyncThunk(
  "technicians/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await adminTechnicianApi.delete(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message ?? "Failed to delete technician");
    }
  }
);

export const toggleTechnicianStatus = createAsyncThunk(
  "technicians/toggleStatus",
  async (id: string, { rejectWithValue }) => {
    try {
      return await adminTechnicianApi.toggleStatus(id);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message ?? "Failed to toggle status");
    }
  }
);

const technicianSlice = createSlice({
  name: "technicians",
  initialState,
  reducers: {
    setSelectedTechnician(state, action) {
      state.selectedItem = action.payload;
    },
    clearSelectedTechnician(state) {
      state.selectedItem = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTechnicians.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchTechnicians.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.total = action.payload.total;
        state.page = action.payload.page;
      })
      .addCase(fetchTechnicians.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createTechnician.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        state.total += 1;
      })
      .addCase(updateTechnician.fulfilled, (state, action) => {
        const idx = state.items.findIndex((t) => t.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteTechnician.fulfilled, (state, action) => {
        state.items = state.items.filter((t) => t.id !== action.payload);
        state.total -= 1;
      })
      .addCase(toggleTechnicianStatus.fulfilled, (state, action) => {
        const idx = state.items.findIndex((t) => t.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      });
  },
});

export const { setSelectedTechnician, clearSelectedTechnician } = technicianSlice.actions;
export default technicianSlice.reducer;
