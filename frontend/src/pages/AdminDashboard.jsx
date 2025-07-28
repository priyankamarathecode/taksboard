// src/pages/admin/AdminDashboard.jsx
import { useEffect, useState } from "react";
import API from "../services/api";

const AdminDashboard = () => {
  const [data, setData] = useState({
    totalUsers: 0,
    totalManagers: 0,
    totalEmployees: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
    overdueTasks: 0,
    tasksToday: 0,
    completionRate: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await API.get("/dashboard/admin-stats");
      setData(res.data);
    } catch (err) {
      console.error("Failed to fetch dashboard data", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard
          title="Total Users"
          value={data.totalUsers}
          color="bg-blue-100"
        />
        <DashboardCard
          title="Total Managers"
          value={data.totalManagers}
          color="bg-indigo-100"
        />
        <DashboardCard
          title="Total Employees"
          value={data.totalEmployees}
          color="bg-pink-100"
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
        <DashboardCard
          title="In Progress Tasks"
          value={data.inProgressTasks}
          color="bg-orange-100"
        />
        <DashboardCard
          title="Overdue Tasks"
          value={data.overdueTasks}
          color="bg-red-100"
        />
        <DashboardCard
          title="Today's Tasks"
          value={data.tasksToday}
          color="bg-sky-100"
        />
        <DashboardCard
          title="Completion Rate"
          value={`${data.completionRate}%`}
          color="bg-teal-100"
        />
      </div>

      {/* Future: Add charts, user activity logs, and quick filters here */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Coming Soon</h2>
        <ul className="list-disc list-inside text-gray-600">
          <li>User activity graph</li>
          <li>Top performers</li>
          <li>Task distribution by user</li>
          <li>Interactive reports</li>
        </ul>
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
