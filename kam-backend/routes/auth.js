const express = require("express");
const router = express.Router();
const Lead = require("../models/Lead.js");
const bcrypt = require("bcrypt");
const Call = require("../models/Call");
const Order = require("../models/Order");

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

// Add a call
router.post("/calls", async (req, res) => {
  const { restaurantId, duration, purpose, notes } = req.body;

  try {
    const call = new Call({ restaurantId, duration, purpose, notes });
    await call.save();

    res.status(201).json({ message: "Call added successfully", call });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding call", error: error.message });
  }
});

// Get all calls for a restaurant
router.get("/calls/:restaurantId", async (req, res) => {
  const { restaurantId } = req.params;

  try {
    const calls = await Call.find({ restaurantId }).sort({ time: -1 }); // Sort by latest first
    res.status(200).json(calls);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving calls", error: error.message });
  }
});

// Create a new order
router.post("/orders", async (req, res) => {
  const { restaurantId, transactionId, amount, status, items } = req.body;

  try {
    const order = new Order({
      restaurantId,
      transactionId,
      amount,
      status,
      items,
    });
    await order.save();

    res.status(201).json({ message: "Order created successfully", order });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating order", error: error.message });
  }
});

// Get all orders for a restaurant
router.get("/orders/:restaurantId", async (req, res) => {
  const { restaurantId } = req.params;

  try {
    const orders = await Order.find({ restaurantId }).sort({ createdAt: -1 }); // Sort by latest
    res.status(200).json(orders);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving orders", error: error.message });
  }
});

router.patch("/orders/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res
      .status(200)
      .json({ message: "Order status updated successfully", order });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating order status", error: error.message });
  }
});

// Simulate a call
router.post("/simulate-call", async (req, res) => {
  const { restaurantId } = req.body;

  try {
    const call = new Call({
      restaurantId,
      timestamp: new Date(),
    });
    await call.save();

    res.status(201).json({ message: "Call simulated successfully", call });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error simulating call", error: error.message });
  }
});

router.post("/simulate-transaction", async (req, res) => {
  const { restaurantId, amount } = req.body;

  try {
    const transaction = new Transaction({
      restaurantId,
      amount,
      timestamp: new Date(),
    });
    await transaction.save();

    res
      .status(201)
      .json({ message: "Transaction simulated successfully", transaction });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error simulating transaction", error: error.message });
  }
});

module.exports = router;
