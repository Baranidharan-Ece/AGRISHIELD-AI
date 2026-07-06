const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
require("dotenv").config();

// Import Routes
const authRoutes = require("./routes/auth");
const cropRoutes = require("./routes/crop");
const fertilizerRoutes = require("./routes/fertilizer");
const diseaseRoutes = require("./routes/disease");
const chatRoutes = require("./routes/chat");
const historyRoutes = require("./routes/history");
const weatherRoutes = require("./routes/weather");

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: "*", // Adjust in production to allow specific origins
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Configure Helmet with cross-origin resource sharing relaxed for uploaded images
app.use(helmet({
  crossOriginResourcePolicy: false
}));

app.use(morgan("dev"));

// Serve uploaded images statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Connect to MongoDB
const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/agriculture-ai";
mongoose
  .connect(mongoUri)
  .then(() => console.log("MongoDB connected successfully to:", mongoUri))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/crop", cropRoutes);
app.use("/api/fertilizer", fertilizerRoutes);
app.use("/api/disease", diseaseRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/weather", weatherRoutes);

// Root Health Check Route
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Agriculture AI Backend is healthy" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Global Error Handler caught an error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error"
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
