const express = require("express");
const {
  addInteraction,
  getInteractions,
} = require("../controllers/interactions.js");
const router = express.Router();

// Route to add a new interaction
router.post("/", async (req, res) => {
  try {
    await addInteraction(req, res);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding interaction", error: error.message });
  }
});

// Route to get interactions by restaurant ID
router.get("/:restaurantId", async (req, res) => {
  try {
    await getInteractions(req, res);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching interactions", error: error.message });
  }
});

module.exports = router;
