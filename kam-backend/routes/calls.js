const express = require("express");
const router = express.Router();
const { simulateCall } = require("../controllers/calls");

// Simulate a call
router.post("/simulate-call", simulateCall);

module.exports = router;
