const express = require("express");
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const Prediction = require("../models/Prediction");

const router = express.Router();

// Shared In-Memory Prediction History Database fallback for offline mode
global.mockPredictions = global.mockPredictions || [];

// GET /api/history
router.get("/", auth, async (req, res) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      const predictions = await Prediction.find({ userId: req.user.id })
        .sort({ createdAt: -1 })
        .limit(50);
      return res.json(predictions);
    } else {
      console.log("MongoDB offline - Running in Memory Fallback Mode for History retrieval");
      // Filter predictions for this user in memory, sorted descending by date
      const userHistory = global.mockPredictions
        .filter(p => p.userId.toString() === req.user.id.toString())
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, 50);
      return res.json(userHistory);
    }
  } catch (err) {
    console.error("Error fetching history:", err);
    res.status(500).json({ error: "Failed to fetch prediction history" });
  }
});

module.exports = router;
