const express = require("express");
const router = express.Router();
const {
  assignTask,
  getMyTasks,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const authMiddleware = require("../middleware/auth");

// ✅ Route for assigning a task
router.post("/assign", authMiddleware, assignTask);

// ✅ Route for getting logged-in user's tasks
router.get("/my-tasks", authMiddleware, getMyTasks);

// ✅ Route to update task
// router.put("/:id", updateTask);

// ✅ Route to delete task
router.delete("/:taskId", deleteTask);

router.put("/:id", authMiddleware, updateTask);

module.exports = router;
