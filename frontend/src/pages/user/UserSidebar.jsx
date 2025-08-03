// src/components/UserSidebar.jsx
import { NavLink } from "react-router-dom";

const UserSidebar = () => {
  return (
    <div className="w-64 bg-gray-800 text-white min-h-screen p-4">
      <h2 className="text-2xl font-bold mb-6">User Panel</h2>
      <nav className="space-y-4">
        <NavLink to="/user/dashboard" className="block hover:text-yellow-300">
          📊 Dashboard
        </NavLink>
        <NavLink to="/user/tasks" className="block hover:text-yellow-300">
          📝 My Tasks
        </NavLink>
        <NavLink to="/user/profile" className="block hover:text-yellow-300">
          👤 Profile
        </NavLink>
      </nav>
    </div>
  );
};

export default UserSidebar;
