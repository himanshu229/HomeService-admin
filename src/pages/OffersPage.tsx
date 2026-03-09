import React, { useState } from "react";
import { Offer, DiscountType } from "../types";

const MOCK_OFFERS: Offer[] = [
  { id: "1", code: "SUMMER20", title: "Summer 20% Off", description: "Get 20% off on all AC services", discountType: "percentage", discountValue: 20, minOrderAmount: 500, maxUses: 100, usedCount: 34, expiresAt: "2026-06-30", isActive: true },
  { id: "2", code: "FLAT100",  title: "₹100 Flat Off",  description: "₹100 off on orders above ₹1000",discountType: "flat",       discountValue: 100,minOrderAmount: 1000,maxUses: 200, usedCount: 89, expiresAt: "2026-05-15", isActive: true },
  { id: "3", code: "NEW15",    title: "New User 15%",   description: "15% off for first-time users",  discountType: "percentage", discountValue: 15, minOrderAmount: 300, maxUses: 500, usedCount: 201,expiresAt: "2026-12-31", isActive: false },
];

const INIT_FORM: Partial<Offer> = {
  code: "", title: "", description: "",
  discountType: "percentage", discountValue: 0,
  minOrderAmount: 0, maxUses: 100, expiresAt: "", isActive: true,
};

const OffersPage: React.FC = () => {
  const [offers, setOffers]   = useState<Offer[]>(MOCK_OFFERS);
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Offer | null>(null);
  const [form, setForm]       = useState<Partial<Offer>>(INIT_FORM);

  const openCreate = () => { setEditTarget(null); setForm(INIT_FORM); setShowModal(true); };
  const openEdit   = (o: Offer) => { setEditTarget(o); setForm(o); setShowModal(true); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editTarget) {
      setOffers((os) => os.map((o) => o.id === editTarget.id ? { ...o, ...form } as Offer : o));
    } else {
      setOffers((os) => [
        ...os,
        { ...form, id: Date.now().toString(), usedCount: 0 } as Offer,
      ]);
    }
    setShowModal(false);
  };

  const toggle = (id: string) =>
    setOffers((os) => os.map((o) => o.id === id ? { ...o, isActive: !o.isActive } : o));

  const remove = (id: string) => setOffers((os) => os.filter((o) => o.id !== id));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Offers & Discounts</h2>
          <p className="text-sm text-gray-500">{offers.filter((o) => o.isActive).length} active offers</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Offer
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {offers.map((offer) => (
          <div key={offer.id} className={`card border-2 transition-all ${offer.isActive ? "border-green-200" : "border-gray-200 opacity-75"}`}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <span className="inline-block font-mono font-bold text-primary-700 bg-primary-50 px-2.5 py-0.5 rounded text-sm tracking-wider">
                  {offer.code}
                </span>
                <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${offer.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  {offer.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(offer)} className="p-1.5 rounded text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button onClick={() => remove(offer.id)} className="p-1.5 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <h3 className="font-semibold text-gray-900">{offer.title}</h3>
            <p className="text-sm text-gray-500 mt-1">{offer.description}</p>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-gray-400">Discount</p>
                <p className="font-semibold text-gray-800">
                  {offer.discountType === "percentage"
                    ? `${offer.discountValue}%`
                    : `₹${offer.discountValue}`}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Min. Order</p>
                <p className="font-semibold text-gray-800">₹{offer.minOrderAmount}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Usage</p>
                <p className="font-semibold text-gray-800">{offer.usedCount} / {offer.maxUses}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Expires</p>
                <p className="font-semibold text-gray-800">
                  {new Date(offer.expiresAt).toLocaleDateString("en-IN")}
                </p>
              </div>
            </div>

            {/* Usage progress */}
            <div className="mt-4">
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div
                  className="bg-primary-500 h-1.5 rounded-full transition-all"
                  style={{ width: `${Math.min(100, (offer.usedCount / offer.maxUses) * 100)}%` }}
                />
              </div>
            </div>

            <button
              onClick={() => toggle(offer.id)}
              className={`mt-4 w-full py-1.5 rounded-lg text-xs font-medium transition-colors ${
                offer.isActive
                  ? "text-red-600 hover:bg-red-50 border border-red-200"
                  : "text-green-600 hover:bg-green-50 border border-green-200"
              }`}
            >
              {offer.isActive ? "Deactivate" : "Activate"}
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">{editTarget ? "Edit Offer" : "Create Offer"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Code *</label>
                  <input required className="input uppercase" value={form.code ?? ""} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))} placeholder="SUMMER20" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
                  <select className="input" value={form.discountType ?? "percentage"} onChange={(e) => setForm((f) => ({ ...f, discountType: e.target.value as DiscountType }))}>
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount Value *</label>
                  <input required type="number" min={0} className="input" value={form.discountValue ?? 0} onChange={(e) => setForm((f) => ({ ...f, discountValue: parseFloat(e.target.value) || 0 }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min. Order (₹)</label>
                  <input type="number" min={0} className="input" value={form.minOrderAmount ?? 0} onChange={(e) => setForm((f) => ({ ...f, minOrderAmount: parseFloat(e.target.value) || 0 }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Uses</label>
                  <input type="number" min={1} className="input" value={form.maxUses ?? 100} onChange={(e) => setForm((f) => ({ ...f, maxUses: parseInt(e.target.value) || 100 }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expires At</label>
                  <input type="date" className="input" value={form.expiresAt ?? ""} onChange={(e) => setForm((f) => ({ ...f, expiresAt: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input required className="input" value={form.title ?? ""} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Summer 20% Off" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea rows={2} className="input resize-none" value={form.description ?? ""} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
              </div>
              <div className="flex gap-3 justify-end border-t border-gray-100 pt-3">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">{editTarget ? "Update" : "Create"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OffersPage;
