const express = require("express");
const router = express.Router();

const {
  simulateOrder,
  pendingOrders, // Fixed typo
  updateOrderStatus,
} = require("../controllers/orders");
const { roleMiddleware } = require("../middleware/role");
const { authMiddleware } = require("../middleware/auth");

router.post(
  "/simulate-order",
  authMiddleware,
  roleMiddleware("lead"),
  simulateOrder
);
router.get(
  "/pending",
  authMiddleware,
  roleMiddleware("lead", "admin"),
  pendingOrders
);
router.put(
  "/:id/status",
  authMiddleware,
  roleMiddleware("lead"),
  updateOrderStatus
);

module.exports = router;
