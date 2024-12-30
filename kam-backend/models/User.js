const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: function () {
        return this.role !== "staff" && this.role !== "manager";
      },
    },
    number: {
      type: String,
      required: true,
      match: [/^\d{10}$/, "Please enter a valid 10-digit phone number"],
    }, // Added phone number
    role: {
      type: String,
      required: true,
      enum: ["admin", "manager", "lead", "staff"],
    },
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      required: function () {
        return this.role === "staff" || this.role === "manager";
      },
    },
  },
  { timestamps: true }
);

// Custom validation for ensuring only one admin exists
UserSchema.pre("save", async function (next) {
  if (this.role === "admin") {
    const adminExists = await mongoose.model("User").findOne({ role: "admin" });
    if (adminExists && adminExists._id.toString() !== this._id.toString()) {
      return next(new Error("Only one admin is allowed in the system."));
    }
  }
});

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

module.exports = mongoose.model("User", UserSchema);
