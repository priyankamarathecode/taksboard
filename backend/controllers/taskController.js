const Task = require("../models/Task");

exports.assignTask = async (req, res) => {
  const { title, description, assignedTo } = req.body;

  try {
    const newTask = await Task.create({
      title,
      description,
      assignedTo,
      status: "Pending",
      createdBy: req.user._id,
    });

    res.status(201).json(newTask);
  } catch (error) {
    console.error("Error assigning task:", error.message);
    res.status(500).json({ message: "Error assigning task" });
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
