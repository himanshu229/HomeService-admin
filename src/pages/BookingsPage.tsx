import React, { useEffect, useState, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchBookings, updateBookingStatus } from "../store/slices/bookingSlice";
import { Booking, BookingStatus } from "../types";
import DataTable from "../components/common/DataTable";
import SearchInput from "../components/common/SearchInput";
import StatusBadge from "../components/common/StatusBadge";
import Modal from "../components/common/Modal";

const STATUS_OPTIONS: { value: BookingStatus | "all"; label: string }[] = [
  { value: "all",                 label: "All Status" },
  { value: "pending",             label: "Pending" },
  { value: "technician_assigned", label: "Technician Assigned" },
  { value: "on_the_way",          label: "On The Way" },
  { value: "in_progress",         label: "In Progress" },
  { value: "completed",           label: "Completed" },
  { value: "cancelled",           label: "Cancelled" },
];

const BOOKING_STATUS_FLOW: BookingStatus[] = [
  "pending",
  "technician_assigned",
  "on_the_way",
  "in_progress",
  "completed",
  "cancelled",
];

const BookingsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, loading, total } = useAppSelector((s) => s.bookings);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">("all");
  const [page, setPage] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [newStatus, setNewStatus] = useState<BookingStatus>("pending");
  const [updating, setUpdating] = useState(false);
  const LIMIT = 10;

  const load = useCallback(() => {
    dispatch(
      fetchBookings({
        page,
        limit: LIMIT,
        search: search || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
      })
    );
  }, [dispatch, page, search, statusFilter]);

  useEffect(() => { load(); }, [load]);

  const openDetail = (booking: Booking) => {
    setSelectedBooking(booking);
    setNewStatus(booking.status);
  };

  const handleStatusUpdate = async () => {
    if (!selectedBooking) return;
    setUpdating(true);
    await dispatch(updateBookingStatus({ id: selectedBooking.id, status: newStatus }));
    setUpdating(false);
    setSelectedBooking(null);
    load();
  };

  const totalPages = Math.ceil(total / LIMIT);

  const columns = [
    {
      key: "id",
      label: "Booking ID",
      render: (v: string) => (
        <span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
          #{v.slice(-8).toUpperCase()}
        </span>
      ),
    },
    {
      key: "customerName",
      label: "Customer",
      render: (_: any, row: Booking) => (
        <div>
          <p className="font-medium text-gray-900">{row.customerName}</p>
          <p className="text-xs text-gray-400">{row.customerPhone}</p>
        </div>
      ),
    },
    { key: "serviceName", label: "Service" },
    {
      key: "address",
      label: "Address",
      render: (v: string) => (
        <span className="text-xs text-gray-500 line-clamp-1 max-w-[160px] block">{v}</span>
      ),
    },
    {
      key: "scheduledDate",
      label: "Date",
      render: (_: any, row: Booking) => (
        <div className="text-sm">
          <p>{new Date(row.scheduledDate).toLocaleDateString("en-IN")}</p>
          <p className="text-xs text-gray-400">{row.scheduledTime}</p>
        </div>
      ),
    },
    {
      key: "technicianName",
      label: "Technician",
      render: (v: string | null) =>
        v ? (
          <span className="text-sm text-gray-700">{v}</span>
        ) : (
          <span className="text-xs text-gray-300 italic">Unassigned</span>
        ),
    },
    {
      key: "status",
      label: "Status",
      render: (v: BookingStatus) => <StatusBadge status={v} />,
    },
    {
      key: "totalAmount",
      label: "Amount",
      render: (v: number) => (
        <span className="font-semibold text-gray-800">₹{v.toLocaleString("en-IN")}</span>
      ),
    },
    {
      key: "id",
      label: "",
      render: (_: any, row: Booking) => (
        <button
          onClick={() => openDetail(row)}
          className="text-xs text-primary-600 hover:underline font-medium"
        >
          Manage
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Bookings</h2>
          <p className="text-sm text-gray-500">{total} total bookings</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-3">
          <SearchInput
            value={search}
            onChange={(v) => { setSearch(v); setPage(1); }}
            placeholder="Search by customer, service..."
            className="flex-1"
          />
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value as any); setPage(1); }}
            className="input w-auto"
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <DataTable
          columns={columns}
          data={items}
          loading={loading}
          keyExtractor={(r) => r.id}
          emptyMessage="No bookings found."
        />
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
            <p className="text-sm text-gray-500">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-secondary py-1 px-3 text-xs disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="btn-secondary py-1 px-3 text-xs disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Booking Detail / Status Modal */}
      <Modal
        isOpen={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        title="Manage Booking"
        size="lg"
      >
        {selectedBooking && (
          <div className="space-y-5">
            {/* Info grid */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                ["Booking ID",  `#${selectedBooking.id.slice(-8).toUpperCase()}`],
                ["Customer",    selectedBooking.customerName],
                ["Phone",       selectedBooking.customerPhone],
                ["Service",     selectedBooking.serviceName],
                ["Date",        new Date(selectedBooking.scheduledDate).toLocaleDateString("en-IN")],
                ["Time",        selectedBooking.scheduledTime],
                ["Technician",  selectedBooking.technicianName ?? "Unassigned"],
                ["Amount",      `₹${selectedBooking.totalAmount.toLocaleString("en-IN")}`],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">{label}</p>
                  <p className="font-medium text-gray-900 mt-0.5">{value}</p>
                </div>
              ))}
              <div className="col-span-2">
                <p className="text-xs text-gray-400 uppercase tracking-wide">Address</p>
                <p className="font-medium text-gray-900 mt-0.5">{selectedBooking.address}</p>
              </div>
            </div>

            {/* Status update */}
            <div className="border-t border-gray-100 pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Update Status
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {BOOKING_STATUS_FLOW.map((s) => (
                  <label
                    key={s}
                    className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-colors text-sm ${
                      newStatus === s
                        ? "border-primary-500 bg-primary-50 text-primary-700"
                        : "border-gray-200 hover:border-gray-300 text-gray-600"
                    }`}
                  >
                    <input
                      type="radio"
                      name="newStatus"
                      value={s}
                      checked={newStatus === s}
                      onChange={() => setNewStatus(s)}
                      className="sr-only"
                    />
                    <StatusBadge status={s} />
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setSelectedBooking(null)}
                className="btn-secondary"
              >
                Close
              </button>
              <button
                onClick={handleStatusUpdate}
                disabled={updating || newStatus === selectedBooking.status}
                className="btn-primary disabled:opacity-50"
              >
                {updating ? "Updating..." : "Update Status"}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BookingsPage;
