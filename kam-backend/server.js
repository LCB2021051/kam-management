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

// For Leads (restorant)
app.use("/api/leads", require("./routes/leads"));

// for orders
app.use("/api/orders", require("./routes/orders"));

// for interactions
app.use("/api/interactions", require("./routes/interactions"));

// for user
app.use("/api/users", require("./routes/user"));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
