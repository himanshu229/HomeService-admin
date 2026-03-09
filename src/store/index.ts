import { configureStore } from "@reduxjs/toolkit";
import authReducer      from "./slices/authSlice";
import serviceReducer   from "./slices/serviceSlice";
import bookingReducer   from "./slices/bookingSlice";
import technicianReducer from "./slices/technicianSlice";

export const store = configureStore({
  reducer: {
    auth:        authReducer,
    services:    serviceReducer,
    bookings:    bookingReducer,
    technicians: technicianReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["auth/login/fulfilled"],
      },
    }),
});

export type RootState   = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
