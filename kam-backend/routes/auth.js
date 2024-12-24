const express = require("express");
const router = express.Router();
const Lead = require("../models/Lead.js");

// Login route
router.post("/login", async (req, res) => {
  const { name } = req.body;
  try {
    const data = await Lead.findOneAndUpdate(
      { name },
      { status: "Active" },
      { new: true }
    );
    if (!data) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    res.status(200).json({ message: "Login successful", data });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error during login", error: error.message });
  }
});

// Logout route
router.post("/logout", async (req, res) => {
  const { name } = req.body; // Receive the restaurant name from the request body
  try {
    const restaurant = await Lead.findOneAndUpdate(
      { name },
      { status: "Inactive" }, // Mark the restaurant as inactive
      { new: true } // Return the updated document
    );

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.clearCookie("token"); // Clear the authentication cookie (if applicable)
    res.status(200).json({ message: "Logout successful", restaurant });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error during logout", error: error.message });
  }
});

module.exports = router;
