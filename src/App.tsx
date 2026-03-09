import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import AdminLayout from "./components/layout/AdminLayout";
import ProtectedRoute from "./components/common/ProtectedRoute";

// Lazy-load pages for code splitting
const LoginPage       = lazy(() => import("./pages/LoginPage"));
const Dashboard       = lazy(() => import("./pages/Dashboard"));
const ServicesPage    = lazy(() => import("./pages/ServicesPage"));
const CategoriesPage  = lazy(() => import("./pages/CategoriesPage"));
const BookingsPage    = lazy(() => import("./pages/BookingsPage"));
const TechniciansPage = lazy(() => import("./pages/TechniciansPage"));
const UsersPage       = lazy(() => import("./pages/UsersPage"));
const OffersPage      = lazy(() => import("./pages/OffersPage"));

const PageLoader: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen">
    <svg className="animate-spin w-8 h-8 text-primary-600" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  </div>
);

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected admin routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="/"            element={<Dashboard />} />
                <Route path="/services"    element={<ServicesPage />} />
                <Route path="/categories"  element={<CategoriesPage />} />
                <Route path="/bookings"    element={<BookingsPage />} />
                <Route path="/technicians" element={<TechniciansPage />} />
                <Route path="/users"       element={<UsersPage />} />
                <Route path="/offers"      element={<OffersPage />} />
              </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
