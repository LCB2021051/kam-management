const mongoose = require("mongoose");

// Contact Schema
const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Contact's name
  role: { type: String }, // Role (e.g., Owner, Manager)
  phone: { type: String }, // Phone number
  email: { type: String }, // Email address
});

// Lead Schema
const LeadSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Restaurant name
  address: { type: String, required: true }, // Address
  contactNumber: { type: String, required: true }, // Primary contact number
  status: {
    type: String,
    enum: ["New", "Active", "Inactive"],
    default: "New",
  },
  assignedKAM: { type: String }, // Assigned KAM
  contacts: [ContactSchema], // Embedded ContactSchema
});

module.exports = mongoose.model("Lead", LeadSchema);
