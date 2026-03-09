import React, { useState } from "react";

const CATEGORIES = [
  { id: "1", name: "AC Services",      icon: "❄️",  count: 5 },
  { id: "2", name: "Refrigerator",     icon: "🧊",  count: 4 },
  { id: "3", name: "Washing Machine",  icon: "👕",  count: 3 },
  { id: "4", name: "Fan & Electricals",icon: "⚡",  count: 6 },
  { id: "5", name: "Plumbing",         icon: "🔧",  count: 5 },
  { id: "6", name: "Carpentry",        icon: "🪚",  count: 3 },
  { id: "7", name: "Painting",         icon: "🎨",  count: 2 },
  { id: "8", name: "Pest Control",     icon: "🐛",  count: 4 },
];

interface Category { id: string; name: string; icon: string; count: number; }

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>(CATEGORIES);
  const [showForm, setShowForm]     = useState(false);
  const [editTarget, setEditTarget] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: "", icon: "" });

  const openCreate = () => { setEditTarget(null); setForm({ name: "", icon: "" }); setShowForm(true); };
  const openEdit   = (c: Category) => { setEditTarget(c); setForm({ name: c.name, icon: c.icon }); setShowForm(true); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editTarget) {
      setCategories((cs) => cs.map((c) => c.id === editTarget.id ? { ...c, ...form } : c));
    } else {
      setCategories((cs) => [...cs, { id: Date.now().toString(), ...form, count: 0 }]);
    }
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    setCategories((cs) => cs.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Categories</h2>
          <p className="text-sm text-gray-500">{categories.length} categories</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Category
        </button>
      </div>

      {/* Category grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <div key={cat.id} className="card group hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="text-3xl mb-3">{cat.icon}</div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => openEdit(cat)}
                  className="p-1.5 rounded-lg text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
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
            <p className="text-sm text-gray-500 mt-0.5">{cat.count} services</p>
          </div>
        ))}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-semibold mb-4">
              {editTarget ? "Edit Category" : "Add Category"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Icon (emoji)</label>
                <input className="input" value={form.icon} onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))} placeholder="❄️" maxLength={4} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input required className="input" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="AC Services" />
              </div>
              <div className="flex gap-3 justify-end">
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">{editTarget ? "Update" : "Add"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
