const express = require("express");
const router = express.Router();
const Lead = require("../models/Lead.js");
const bcrypt = require("bcrypt");

// Login route
router.post("/login", async (req, res) => {
  const { username, password } = req.body; // Get username and password from request

  try {
    // Find the lead by username
    const lead = await Lead.findOne({ username });

    if (!lead) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, lead.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Update the lead's status to Active
    lead.status = "Active";
    lead.lastLoginTime = new Date();
    await lead.save();

    res.status(200).json({
      message: "Login successful",
      lead: {
        id: lead._id,
        name: lead.name,
        username: lead.username,
        status: lead.status,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error during login", error: error.message });
  }
});

// Logout route
router.post("/logout", async (req, res) => {
  const { username } = req.body; // Receive the username from the request body
  console.log(username);

  try {
    // Find and update the lead status to "Inactive"
    const restaurant = await Lead.findOneAndUpdate(
      { username }, // Search by username
      { status: "Inactive" }, // Set status to "Inactive"
      { new: true } // Return the updated document
    );

    console.log(restaurant);

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Clear the authentication cookie (if used)
    res.clearCookie("token", {
      httpOnly: true, // Make the cookie inaccessible to client-side scripts
      secure: process.env.NODE_ENV === "production", // Secure in production
      sameSite: "Strict", // Prevent CSRF attacks
    });

    res.status(200).json({
      message: "Logout successful",
      restaurant: {
        id: restaurant._id,
        name: restaurant.name,
        username: restaurant.username,
        status: restaurant.status,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error during logout",
      error: error.message,
    });
  }
});

module.exports = router;
