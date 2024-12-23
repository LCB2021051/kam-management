const express = require("express");
const router = express.Router();
const {
  getLeads,
  createLead,
  updateLead,
  deleteLead,
  getDashboardStats,
} = require("../controllers/leads");

// Routes for leads
router.get("/", getLeads);
router.post("/", createLead);
router.put("/:id", updateLead);
router.delete("/:id", deleteLead);
router.get("/dashboard", getDashboardStats);

module.exports = router;
