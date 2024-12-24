const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// For Leads
app.use("/api/leads", require("./routes/leads"));

// for client
app.use("/api/auth", require("./routes/auth"));

// for orders
app.use("/api/orders", require("./routes/orders"));

// for calls
app.use("/api/calls", require("./routes/calls"));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
