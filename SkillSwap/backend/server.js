const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("./db"); // MongoDB connection
const userRoutes = require("./routes/userRoutes");
const matchRoutes = require("./routes/matchRoutes");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// API routes
app.use("/api/users", userRoutes);
app.use("/api/matches", matchRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend running on http://localhost:${PORT}`));
