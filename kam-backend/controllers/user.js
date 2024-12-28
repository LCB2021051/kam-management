const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Lead = require("../models/Lead");

// Register a new user
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role, number } = req.body;

    // Validate input
    if (!name || !email || !password || !number) {
      return res.status(400).json({
        message: "Name, email, password, and number are required.",
      });
    }

    if (!["admin", "manager", "lead", "staff"].includes(role)) {
      return res.status(400).json({
        message: "Invalid role. Allowed roles: admin, manager, lead, staff.",
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use." });
    }

    // Create new user
    const newUser = new User({
      name,
      email,
      password,
      role,
      number,
    });
    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      user: { id: newUser._id, name: newUser.name, email: newUser.email },
    });
  } catch (error) {
    console.error("Error registering user:", error.message);
    res
      .status(500)
      .json({ message: "Error registering user.", error: error.message });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      console.error(`User not found for email: ${email}`);
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Compare provided password with stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Check if JWT_SECRET is set
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not set in environment variables.");
      return res.status(500).json({ message: "Server configuration error." });
    }

    // If the user is a leadUser or manager, update the associated Lead status to "Active"
    if (["lead"].includes(user.role) && user.restaurantId) {
      const lead = await Lead.findById(user.restaurantId);
      if (lead && lead.status !== "Active") {
        lead.status = "Active";
        await lead.save();
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role, restaurantId: user.restaurantId },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        restaurantId: user.restaurantId,
      },
    });
  } catch (error) {
    console.error("Error logging in user:", error.message);
    res.status(500).json({
      message: "Error logging in user.",
      error: error.message,
    });
  }
};

// logout User
exports.logoutUser = async (req, res) => {
  try {
    const { userId } = req.body; // Assume the client sends the user ID when logging out.

    if (!userId) {
      return res
        .status(400)
        .json({ message: "User ID is required for logout." });
    }

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // If the user is a lead and associated with a restaurant, set the restaurant status to "Inactive"
    if (user.role === "lead" && user.restaurantId) {
      const lead = await Lead.findById(user.restaurantId);
      if (lead && lead.status !== "Inactive") {
        lead.status = "Inactive";
        await lead.save();
        console.log(
          `Lead status updated to "Inactive" for restaurant ID: ${user.restaurantId}`
        );
      }
    }

    res.status(200).json({ message: "Logout successful." });
  } catch (error) {
    console.error("Error logging out user:", error.message);
    res.status(500).json({
      message: "Error logging out user.",
      error: error.message,
    });
  }
};

exports.getUserById = async (req, res) => {
  const { _id } = req.params;
  try {
    // Find the user by ID
    const user = await User.findById(_id).select(
      "name email number role restaurantId"
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return the user data
    res.json(user);
  } catch (error) {
    console.error("Error fetching user by ID:", error.message);
    res.status(500).json({ error: "Server error while fetching user data" });
  }
};

exports.getAdminUserId = async (req, res) => {
  try {
    const adminUser = await User.findOne({ role: "admin" });

    if (!adminUser) {
      return res.status(404).json({ message: "Admin user not found" });
    }

    res.status(200).json({ adminUserId: adminUser._id });
  } catch (error) {
    console.error("Error fetching admin user ID:", error.message);
    res
      .status(500)
      .json({ message: "Error fetching admin user ID", error: error.message });
  }
};
