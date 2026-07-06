const express = require("express");
const axios = require("axios");
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const Prediction = require("../models/Prediction");

const router = express.Router();

global.mockPredictions = global.mockPredictions || [];

router.post("/predict", auth, async (req, res) => {
  try {
    const { N, P, K, temperature, humidity, ph, rainfall } = req.body;

    if (!N || !P || !K || !temperature || !humidity || !ph || !rainfall) {
      return res.status(400).json({ error: "All soil and climate inputs are required" });
    }

    const inputData = {
      N: parseFloat(N),
      P: parseFloat(P),
      K: parseFloat(K),
      temperature: parseFloat(temperature),
      humidity: parseFloat(humidity),
      ph: parseFloat(ph),
      rainfall: parseFloat(rainfall)
    };

    let result = null;

    // Try communicating with Python Flask server on port 8000
    try {
      const response = await axios.post("http://127.0.0.1:8000/predict", inputData, { timeout: 2000 });
      result = response.data;
    } catch (err) {
      console.log("Flask ML server not responding, running rule-based fallback crop recommendation...");
      
      // Fallback Rule-based crop recommendation logic
      let crop = "Maize";
      let confidence = 85.0;
      let season = "Kharif";
      let water = "Medium";
      let fertilizer = "NPK 12:32:16";
      let cropYield = "5 tons/hectare";
      let tips = "Ensure proper soil aeration and regular watering during flowering.";

      if (inputData.rainfall > 150 && inputData.humidity > 70) {
        crop = "Rice";
        season = "Kharif";
        water = "High";
        fertilizer = "NPK 10:26:26";
        cropYield = "6.5 tons/hectare";
        tips = "Maintain standing water (5-10 cm) in the field during vegetative stage.";
      } else if (inputData.temperature < 22 && inputData.rainfall < 110) {
        crop = "Wheat";
        season = "Rabi";
        water = "Medium";
        fertilizer = "DAP + Urea";
        cropYield = "4.2 tons/hectare";
        tips = "Give first irrigation at Crown Root Initiation stage (21 days after sowing).";
      } else if (inputData.K > 80 && inputData.P > 50) {
        crop = "Grapes";
        season = "Rabi";
        water = "Low";
        fertilizer = "Sulphate of Potash";
        cropYield = "20 tons/hectare";
        tips = "Pruning is essential for crop load management and grape quality.";
      } else if (inputData.N > 80 && inputData.K > 40) {
        crop = "Cotton";
        season = "Kharif";
        water = "Medium";
        fertilizer = "Urea + MOP";
        cropYield = "2.5 tons/hectare";
        tips = "Keep fields weed-free during first 60 days of crop growth.";
      }

      result = {
        crop,
        confidence,
        season,
        water,
        fertilizer,
        yield: cropYield,
        tips,
        isFallback: true
      };
    }

    const predictionLog = {
      _id: new mongoose.Types.ObjectId().toString(),
      userId: req.user.id,
      type: "crop",
      inputs: inputData,
      result: result,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Save prediction history (Mongoose vs In-Memory)
    const isDbConnected = mongoose.connection.readyState === 1;
    if (isDbConnected) {
      const dbLog = new Prediction(predictionLog);
      await dbLog.save();
    } else {
      console.log("MongoDB offline - Saving crop prediction to global.mockPredictions");
      global.mockPredictions.push(predictionLog);
    }

    res.json(result);
  } catch (err) {
    console.error("Error in crop prediction route:", err);
    res.status(500).json({ error: "Crop recommendation failed: " + err.message });
  }
});

module.exports = router;
