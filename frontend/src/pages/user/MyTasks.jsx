// src/pages/user/MyTasks.jsx
import { useEffect, useState } from "react";
import API from "../../services/api";
import { toast } from "react-toastify";

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    API.get("/tasks/my-tasks").then((res) => setTasks(res.data));
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await API.put(`/tasks/${id}`, { status });
      toast.success("Status updated");
      setTasks((prev) =>
        prev.map((task) => (task._id === id ? { ...task, status } : task))
      );
    } catch {
      toast.error("Update failed");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">📥 Your Assigned Tasks</h2>
      {tasks.map((task) => (
        <div
          key={task._id}
          className="border p-4 mb-4 bg-white rounded-lg shadow"
        >
          <h3 className="font-bold text-lg">{task.title}</h3>
          <p>{task.description}</p>
          <p className="text-sm text-gray-500">
            Deadline: {new Date(task.deadline).toLocaleDateString()}
          </p>
          <select
            value={task.status}
            onChange={(e) => handleStatusChange(task._id, e.target.value)}
            className="mt-2 p-2 rounded border"
          >
            <option>Pending</option>
            <option>In Progress</option>
            <option>Complete</option>
          </select>
        </div>
      ))}
    </div>
  );
};

export default MyTasks;
