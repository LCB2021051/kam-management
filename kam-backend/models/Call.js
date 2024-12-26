const mongoose = require("mongoose");

const CallSchema = new mongoose.Schema({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lead",
    required: true,
  },
  time: {
    type: Date,
    default: Date.now,
  }, // Timestamp of the call
  to: {
    type: String,
    required: true,
  }, // The recipient of the call
  from: {
    type: String,
    required: true,
  }, // The sender of the call
  about: {
    type: String,
    required: true,
  }, // A brief description of the purpose of the call
});

module.exports = mongoose.model("Call", CallSchema);
