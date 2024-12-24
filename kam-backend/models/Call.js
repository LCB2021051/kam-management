const mongoose = require("mongoose");

const CallSchema = new mongoose.Schema({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lead",
    required: true,
  },
  time: { type: Date, default: Date.now }, // Timestamp of the call
});

module.exports = mongoose.model("Call", CallSchema);
