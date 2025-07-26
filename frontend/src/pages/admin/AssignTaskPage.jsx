// src/pages/admin/AssignTaskPage.jsx
import { useEffect, useState } from "react";
import API from "../../services/api";
import { toast } from "react-toastify";

const AssignTaskPage = () => {
  const [users, setUsers] = useState([]);
  const [task, setTask] = useState({
    title: "",
    description: "",
    assignedTo: "",
  });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await API.get("/users");
        if (Array.isArray(res.data)) {
          setUsers(res.data);
        } else {
          toast.error("Unexpected user data format");
          console.error("Unexpected response:", res.data);
        }
      } catch (error) {
        toast.error("Failed to load users");
        console.error("User fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/tasks/assign", task);
      toast.success("Task assigned successfully");
      setTask({ title: "", description: "", assignedTo: "" });
      setShowForm(false);
    } catch (err) {
      toast.error("Task assignment failed");
      console.error("Assignment error:", err);
    }
  };

  const filteredUsers = users.filter((user) => {
    const keyword = searchTerm.toLowerCase();
    const nameMatch = user.name.toLowerCase().includes(keyword);
    const taskMatch = user.tasks?.some(
      (task) =>
        task.title.toLowerCase().includes(keyword) ||
        task.description.toLowerCase().includes(keyword)
    );
    return nameMatch || taskMatch;
  });

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
        {/* Left - Users & Tasks */}
        <div className="lg:w-2/3 w-full bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            👥 User Work Summary
          </h2>

          {/* Search Input */}
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-2">
            <input
              type="text"
              placeholder="Search by user name or task..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-2/3 border px-4 py-2 rounded focus:outline-none focus:ring focus:ring-blue-200"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="text-sm text-blue-600 underline cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {loading ? (
            <p className="text-gray-500 text-center">Loading users...</p>
          ) : (
            <div className="space-y-4">
              {filteredUsers.length === 0 ? (
                <p className="text-sm text-gray-400">No results found.</p>
              ) : (
                filteredUsers.map((user) => (
                  <div
                    key={user._id}
                    className="p-4 border rounded-xl hover:shadow-md transition duration-300 bg-gradient-to-tr from-white to-gray-50"
                  >
                    <div className="font-semibold text-lg text-blue-700">
                      {user.name}
                    </div>
                    <div className="text-sm text-gray-600 mb-1">
                      {user.email}
                    </div>
                    <div className="text-xs bg-blue-100 text-blue-800 inline-block px-2 py-1 rounded mb-2">
                      Role: {user.role}
                    </div>

                    {user.tasks && user.tasks.length > 0 ? (
                      <div className="mt-2 space-y-2">
                        {user.tasks.map((task) => (
                          <div
                            key={task._id}
                            className="text-sm p-3 bg-gray-100 rounded-xl border border-gray-200"
                          >
                            <div className="font-medium text-gray-800">
                              {task.title}
                            </div>
                            <div className="text-gray-600 text-sm">
                              {task.description}
                            </div>
                            <span
                              className={`inline-block mt-2 text-xs px-3 py-1 rounded-full font-medium tracking-wide cursor-default ${
                                task.status === "Pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : task.status === "In Progress"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {task.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400 mt-2">
                        No tasks assigned
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Right - Task Form */}
        <div className="lg:w-1/3 w-full bg-white p-6 rounded-xl shadow-lg">
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-3 px-6 rounded-xl shadow hover:from-green-600 hover:to-green-700 transition-all cursor-pointer"
            >
              + Assign New Task
            </button>
          ) : (
            <>
              <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
                📝 Assign New Task
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm text-gray-700 font-medium block mb-1">
                    Task Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    placeholder="Enter task title"
                    value={task.title}
                    onChange={handleChange}
                    required
                    className="w-full border px-4 py-2 rounded focus:outline-none focus:ring focus:ring-blue-200 cursor-text"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-700 font-medium block mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    placeholder="Describe the task"
                    value={task.description}
                    onChange={handleChange}
                    required
                    className="w-full border px-4 py-2 rounded focus:outline-none focus:ring focus:ring-blue-200 cursor-text"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-700 font-medium block mb-1">
                    Assign To
                  </label>
                  <select
                    name="assignedTo"
                    value={task.assignedTo}
                    onChange={handleChange}
                    required
                    className="w-full border px-4 py-2 rounded focus:outline-none focus:ring focus:ring-blue-200 cursor-pointer"
                  >
                    <option value="">Select User</option>
                    {users.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.name} ({user.role})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 shadow-md cursor-pointer"
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="text-sm text-gray-500 hover:text-red-600 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignTaskPage;
