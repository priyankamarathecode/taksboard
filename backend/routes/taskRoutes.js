const express = require("express");
const router = express.Router();
const { assignTask, getMyTasks } = require("../controllers/taskController");
const authMiddleware = require("../middleware/auth");
// const { authMiddleware } = require("../middleware/auth");

router.post("/assign", authMiddleware, assignTask);
router.get("/my-tasks", authMiddleware, getMyTasks);

module.exports = router;
