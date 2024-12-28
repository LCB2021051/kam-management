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
  getPerformanceMetrics,
} = require("../controllers/leads");
const { authMiddleware } = require("../middleware/auth");
const { roleMiddleware } = require("../middleware/role");

// Routes for leads
router.get(
  "/dashboard",
  authMiddleware,
  roleMiddleware("admin"),
  getDashboardStats
);
router.get("/", authMiddleware, roleMiddleware("admin"), getLeads);
router.post("/", authMiddleware, roleMiddleware("admin"), createLead);
router.get(
  "/interaction-due",
  authMiddleware,
  roleMiddleware("admin"),
  getLeadsForInteraction
);
router.get(
  "/performance-matrix",
  authMiddleware,
  roleMiddleware("admin"),
  getPerformanceMetrics
);
router.get(
  "/interaction-due/:id",
  authMiddleware,
  roleMiddleware("admin"),
  getNextInteractionDue
);
router.get("/:id", authMiddleware, roleMiddleware("admin"), getLeadById);
router.put("/:id", authMiddleware, roleMiddleware("admin"), updateLead);
router.delete("/:id", authMiddleware, roleMiddleware("admin"), deleteLead);
router.post(
  "/:id/contacts",
  authMiddleware,
  roleMiddleware("admin"),
  addContact
);
router.delete(
  "/:id/contacts/:contactId",
  authMiddleware,
  roleMiddleware("admin"),
  deleteContact
);
router.get("/:id/stats", authMiddleware, roleMiddleware("admin"), getLeadStats);

module.exports = router;
