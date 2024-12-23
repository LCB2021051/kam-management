const mongoose = require("mongoose");

const LeadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  contactNumber: { type: String, required: true },
  status: {
    type: String,
    enum: ["New", "Active", "Inactive"],
    default: "New",
  },
  assignedKAM: { type: String },
  contacts: [
    {
      name: { type: String },
      role: { type: String },
      phone: { type: String },
      email: { type: String },
    },
  ],
});

module.exports = mongoose.model("Lead", LeadSchema);
