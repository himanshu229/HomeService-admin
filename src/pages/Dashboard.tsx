import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchBookings } from "../store/slices/bookingSlice";
import { fetchServices } from "../store/slices/serviceSlice";
import { fetchTechnicians } from "../store/slices/technicianSlice";
import StatsCard from "../components/common/StatsCard";
import StatusBadge from "../components/common/StatusBadge";
import { Booking } from "../types";

const TotalIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
);
const RevenueIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const TechnicianIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const ServiceIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items: bookings, total: totalBookings } = useAppSelector((s) => s.bookings);
  const { items: services, total: totalServices } = useAppSelector((s) => s.services);
  const { items: technicians } = useAppSelector((s) => s.technicians);

  useEffect(() => {
    dispatch(fetchBookings({ limit: 5 }));
    dispatch(fetchServices({ limit: 50 }));
    dispatch(fetchTechnicians({ limit: 50 }));
  }, [dispatch]);

  const completedBookings = bookings.filter((b) => b.status === "completed").length;
  const totalRevenue = bookings
    .filter((b) => b.status === "completed")
    .reduce((sum, b) => sum + b.totalAmount, 0);
  const activeTechs = technicians.filter(
    (t) => t.status === "active" || t.status === "on_job"
  ).length;

  const recentBookings = [...bookings].slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard
          title="Total Bookings"
          value={totalBookings}
          subtitle="All time"
          icon={<TotalIcon />}
          color="blue"
        />
        <StatsCard
          title="Revenue"
          value={`₹${totalRevenue.toLocaleString("en-IN")}`}
          subtitle="From completed bookings"
          icon={<RevenueIcon />}
          color="green"
        />
        <StatsCard
          title="Active Technicians"
          value={activeTechs}
          subtitle={`${technicians.length} total`}
          icon={<TechnicianIcon />}
          color="purple"
        />
        <StatsCard
          title="Services"
          value={totalServices}
          subtitle="Published & unpublished"
          icon={<ServiceIcon />}
          color="orange"
        />
      </div>

      {/* Booking status summary */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {(
          [
            { status: "pending",             label: "Pending",    color: "bg-yellow-50 border-yellow-200 text-yellow-700" },
            { status: "technician_assigned", label: "Assigned",   color: "bg-blue-50 border-blue-200 text-blue-700" },
            { status: "on_the_way",          label: "On The Way", color: "bg-purple-50 border-purple-200 text-purple-700" },
            { status: "in_progress",         label: "In Progress",color: "bg-orange-50 border-orange-200 text-orange-700" },
            { status: "completed",           label: "Completed",  color: "bg-green-50 border-green-200 text-green-700" },
            { status: "cancelled",           label: "Cancelled",  color: "bg-red-50 border-red-200 text-red-700" },
          ] as { status: Booking["status"]; label: string; color: string }[]
        ).map(({ status, label, color }) => (
          <div key={status} className={`rounded-xl border p-4 ${color}`}>
            <p className="text-2xl font-bold">
              {bookings.filter((b) => b.status === status).length}
            </p>
            <p className="text-xs font-medium mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Recent Bookings Table */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-900">Recent Bookings</h2>
          <a href="/bookings" className="text-sm text-primary-600 hover:underline font-medium">
            View all →
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {["Booking ID", "Customer", "Service", "Date", "Technician", "Status"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentBookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-400 text-sm">
                    No bookings yet
                  </td>
                </tr>
              ) : (
                recentBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-mono text-gray-600">#{b.id.slice(-6)}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{b.customerName}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{b.serviceName}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(b.scheduledDate).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {b.technicianName ?? <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={b.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
