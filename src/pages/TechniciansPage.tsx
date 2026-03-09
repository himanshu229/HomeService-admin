import React, { useEffect, useState, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchTechnicians,
  createTechnician,
  updateTechnician,
  deleteTechnician,
  setSelectedTechnician,
  clearSelectedTechnician,
} from "../store/slices/technicianSlice";
import { Technician } from "../types";
import DataTable from "../components/common/DataTable";
import SearchInput from "../components/common/SearchInput";
import Modal from "../components/common/Modal";
import ConfirmDialog from "../components/common/ConfirmDialog";

const SPECIALIZATIONS = [
  "AC Services", "Refrigerator", "Washing Machine",
  "Fan & Electricals", "Plumbing", "Carpentry",
];

const INIT_FORM: Partial<Technician> = {
  name: "", email: "", phone: "",
  specializations: [], status: "active",
};

const TechniciansPage: React.FC = () => {
  const dispatch  = useAppDispatch();
  const { items, loading, total } = useAppSelector((s) => s.technicians);
  const selected  = useAppSelector((s) => s.technicians.selectedItem);

  const [search, setSearch]             = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive" | "on_job">("all");
  const [page, setPage]                 = useState(1);
  const [showModal, setShowModal]       = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Technician | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [form, setForm]                 = useState<Partial<Technician>>(INIT_FORM);
  const LIMIT = 10;

  const load = useCallback(() => {
    dispatch(
      fetchTechnicians({
        page,
        limit: LIMIT,
        search: search || undefined,
        status: statusFilter !== "all" ? (statusFilter as Technician["status"]) : undefined,
      })
    );
  }, [dispatch, page, search, statusFilter]);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => {
    dispatch(clearSelectedTechnician());
    setForm(INIT_FORM);
    setShowModal(true);
  };

  const openEdit = (t: Technician) => {
    dispatch(setSelectedTechnician(t));
    setForm(t);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    dispatch(clearSelectedTechnician());
    setForm(INIT_FORM);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selected) {
      await dispatch(updateTechnician({ id: selected.id, data: form }));
    } else {
      await dispatch(createTechnician(form));
    }
    closeModal();
    load();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    await dispatch(deleteTechnician(deleteTarget.id));
    setDeleteLoading(false);
    setDeleteTarget(null);
  };

  const toggleSpec = (spec: string) => {
    setForm((f) => {
      const specs = f.specializations ?? [];
      return {
        ...f,
        specializations: specs.includes(spec)
          ? specs.filter((s) => s !== spec)
          : [...specs, spec],
      };
    });
  };

  const totalPages = Math.ceil(total / LIMIT);

  const statusBadge = (status: Technician["status"]) => {
    const map = {
      active:   "bg-green-100 text-green-700",
      inactive: "bg-gray-100 text-gray-600",
      on_job:   "bg-blue-100 text-blue-700",
    };
    const labels = { active: "Active", inactive: "Inactive", on_job: "On Job" };
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${map[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const columns = [
    {
      key: "name",
      label: "Name",
      render: (_: any, row: Technician) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-semibold text-sm flex-shrink-0">
            {row.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-gray-900">{row.name}</p>
            <p className="text-xs text-gray-400">{row.email}</p>
          </div>
        </div>
      ),
    },
    { key: "phone", label: "Phone" },
    {
      key: "specializations",
      label: "Specializations",
      render: (v: string[]) => (
        <div className="flex flex-wrap gap-1">
          {(v ?? []).slice(0, 2).map((s) => (
            <span key={s} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">{s}</span>
          ))}
          {(v ?? []).length > 2 && (
            <span className="text-xs text-gray-400">+{v.length - 2}</span>
          )}
        </div>
      ),
    },
    {
      key: "rating",
      label: "Rating",
      render: (v: number) => (
        <div className="flex items-center gap-1">
          <span className="text-yellow-400 text-sm">★</span>
          <span className="text-sm font-medium">{v?.toFixed(1) ?? "—"}</span>
        </div>
      ),
    },
    { key: "totalJobs", label: "Jobs" },
    {
      key: "status",
      label: "Status",
      render: (v: Technician["status"]) => statusBadge(v),
    },
    {
      key: "id",
      label: "Actions",
      render: (_: any, row: Technician) => (
        <div className="flex gap-2">
          <button onClick={() => openEdit(row)} className="p-1.5 rounded-lg text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-colors" title="Edit">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button onClick={() => setDeleteTarget(row)} className="p-1.5 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors" title="Delete">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Technicians</h2>
          <p className="text-sm text-gray-500">{total} registered technicians</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Technician
        </button>
      </div>

      <div className="card">
        <div className="flex flex-col sm:flex-row gap-3">
          <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search technicians..." className="flex-1" />
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value as any); setPage(1); }} className="input w-auto">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="on_job">On Job</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <DataTable columns={columns} data={items} loading={loading} keyExtractor={(r) => r.id} emptyMessage="No technicians found." />
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
            <p className="text-sm text-gray-500">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary py-1 px-3 text-xs disabled:opacity-50">Previous</button>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="btn-secondary py-1 px-3 text-xs disabled:opacity-50">Next</button>
            </div>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      <Modal isOpen={showModal} onClose={closeModal} title={selected ? "Edit Technician" : "Add Technician"} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input required className="input" value={form.name ?? ""} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
              <input required className="input" value={form.phone ?? ""} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="+91 9876543210" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input required type="email" className="input" value={form.email ?? ""} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="tech@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select className="input" value={form.status ?? "active"} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as Technician["status"] }))}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Specializations</label>
            <div className="flex flex-wrap gap-2">
              {SPECIALIZATIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleSpec(s)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                    (form.specializations ?? []).includes(s)
                      ? "bg-primary-600 text-white border-primary-600"
                      : "bg-white text-gray-600 border-gray-300 hover:border-primary-400"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 justify-end border-t border-gray-100 pt-3">
            <button type="button" onClick={closeModal} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">{selected ? "Update" : "Add Technician"}</button>
          </div>
        </form>
      </Modal>

      {deleteTarget && (
        <ConfirmDialog
          message={`Remove technician "${deleteTarget.name}"?`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleteLoading}
        />
      )}
    </div>
  );
};

export default TechniciansPage;
