const express = require("express");
const {
  addInteraction,
  getInteractions,
} = require("../controllers/interactions");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth");
const { roleMiddleware } = require("../middleware/role");

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin", "lead"),
  addInteraction
);
router.get(
  "/:restaurantId",
  authMiddleware,
  roleMiddleware("admin", "lead"),
  getInteractions
);

module.exports = router;
