const express = require("express");
const router = express.Router();

const {
  createUser,
  getUsers,
  deleteUser,
  updateUser, // ✅ Add this
} = require("../controllers/userController");

const auth = require("../middleware/auth");
const adminOnly = require("../middleware/role");

router.use(auth, adminOnly);

router.post("/", createUser);
router.get("/", getUsers);
router.delete("/:id", deleteUser);
router.put("/:id", updateUser); // ✅ ADD THIS LINE

module.exports = router;
