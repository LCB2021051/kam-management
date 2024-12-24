const mongoose = require("mongoose");

// Contact Schema
const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Contact's name
  role: { type: String }, // Role (e.g., Owner, Manager)
  phone: { type: String }, // Phone number
  email: {
    type: String,
    match: [/.+@.+\..+/, "Please enter a valid email address"], // Email validation
  },
});

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
  assignedKAM: { type: String },
  contacts: [ContactSchema],
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  lastLoginTime: { type: Date },
});

module.exports = mongoose.model("Lead", LeadSchema);
