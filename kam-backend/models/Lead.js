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
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true }, // Hashed password
  lastLoginTime: { type: Date }, // Last login timestamp
});

module.exports = mongoose.model("Lead", LeadSchema);
