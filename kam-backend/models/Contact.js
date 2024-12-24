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

// Export the schema for embedding
module.exports = ContactSchema;
