import React, { useEffect, useState, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchServices,
  createService,
  updateService,
  deleteService,
  toggleServiceStatus,
  setSelectedService,
  clearSelectedService,
} from "../store/slices/serviceSlice";
import { Service } from "../types";
import DataTable from "../components/common/DataTable";
import SearchInput from "../components/common/SearchInput";
import Modal from "../components/common/Modal";
import ConfirmDialog from "../components/common/ConfirmDialog";

// ── Hardcoded category list (edit here or wire up to an API later) ────────────
const DEFAULT_CATEGORIES = [
  { id: "1", name: "AC Services",       icon: "❄️" },
  { id: "2", name: "Refrigerator",      icon: "🧊" },
  { id: "3", name: "Washing Machine",   icon: "👕" },
  { id: "4", name: "Fan & Electricals", icon: "⚡" },
  { id: "5", name: "Plumbing",          icon: "🔧" },
  { id: "6", name: "Carpentry",         icon: "🪚" },
  { id: "7", name: "Painting",          icon: "🎨" },
  { id: "8", name: "Pest Control",      icon: "🐛" },
];

type Tab = "services" | "categories";

interface Category { id: string; name: string; icon: string; }

const INITIAL_FORM: Partial<Service> = {
  name: "",
  category: DEFAULT_CATEGORIES[0].name,
  description: "",
  price: 0,
  duration: 60,
  status: "unpublished",
};

const ServicesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, loading, total } = useAppSelector((s) => s.services);
  const selectedService = useAppSelector((s) => s.services.selectedItem);

  // ── Tab state ────────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<Tab>("services");

  // ── Category management state ────────────────────────────────────────────────
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [showCatForm, setShowCatForm] = useState(false);
  const [catEditTarget, setCatEditTarget] = useState<Category | null>(null);
  const [catForm, setCatForm] = useState({ name: "", icon: "" });

  const openCreateCat = () => { setCatEditTarget(null); setCatForm({ name: "", icon: "" }); setShowCatForm(true); };
  const openEditCat   = (c: Category) => { setCatEditTarget(c); setCatForm({ name: c.name, icon: c.icon }); setShowCatForm(true); };
  const handleCatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (catEditTarget) {
      setCategories((cs) => cs.map((c) => c.id === catEditTarget.id ? { ...c, ...catForm } : c));
    } else {
      setCategories((cs) => [...cs, { id: Date.now().toString(), ...catForm }]);
    }
    setShowCatForm(false);
  };
  const handleCatDelete = (id: string) => setCategories((cs) => cs.filter((c) => c.id !== id));

  // ── Services state ───────────────────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "unpublished">("all");
  const [showModal, setShowModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [form, setForm] = useState<Partial<Service>>(INITIAL_FORM);
  const [page, setPage] = useState(1);
  const LIMIT = 10;

  const loadServices = useCallback(() => {
    dispatch(
      fetchServices({
        page,
        limit: LIMIT,
        search: search || undefined,
        ...(categoryFilter !== "all" ? { category: categoryFilter } : {}),
        ...(statusFilter !== "all" ? { status: statusFilter } : {}),
      })
    );
  }, [dispatch, page, search, categoryFilter, statusFilter]);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  const openCreate = () => {
    dispatch(clearSelectedService());
    setForm(INITIAL_FORM);
    setShowModal(true);
  };

  const openEdit = (service: Service) => {
    dispatch(setSelectedService(service));
    setForm(service);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    dispatch(clearSelectedService());
    setForm(INITIAL_FORM);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedService) {
      await dispatch(updateService({ id: selectedService.id, data: form }));
    } else {
      await dispatch(createService(form));
    }
    closeModal();
    loadServices();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    await dispatch(deleteService(deleteTarget.id));
    setDeleteLoading(false);
    setDeleteTarget(null);
  };

  const handleToggle = (id: string) => {
    dispatch(toggleServiceStatus(id));
  };

  const totalPages = Math.ceil(total / LIMIT);

  const columns = [
    {
      key: "name",
      label: "Service Name",
      render: (_: any, row: Service) => (
        <div>
          <p className="font-medium text-gray-900">{row.name}</p>
          <p className="text-xs text-gray-400">{row.category}</p>
        </div>
      ),
    },
    {
      key: "price",
      label: "Price",
      render: (v: number) => (
        <span className="font-semibold text-gray-800">₹{v.toLocaleString("en-IN")}</span>
      ),
    },
    {
      key: "duration",
      label: "Duration",
      render: (v: number) => `${v} min`,
    },
    {
      key: "status",
      label: "Status",
      render: (v: Service["status"], row: Service) => (
        <button
          onClick={() => handleToggle(row.id)}
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            v === "published"
              ? "bg-green-100 text-green-700 hover:bg-green-200"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${v === "published" ? "bg-green-500" : "bg-gray-400"}`}
          />
          {v === "published" ? "Published" : "Unpublished"}
        </button>
      ),
    },
    {
      key: "id",
      label: "Actions",
      render: (_: any, row: Service) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => openEdit(row)}
            className="p-1.5 rounded-lg text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            title="Edit"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => setDeleteTarget(row)}
            className="p-1.5 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
            title="Delete"
          >
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Services</h2>
          <p className="text-sm text-gray-500">{total} services total</p>
        </div>
        {activeTab === "services" ? (
          <button onClick={openCreate} className="btn-primary flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Service
          </button>
        ) : (
          <button onClick={openCreateCat} className="btn-primary flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Category
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200">
        {(["services", "categories"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium capitalize border-b-2 transition-colors ${
              activeTab === tab
                ? "border-primary-600 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── Categories tab ──────────────────────────────────────────────────── */}
      {activeTab === "categories" && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <div key={cat.id} className="card group hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="text-3xl mb-3">{cat.icon}</div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEditCat(cat)}
                      className="p-1.5 rounded-lg text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleCatDelete(cat.id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900">{cat.name}</h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  {items.filter((s: Service) => s.category === cat.name).length} services
                </p>
              </div>
            ))}
          </div>

          {showCatForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
              <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                <h2 className="text-lg font-semibold mb-4">
                  {catEditTarget ? "Edit Category" : "Add Category"}
                </h2>
                <form onSubmit={handleCatSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Icon (emoji)</label>
                    <input className="input" value={catForm.icon} onChange={(e) => setCatForm((f) => ({ ...f, icon: e.target.value }))} placeholder="❄️" maxLength={4} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                    <input required className="input" value={catForm.name} onChange={(e) => setCatForm((f) => ({ ...f, name: e.target.value }))} placeholder="AC Services" />
                  </div>
                  <div className="flex gap-3 justify-end">
                    <button type="button" onClick={() => setShowCatForm(false)} className="btn-secondary">Cancel</button>
                    <button type="submit" className="btn-primary">{catEditTarget ? "Update" : "Add"}</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── Services tab ────────────────────────────────────────────────────── */}
      {activeTab === "services" && (<>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-3">
          <SearchInput
            value={search}
            onChange={(v) => { setSearch(v); setPage(1); }}
            placeholder="Search services..."
            className="flex-1"
          />
          <select
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
            className="input w-auto"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value as any); setPage(1); }}
            className="input w-auto"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="unpublished">Unpublished</option>
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
          emptyMessage="No services found. Add your first service."
        />
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Page {page} of {totalPages}
            </p>
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

      {/* Create / Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={selectedService ? "Edit Service" : "Add New Service"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Service Name *
              </label>
              <input
                required
                className="input"
                placeholder="e.g. AC Repair"
                value={form.name ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                className="input"
                value={form.category ?? "AC Services"}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (₹) *
              </label>
              <input
                required
                type="number"
                min={0}
                className="input"
                placeholder="499"
                value={form.price ?? 0}
                onChange={(e) =>
                  setForm((f) => ({ ...f, price: parseFloat(e.target.value) || 0 }))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (minutes)
              </label>
              <input
                type="number"
                min={15}
                step={15}
                className="input"
                placeholder="60"
                value={form.duration ?? 60}
                onChange={(e) =>
                  setForm((f) => ({ ...f, duration: parseInt(e.target.value) || 60 }))
                }
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              rows={3}
              className="input resize-none"
              placeholder="Brief description of the service..."
              value={form.description ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <div className="flex gap-4">
              {(["published", "unpublished"] as const).map((s) => (
                <label key={s} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value={s}
                    checked={form.status === s}
                    onChange={() => setForm((f) => ({ ...f, status: s }))}
                    className="text-primary-600"
                  />
                  <span className="text-sm capitalize">{s}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2 justify-end border-t border-gray-100">
            <button type="button" onClick={closeModal} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {selectedService ? "Update Service" : "Create Service"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete confirm */}
      {deleteTarget && (
        <ConfirmDialog
          message={`Delete "${deleteTarget.name}"? This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleteLoading}
        />
      )}
      </>)}
    </div>
  );
};

export default ServicesPage;
