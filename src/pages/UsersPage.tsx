import React, { useCallback, useDeferredValue, useEffect, useState } from "react";
import { adminUserApi } from "../api/user.api";
import DataTable from "../components/common/DataTable";
import Modal from "../components/common/Modal";
import SearchInput from "../components/common/SearchInput";
import type { Customer } from "../types";
import {
  createCustomerSchema,
  type CreateCustomerFormValues,
} from "../validations/user.validation";

const LIMIT = 10;

const INITIAL_FORM: CreateCustomerFormValues = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  gender: "MALE",
  dob: "",
};

const UsersPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState<Customer[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("");
  const [form, setForm] = useState<CreateCustomerFormValues>(INITIAL_FORM);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof CreateCustomerFormValues, string>>>({});
  const deferredSearch = useDeferredValue(search);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await adminUserApi.getAll({
        page,
        limit: LIMIT,
        search: deferredSearch.trim() || undefined,
      });

      setUsers(response.data.data);
      setTotal(response.data.total);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Failed to load users.");
    } finally {
      setLoading(false);
    }
  }, [deferredSearch, page]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const totalPages = Math.ceil(total / LIMIT);

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setCreateError("");
    setFieldErrors({});
    setForm(INITIAL_FORM);
  };

  const handleCreateUser = async (event: React.FormEvent) => {
    event.preventDefault();
    setCreateError("");

    const parsed = createCustomerSchema.safeParse(form);
    if (!parsed.success) {
      const nextErrors: Partial<Record<keyof CreateCustomerFormValues, string>> = {};
      const flat = parsed.error.flatten().fieldErrors;

      (Object.keys(flat) as Array<keyof CreateCustomerFormValues>).forEach((key) => {
        const firstError = flat[key]?.[0];
        if (firstError) nextErrors[key] = firstError;
      });

      setFieldErrors(nextErrors);
      return;
    }

    setCreateLoading(true);
    setFieldErrors({});

    try {
      const response = await adminUserApi.create({
        ...parsed.data,
        phone: parsed.data.phone.replace(/\D/g, ""),
        email: parsed.data.email?.trim() || undefined,
      });

      const createdUser = response.data.data;
      setTotal((currentTotal) => currentTotal + 1);
      setUsers((currentUsers) => {
        if (page === 1 && !deferredSearch.trim()) {
          return [createdUser, ...currentUsers].slice(0, LIMIT);
        }
        return currentUsers;
      });

      setSearch("");
      setPage(1);
      closeCreateModal();
    } catch (err: any) {
      setCreateError(err?.response?.data?.message ?? "Failed to create user.");
    } finally {
      setCreateLoading(false);
    }
  };

  const columns = [
    {
      key: "name",
      label: "Name",
      render: (_: unknown, row: Customer) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-semibold text-sm">
            {row.name.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm font-medium text-gray-900">{row.name}</span>
        </div>
      ),
    },
    {
      key: "email",
      label: "Email",
      render: (value: string) => (
        <span className="text-sm text-gray-600">{value || "-"}</span>
      ),
    },
    {
      key: "phone",
      label: "Phone",
      render: (value: string) => <span className="text-sm text-gray-600">{value}</span>,
    },
    {
      key: "totalBookings",
      label: "Total Bookings",
      render: (value: number) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
          {value} bookings
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Joined",
      render: (value: string) => (
        <span className="text-sm text-gray-500">
          {new Date(value).toLocaleDateString("en-IN")}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Users</h2>
          <p className="text-sm text-gray-500">{total} registered customers</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="btn-primary flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add User
        </button>
      </div>

      <div className="card">
        <SearchInput
          value={search}
          onChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          placeholder="Search users by name, email, or phone..."
          className="max-w-sm"
        />
      </div>

      {error && (
        <div className="card border border-red-200 bg-red-50 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="card p-0 overflow-hidden">
        <DataTable
          columns={columns}
          data={users}
          loading={loading}
          keyExtractor={(user) => user.id}
          emptyMessage="No users found."
        />
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
            <p className="text-sm text-gray-500">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((currentPage) => Math.max(1, currentPage - 1))}
                disabled={page === 1 || loading}
                className="btn-secondary py-1 px-3 text-xs disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((currentPage) => Math.min(totalPages, currentPage + 1))}
                disabled={page === totalPages || loading}
                className="btn-secondary py-1 px-3 text-xs disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <Modal isOpen={showCreateModal} onClose={closeCreateModal} title="Add User" size="lg">
        <form onSubmit={handleCreateUser} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
              <input
                className={`input ${fieldErrors.firstName ? "border-red-500 focus:ring-red-500" : ""}`}
                value={form.firstName}
                onChange={(event) => setForm({ ...form, firstName: event.target.value })}
                placeholder="Aarav"
              />
              {fieldErrors.firstName && <p className="mt-1 text-xs text-red-600">{fieldErrors.firstName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
              <input
                className={`input ${fieldErrors.lastName ? "border-red-500 focus:ring-red-500" : ""}`}
                value={form.lastName}
                onChange={(event) => setForm({ ...form, lastName: event.target.value })}
                placeholder="Sharma"
              />
              {fieldErrors.lastName && <p className="mt-1 text-xs text-red-600">{fieldErrors.lastName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
              <input
                className={`input ${fieldErrors.phone ? "border-red-500 focus:ring-red-500" : ""}`}
                value={form.phone}
                onChange={(event) => setForm({ ...form, phone: event.target.value })}
                placeholder="9876543210"
              />
              {fieldErrors.phone && <p className="mt-1 text-xs text-red-600">{fieldErrors.phone}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                className={`input ${fieldErrors.email ? "border-red-500 focus:ring-red-500" : ""}`}
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                placeholder="user@example.com"
              />
              {fieldErrors.email && <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
              <select
                className={`input ${fieldErrors.gender ? "border-red-500 focus:ring-red-500" : ""}`}
                value={form.gender}
                onChange={(event) => setForm({ ...form, gender: event.target.value as CreateCustomerFormValues["gender"] })}
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
              {fieldErrors.gender && <p className="mt-1 text-xs text-red-600">{fieldErrors.gender}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
              <input
                type="date"
                className={`input ${fieldErrors.dob ? "border-red-500 focus:ring-red-500" : ""}`}
                value={form.dob}
                onChange={(event) => setForm({ ...form, dob: event.target.value })}
              />
              {fieldErrors.dob && <p className="mt-1 text-xs text-red-600">{fieldErrors.dob}</p>}
            </div>
          </div>

          {createError && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{createError}</p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={closeCreateModal} className="btn-secondary" disabled={createLoading}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={createLoading}>
              {createLoading ? "Creating..." : "Create User"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UsersPage;
