const express = require("express");
const {
  registerUser,
  loginUser,
  getUserById,
  logoutUser,
  getAdminUserId,
} = require("../controllers/user");
const router = express.Router();

// Register User
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/admin-id", getAdminUserId);
router.get("/:id", getUserById);

module.exports = router;
