const Task = require("../models/Task");
const User = require("../models/User");

exports.assignTask = async (req, res) => {
  try {
    const { title, description, assignedTo, deadline } = req.body;

    if (!title || !description || !assignedTo || !deadline) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const task = await Task.create({
      title,
      description,
      assignedTo,
      deadline,
    });

    // Also add task ID to user's task array
    await User.findByIdAndUpdate(assignedTo, { $push: { tasks: task._id } });

    res.status(201).json({ message: "Task assigned successfully", task });
  } catch (error) {
    console.error("Assign task error:", error.message);
    res.status(500).json({ error: "Failed to assign task" });
  }
};

// Update Task
exports.updateTask = async (req, res) => {
  try {
    const { title, description, assignedTo, deadline } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, assignedTo, deadline },
      { new: true }
    );

    res.json({ message: "Task updated", updatedTask });
  } catch (err) {
    res.status(500).json({ error: "Failed to update task" });
  }
};

// Delete Task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId); // ✅ Correct param
    if (!task) return res.status(404).json({ error: "Task not found" });

    await User.findByIdAndUpdate(task.assignedTo, {
      $pull: { tasks: task._id },
    });

    await task.deleteOne();

    res.json({ message: "Task deleted" });
  } catch (err) {
    console.error("Delete Task Error:", err);
    res.status(500).json({ error: "Failed to delete task" });
  }
};

exports.getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user._id });
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error.message);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};
