const express = require("express");
const router = express.Router();
const {
  getLeads,
  createLead,
  updateLead,
  deleteLead,
  getDashboardStats,
  addContact,
  deleteContact,
  getLeadById,
} = require("../controllers/leads");

// Routes for leads
router.get("/dashboard", getDashboardStats); // Ensure this route is evaluated before ":id"
router.get("/", getLeads);
router.post("/", createLead);
router.get("/:id", getLeadById);
router.put("/:id", updateLead);
router.delete("/:id", deleteLead);
router.post("/:id/contacts", addContact);
router.delete("/:id/contacts/:contactId", deleteContact);

module.exports = router;
