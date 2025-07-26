// src/pages/admin/AdminDashboard.jsx
import { useEffect, useState } from "react";

const AdminDashboard = () => {
  const [data, setData] = useState({
    totalUsers: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
  });

  useEffect(() => {
    // Simulated data fetch - replace with your actual API calls
    setData({
      totalUsers: 23,
      totalTasks: 120,
      completedTasks: 70,
      pendingTasks: 50,
    });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Users"
          value={data.totalUsers}
          color="bg-blue-100"
        />
        <DashboardCard
          title="Total Tasks"
          value={data.totalTasks}
          color="bg-green-100"
        />
        <DashboardCard
          title="Completed Tasks"
          value={data.completedTasks}
          color="bg-purple-100"
        />
        <DashboardCard
          title="Pending Tasks"
          value={data.pendingTasks}
          color="bg-yellow-100"
        />
      </div>
    </div>
  );
};

const DashboardCard = ({ title, value, color }) => (
  <div className={`p-6 rounded-lg shadow ${color}`}>
    <h2 className="text-lg font-semibold mb-2">{title}</h2>
    <p className="text-3xl font-bold">{value}</p>
  </div>
);

export default AdminDashboard;
