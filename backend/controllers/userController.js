// controllers/userController.js
const Task = require("../models/Task");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

exports.createUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Check if email already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash password
    const hash = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hash,
      role,
      createdBy: req.user.id, // the Admin who created it
    });

    // Remove password from response
    const { password: _, ...userData } = user.toObject();
    res.status(201).json(userData);
  } catch (err) {
    res
      .status(500)
      .json({ message: "User creation failed", error: err.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $in: ["Manager", "Employee"] } })
      .select("-password")
      .populate("createdBy", "email role");

    const usersWithTasks = await Promise.all(
      users.map(async (user) => {
        const tasks = await Task.find({ assignedTo: user._id });
        return {
          ...user.toObject(),
          tasks,
        };
      })
    );

    res.json(usersWithTasks);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch users", error: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { name, password, role } = req.body;
    const updateData = { name, role };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
      }
    );

    if (!updatedUser) return res.status(404).json({ error: "User not found" });

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: "Failed to update user" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
};
