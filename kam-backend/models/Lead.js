const mongoose = require("mongoose");

// Lead Schema
const LeadSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Restaurant name
  address: { type: String, required: true }, // Address
  leadUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model for the lead (restaurant owner)
    required: true,
  },
  status: {
    type: String,
    enum: ["New", "Active", "Inactive"], // Allowed values
    default: "New",
  },
  contacts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to User model for multiple contacts
    },
  ],
  notificationFrequency: {
    type: Number, // Frequency in days for notifications
    default: 7, // Default to 7 days
    required: true,
  },
  lastLoginTime: { type: Date }, // Last login timestamp
  createdAt: {
    type: Date,
    default: Date.now, // Auto-set creation time
  },
  updatedAt: {
    type: Date,
    default: Date.now, // Auto-set update time
  },
});

// Middleware to update the `updatedAt` field before saving
LeadSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Lead", LeadSchema);
