import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from 'react-redux';
import authReducer        from "./slices/authSlice";
import serviceReducer     from "./slices/serviceSlice";
import bookingReducer     from "./slices/bookingSlice";
import technicianReducer  from "./slices/technicianSlice";
import categoryReducer    from "./slices/categorySlice";

export const store = configureStore({
  reducer: {
    auth:        authReducer,
    services:    serviceReducer,
    bookings:    bookingReducer,
    technicians: technicianReducer,
    categories:  categoryReducer,
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

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: <T>(selector: (state: RootState) => T) => T = useSelector;
