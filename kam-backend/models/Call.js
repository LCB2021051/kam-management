const mongoose = require("mongoose");

// Call Schema
const CallSchema = new mongoose.Schema({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lead", // Reference to the Lead model
    required: true,
  },
  time: { type: Date, default: Date.now }, // Timestamp of the call
  duration: { type: Number, required: true }, // Duration of the call in seconds
  purpose: { type: String, required: true }, // Purpose of the call (e.g., "Order Follow-up", "Query")
  notes: { type: String }, // Optional notes about the call
});

module.exports = mongoose.model("Call", CallSchema);
