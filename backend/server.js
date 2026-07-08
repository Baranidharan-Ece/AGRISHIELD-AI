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

// ─── CORS Configuration ────────────────────────────────────────────────────────
// Allow requests from the deployed Render frontend, localhost in dev, and any
// other origins listed in FRONTEND_URL (comma-separated list supported).
const rawOrigins = process.env.FRONTEND_URL || "*";
const allowedOrigins =
  rawOrigins === "*"
    ? "*"
    : rawOrigins.split(",").map((o) => o.trim());

const corsOptions = {
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: allowedOrigins !== "*",
};

// Handle pre-flight OPTIONS requests for all routes
app.options("*", cors(corsOptions));
app.use(cors(corsOptions));

// ─── Security & Logging ────────────────────────────────────────────────────────
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
app.use(morgan("dev"));

// ─── Body Parsers ──────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Static Uploads ───────────────────────────────────────────────────────────
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ─── MongoDB Connection ───────────────────────────────────────────────────────
const mongoUri =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/agriculture-ai";

mongoose
  .connect(mongoUri)
  .then(() => console.log("✅ MongoDB connected to:", mongoUri.replace(/:([^:@]+)@/, ":***@")))
  .catch((err) => {
    console.error("⚠️  MongoDB connection failed — running in in-memory fallback mode.");
    console.error("MongoDB error:", err.message);
  });

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/crop", cropRoutes);
app.use("/api/fertilizer", fertilizerRoutes);
app.use("/api/disease", diseaseRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/weather", weatherRoutes);

// ─── Health Check Routes ──────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "AgriShield AI Backend is running",
    version: "1.0.0",
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "AgriShield AI Backend is healthy",
    mongodb:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected (in-memory mode)",
  });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
  });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
