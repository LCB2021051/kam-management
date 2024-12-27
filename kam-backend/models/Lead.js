const mongoose = require("mongoose");
const ContactSchema = require("./Contact"); // Import the ContactSchema

// Lead Schema
const LeadSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Restaurant name
  address: { type: String, required: true }, // Address
  contactNumber: { type: String, required: true }, // Primary contact number
  status: {
    type: String,
    enum: ["New", "Active", "Inactive"], // Allowed values
    default: "New",
  },
  assignedKAM: { type: String }, // Assigned KAM
  contacts: [ContactSchema], // Embedded ContactSchema
  username: { type: String, unique: true, required: true }, // Unique username
  password: { type: String, required: true }, // Hashed password
  lastLoginTime: { type: Date }, // Last login timestamp
  notificationFrequency: {
    type: Number, // Notification frequency in days
    default: 7, // Default to 7 days
  },
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
