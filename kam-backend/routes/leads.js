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
  getLeadStats,
  getLeadsForInteraction,
  getNextInteractionDue,
} = require("../controllers/leads");

// Routes for leads
router.get("/dashboard", getDashboardStats);
router.get("/", getLeads);
router.post("/", createLead);
router.get("/interaction-due", getLeadsForInteraction);
router.get("/interaction-due/:id", getNextInteractionDue);

router.get("/:id", getLeadById);
router.put("/:id", updateLead);
router.delete("/:id", deleteLead);
router.post("/:id/contacts", addContact);
router.delete("/:id/contacts/:contactId", deleteContact);
router.get("/:id/stats", getLeadStats);

module.exports = router;
