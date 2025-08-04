// src/components/UserSidebar.jsx
import { NavLink, useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { FaTachometerAlt, FaTasks, FaUserCircle } from "react-icons/fa";
import { useState } from "react";

const UserSidebar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div
      className={`${
        isOpen ? "w-64" : "w-20"
      } bg-white text-gray-800 min-h-screen flex flex-col justify-between p-4 transition-all duration-300 border-r`}
    >
      {/* Top Section */}
      <div>
        {/* Toggle + Title */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            {isOpen && "User Panel"}
          </h2>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-700 focus:outline-none"
          >
            ☰
          </button>
        </div>

        {/* Navigation */}
        <nav className="space-y-4">
          <NavLink
            to="/user/dashboard"
            className="flex items-center gap-3 hover:text-blue-600"
          >
            <FaTachometerAlt />
            {isOpen && "Dashboard"}
          </NavLink>

          <NavLink
            to="/user/tasks"
            className="flex items-center gap-3 hover:text-blue-600"
          >
            <FaTasks />
            {isOpen && "My Tasks"}
          </NavLink>

          <NavLink
            to="/user/profile"
            className="flex items-center gap-3 hover:text-blue-600"
          >
            <FaUserCircle />
            {isOpen && "Profile"}
          </NavLink>
        </nav>
      </div>

      {/* Bottom Logout */}
      <div className="mt-6">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-red-500 hover:text-red-700"
        >
          <FiLogOut />
          {isOpen && "Logout"}
        </button>
      </div>
    </div>
  );
};

export default UserSidebar;
