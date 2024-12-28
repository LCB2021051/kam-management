const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: function () {
        return this.role !== "staff";
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

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

module.exports = mongoose.model("User", UserSchema);
