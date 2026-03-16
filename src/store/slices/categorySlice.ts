import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ServiceCategory } from "../../types";
import { adminServiceApi } from "../../api/service.api";

interface CategoryState {
  items: ServiceCategory[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchCategories = createAsyncThunk(
  "categories/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await adminServiceApi.getCategories();
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message ?? "Failed to fetch categories");
    }
  }
);

export const createCategory = createAsyncThunk(
  "categories/create",
  async (
    data: { name: string; emoji: string; description?: string; color?: string },
    { rejectWithValue }
  ) => {
    try {
      return await adminServiceApi.createCategory(data);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message ?? "Failed to create category");
    }
  }
);

export const updateCategory = createAsyncThunk(
  "categories/update",
  async (
    { id, data }: { id: string; data: Partial<{ name: string; emoji: string; description: string; color: string }> },
    { rejectWithValue }
  ) => {
    try {
      return await adminServiceApi.updateCategory(id, data);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message ?? "Failed to update category");
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "categories/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await adminServiceApi.deleteCategory(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message ?? "Failed to delete category");
    }
  }
);

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload ?? [];
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        if (action.payload) state.items.push(action.payload);
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        if (action.payload) {
          const idx = state.items.findIndex((c) => c.id === action.payload!.id);
          if (idx !== -1) state.items[idx] = action.payload;
        }
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.items = state.items.filter((c) => c.id !== action.payload);
      });
  },
});

export default categorySlice.reducer;
