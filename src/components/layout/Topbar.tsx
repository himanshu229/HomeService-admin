import React from "react";
import { useLocation } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";

const routeTitles: Record<string, string> = {
  "/":            "Dashboard",
  "/services":    "Service Management",
  "/categories":  "Category Management",
  "/bookings":    "Booking Management",
  "/technicians": "Technician Management",
  "/users":       "User Management",
  "/offers":      "Offers & Discounts",
};

interface Props {
  onMenuClick: () => void;
}

const Topbar: React.FC<Props> = ({ onMenuClick }) => {
  const location = useLocation();
  const user = useAppSelector((s) => s.auth.user);

  const title = Object.entries(routeTitles).find(([path]) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path)
  )?.[1] ?? "Admin Portal";

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors lg:hidden"
          aria-label="Toggle menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Notification bell */}
        <button className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Current date */}
        <span className="hidden md:block text-sm text-gray-500">
          {new Date().toLocaleDateString("en-IN", {
            weekday: "short",
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>

        {/* Avatar */}
        {user && (
          <div className="w-9 h-9 rounded-full bg-primary-600 text-white flex items-center justify-center font-semibold text-sm">
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
    </header>
  );
};

export default Topbar;
