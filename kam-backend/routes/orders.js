const express = require("express");
const router = express.Router();

const {
  simulateOrder,
  pendingOrders, // Fixed typo
  updateOrderStatus,
} = require("../controllers/orders");

router.post("/simulate-order", simulateOrder);
router.get("/pending", pendingOrders);
router.put("/:id/status", updateOrderStatus);

module.exports = router;
