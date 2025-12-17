import { useEffect, useState } from "react";
import { getAdminDashboard } from "../api/admin.api";

export default function AdminDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    getAdminDashboard().then(res => setData(res.data));
  }, []);

  if (!data) return null;

  const { stats } = data;

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6">📊 Admin Dashboard</h2>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-10">
        <Stat title="Users" value={stats.totalUsers} />
        <Stat title="Books" value={stats.totalBooks} />
        <Stat title="Orders" value={stats.totalOrders} />
        <Stat title="Revenue" value={`₹${stats.totalRevenue}`} />
        <Stat title="Avg Rating" value={stats.avgRating.toFixed(1)} />
      </div>

      {/* CATEGORY STATS */}
      <h3 className="text-xl font-semibold mb-3">📂 Categories</h3>
      <div className="flex gap-4 flex-wrap">
        {data.categoryStats.map(c => (
          <span
            key={c._id}
            className="px-4 py-2 bg-white rounded-lg shadow"
          >
            {c._id}: {c.count}
          </span>
        ))}
      </div>
    </div>
  );
}

const Stat = ({ title, value }) => (
  <div className="bg-white p-6 rounded-xl shadow">
    <p className="text-gray-500">{title}</p>
    <h3 className="text-2xl font-bold">{value}</h3> 
  </div>
);
