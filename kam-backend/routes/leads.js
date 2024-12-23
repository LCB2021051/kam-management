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
} = require("../controllers/leads");

// Routes for leads
router.get("/", getLeads);
router.post("/", createLead);
router.put("/:id", updateLead);
router.delete("/:id", deleteLead);
router.get("/dashboard", getDashboardStats);
router.post("/:id/contacts", addContact);
router.delete("/:id/contacts/:contactId", deleteContact);
router.delete("/:id/contacts/:contactId", deleteContact);

module.exports = router;
