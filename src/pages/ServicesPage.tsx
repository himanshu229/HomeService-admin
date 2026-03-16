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
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../store/slices/categorySlice";
import { Service, ServiceCategory } from "../types";
import DataTable from "../components/common/DataTable";
import SearchInput from "../components/common/SearchInput";
import Modal from "../components/common/Modal";
import ConfirmDialog from "../components/common/ConfirmDialog";

// ── Preset icons for category selection ─────────────────────────────────────
const CATEGORY_ICONS = [
  { label: "❄️  AC / Cooling",        value: "❄️"  },
  { label: "🧊  Refrigerator",         value: "🧊"  },
  { label: "👕  Washing Machine",      value: "👕"  },
  { label: "⚡  Fan & Electricals",    value: "⚡"  },
  { label: "🔧  Plumbing / Tools",     value: "🔧"  },
  { label: "🪚  Carpentry",            value: "🪚"  },
  { label: "🎨  Painting",             value: "🎨"  },
  { label: "🐛  Pest Control",         value: "🐛"  },
  { label: "🏠  Home Services",        value: "🏠"  },
  { label: "🔌  Electronics",          value: "🔌"  },
];
const CUSTOM_ICON_VALUE = "__custom__";

type Tab = "services" | "categories";

const INITIAL_FORM: Partial<Service> = {
  name: "",
  categoryId: "",
  price: 0,
  aboutService: "",
  whatsIncluded: "",
  warranty: "",
  status: "unpublished",
};

const INITIAL_CAT_FORM = { name: "", emoji: "" };

const ServicesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, loading, total } = useAppSelector((s) => s.services);
  const selectedService = useAppSelector((s) => s.services.selectedItem);
  const { items: categories, loading: catLoading } = useAppSelector((s) => s.categories);

  // ── Tab state ────────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<Tab>("services");

  // ── Category management state ────────────────────────────────────────────────
  const [showCatForm, setShowCatForm] = useState(false);
  const [catEditTarget, setCatEditTarget] = useState<ServiceCategory | null>(null);
  const [catForm, setCatForm] = useState(INITIAL_CAT_FORM);
  const [showCustomIcon, setShowCustomIcon] = useState(false);
  const [catDeleteTarget, setCatDeleteTarget] = useState<ServiceCategory | null>(null);
  const [catDeleteLoading, setCatDeleteLoading] = useState(false);

  const openCreateCat = () => { setCatEditTarget(null); setCatForm(INITIAL_CAT_FORM); setShowCustomIcon(false); setCatError(""); setShowCatForm(true); };
  const openEditCat = (cat: ServiceCategory) => {
    setCatEditTarget(cat);
    setCatForm({ name: cat.name, emoji: cat.emoji });
    const isPreset = CATEGORY_ICONS.some((i) => i.value === cat.emoji);
    setShowCustomIcon(!isPreset && cat.emoji !== "");
    setCatError("");
    setShowCatForm(true);
  };
  const [catError, setCatError] = useState("");

  const handleCatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCatError("");

    // Frontend duplicate check
    const isDuplicate = categories.some(
      (c) =>
        c.name.trim().toLowerCase() === catForm.name.trim().toLowerCase() &&
        (!catEditTarget || c.id !== catEditTarget.id)
    );
    if (isDuplicate) {
      setCatError(`Category "${catForm.name.trim()}" already exists.`);
      return;
    }

    const result = catEditTarget
      ? await dispatch(updateCategory({ id: catEditTarget.id, data: catForm }))
      : await dispatch(createCategory(catForm));

    if ((result as any).error) {
      setCatError((result as any).payload ?? "Failed to save category.");
      return;
    }
    setShowCatForm(false);
    dispatch(fetchCategories());
  };
  const handleCatDelete = async () => {
    if (!catDeleteTarget) return;
    setCatDeleteLoading(true);
    await dispatch(deleteCategory(catDeleteTarget.id));
    setCatDeleteLoading(false);
    setCatDeleteTarget(null);
    dispatch(fetchCategories());
  };

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
  }, [page, search, categoryFilter, statusFilter]);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  useEffect(() => {
    dispatch(fetchCategories());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openCreate = () => {
    dispatch(clearSelectedService());
    setForm(INITIAL_FORM);
    setShowModal(true);
  };

  const openEdit = (service: Service) => {
    dispatch(setSelectedService(service));
    const resolvedCategoryId =
      service.categoryId ??
      (typeof service.category === 'object' ? (service.category as any).id : service.category);
    setForm({
      ...service,
      categoryId:   resolvedCategoryId,
      aboutService: (service as any).aboutService ?? (service as any).description ?? '',
      whatsIncluded: (service as any).whatsIncluded ?? '',
      status:       service.status ?? ((service as any).isActive ? 'published' : 'unpublished'),
    });
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
          <p className="text-xs text-gray-400">
            {typeof row.category === 'object' ? row.category.name : row.category}
          </p>
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
      key: "status",
      label: "Status",
      render: (v: Service["status"], row: Service) => {
        const isPublished = v === "published" || (row as any).isActive === true;
        return (
          <button
            onClick={() => handleToggle(row.id)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
              isPublished ? "bg-green-500" : "bg-gray-300"
            }`}
            title={isPublished ? "Published — click to unpublish" : "Unpublished — click to publish"}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                isPublished ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        );
      },
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
                  <div className="text-3xl mb-3">{cat.emoji}</div>
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
                      onClick={() => setCatDeleteTarget(cat)}
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
                {cat.description && (
                  <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{cat.description}</p>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  {cat.serviceCount ?? items.filter((s: Service) => {
                    const catName = typeof s.category === 'object' ? s.category.name : s.category;
                    return catName === cat.name;
                  }).length} services
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                    <input required className="input" value={catForm.name} onChange={(e) => setCatForm((f) => ({ ...f, name: e.target.value }))} placeholder="AC Services" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Icon *</label>
                    <select
                      required
                      className="input"
                      value={showCustomIcon ? CUSTOM_ICON_VALUE : (catForm.emoji || "")}
                      onChange={(e) => {
                        if (e.target.value === CUSTOM_ICON_VALUE) {
                          setShowCustomIcon(true);
                          setCatForm((f) => ({ ...f, emoji: "" }));
                        } else {
                          setShowCustomIcon(false);
                          setCatForm((f) => ({ ...f, emoji: e.target.value }));
                        }
                      }}
                    >
                      <option value="" disabled>Select an icon…</option>
                      {CATEGORY_ICONS.map((ic) => (
                        <option key={ic.value} value={ic.value}>{ic.label}</option>
                      ))}
                      <option value={CUSTOM_ICON_VALUE}>➕ Add Icon (custom emoji)</option>
                    </select>
                    {showCustomIcon && (
                      <input
                        required
                        className="input mt-2"
                        placeholder="Paste or type an emoji, e.g. 🛠️"
                        maxLength={4}
                        value={catForm.emoji}
                        onChange={(e) => setCatForm((f) => ({ ...f, emoji: e.target.value }))}
                      />
                    )}
                  </div>
                  {catError && (
                    <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{catError}</p>
                  )}
                  <div className="flex gap-3 justify-end">
                    <button type="button" onClick={() => setShowCatForm(false)} className="btn-secondary">Cancel</button>
                    <button type="submit" disabled={catLoading} className="btn-primary">
                      {catLoading ? "Saving…" : catEditTarget ? "Update" : "Add"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {catDeleteTarget && (
            <ConfirmDialog
              message={`Delete "${catDeleteTarget.name}"? This cannot be undone.`}
              onConfirm={handleCatDelete}
              onCancel={() => setCatDeleteTarget(null)}
              loading={catDeleteLoading}
            />
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
                required
                className="input"
                value={form.categoryId ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
              >
                <option value="" disabled>Select a category…</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>
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
                Warranty *
              </label>
              <input
                required
                type="text"
                className="input"
                placeholder="e.g. 30 Days"
                value={form.warranty ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, warranty: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">About the Service *</label>
            <textarea
              required
              rows={3}
              className="input resize-none"
              placeholder="Detailed information about what this service involves..."
              value={form.aboutService ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, aboutService: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">What's Included *</label>
            <textarea
              required
              rows={3}
              className="input resize-none"
              placeholder="e.g. Free diagnosis, Certified technician, Original spare parts (one per line)"
              value={form.whatsIncluded ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, whatsIncluded: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, status: f.status === "published" ? "unpublished" : "published" }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  form.status === "published" ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                    form.status === "published" ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
              <span className={`text-sm font-medium ${
                form.status === "published" ? "text-green-700" : "text-gray-500"
              }`}>
                {form.status === "published" ? "Published" : "Unpublished"}
              </span>
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
