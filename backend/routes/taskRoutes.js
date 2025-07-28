const express = require("express");
const router = express.Router();
const {
  assignTask,
  getMyTasks,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const authMiddleware = require("../middleware/auth");
// const { authMiddleware } = require("../middleware/auth");

router.post("/assign", authMiddleware, assignTask);
router.get("/my-tasks", authMiddleware, getMyTasks);
router.put("/:taskId", updateTask);
router.delete("/:taskId", deleteTask);

module.exports = router;
