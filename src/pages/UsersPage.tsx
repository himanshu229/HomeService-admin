import React, { useState } from "react";
import SearchInput from "../components/common/SearchInput";

const MOCK_USERS = Array.from({ length: 12 }, (_, i) => ({
  id: String(i + 1),
  name: `Customer ${i + 1}`,
  email: `customer${i + 1}@example.com`,
  phone: `+91 98765${String(43210 + i).padStart(5, "0")}`,
  totalBookings: Math.floor(Math.random() * 20),
  createdAt: new Date(Date.now() - i * 86400000 * 30).toISOString(),
}));

const UsersPage: React.FC = () => {
  const [search, setSearch] = useState("");

  const filtered = MOCK_USERS.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Users</h2>
          <p className="text-sm text-gray-500">{MOCK_USERS.length} registered customers</p>
        </div>
      </div>

      <div className="card">
        <SearchInput value={search} onChange={setSearch} placeholder="Search users..." className="max-w-sm" />
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {["Name", "Email", "Phone", "Total Bookings", "Joined"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-semibold text-sm">
                        {u.name.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{u.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{u.phone}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                      {u.totalBookings} bookings
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(u.createdAt).toLocaleDateString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
