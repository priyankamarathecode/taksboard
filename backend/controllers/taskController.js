const Task = require("../models/Task");
const User = require("../models/User");

// Assign Task
exports.assignTask = async (req, res) => {
  const { title, description, assignedTo, deadline } = req.body;
  try {
    const task = new Task({ title, description, assignedTo, deadline });
    await task.save();

    // Add to user's tasks array
    await User.findByIdAndUpdate(assignedTo, {
      $push: { tasks: task._id },
    });

    res.status(201).json(task);
  } catch (err) {
    console.error("Assign Task Error:", err.message);
    res.status(500).json({ message: "Task creation failed" });
  }
};

// Update Task
exports.updateTask = async (req, res) => {
  try {
    const { title, description, assignedTo, deadline } = req.body;
    const taskId = req.params.id;

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { title, description, assignedTo, deadline },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Remove task from all users
    await User.updateMany({ tasks: taskId }, { $pull: { tasks: taskId } });

    // Add task to new assigned user
    await User.findByIdAndUpdate(assignedTo, {
      $addToSet: { tasks: taskId },
    });

    res.json({ message: "Task updated", updatedTask });
  } catch (err) {
    console.error("Update Task Error:", err.message);
    res.status(500).json({ error: "Failed to update task" });
  }
};

// Delete Task
exports.deleteTask = async (req, res) => {
  try {
    const taskId = req.params.taskId;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ error: "Task not found" });

    // Remove from user's task list
    await User.findByIdAndUpdate(task.assignedTo, {
      $pull: { tasks: task._id },
    });

    await task.deleteOne();

    res.json({ message: "Task deleted" });
  } catch (err) {
    console.error("Delete Task Error:", err.message);
    res.status(500).json({ error: "Failed to delete task" });
  }
};

// Get My Tasks (for logged-in user)
exports.getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user._id });
    res.json(tasks);
  } catch (err) {
    console.error("Get My Tasks Error:", err.message);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};
