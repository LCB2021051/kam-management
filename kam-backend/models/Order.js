const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lead", // Reference to the Lead model
    required: true,
  },
  transactionId: { type: String, required: true }, // Unique transaction ID
  amount: { type: Number, required: true }, // Order amount
  status: {
    type: String,
    enum: ["Pending", "Completed", "Cancelled"], // Order statuses
    default: "Pending",
  },
  items: [
    {
      name: { type: String, required: true }, // Item name
      quantity: { type: Number, required: true }, // Quantity
      price: { type: Number, required: true }, // Price per item
    },
  ],
  createdAt: { type: Date, default: Date.now }, // Order creation time
});

module.exports = mongoose.model("Order", OrderSchema);
