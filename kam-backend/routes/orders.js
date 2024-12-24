const express = require("express");
const router = express.Router();

const {
  simulateOrder,
  pendingOrders, // Fixed typo
  orderComplete,
} = require("../controllers/orders");

router.post("/simulate-order", simulateOrder);
router.get("/pending", pendingOrders);
router.patch("/:id/complete", orderComplete);

module.exports = router;
