const mongoose = require("mongoose");

const InteractionSchema = new mongoose.Schema({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lead", // Reference to the Lead model
    required: true,
  },
  type: {
    type: String,
    enum: ["Call", "Email"], // Types of interactions
    required: true,
  },
  from: {
    type: String, // Who initiated the interaction
    required: true,
  },
  to: {
    type: String, // Who received the interaction
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
