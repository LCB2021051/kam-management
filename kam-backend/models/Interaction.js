const mongoose = require("mongoose");

const InteractionSchema = new mongoose.Schema({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lead", // Reference to the Lead model
    required: true,
  },
  type: {
    type: String,
    enum: ["Call", "Email", "Regular-Update"], // Types of interactions
    required: true,
  },
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model for initiator
    required: true,
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model for receiver
    required: true,
  },
  about: {
    type: String, // Purpose or details of the interaction
    required: true,
  },
  time: {
    type: Date,
    default: Date.now, // Timestamp of the interaction
  },
});

module.exports = mongoose.model("Interaction", InteractionSchema);
