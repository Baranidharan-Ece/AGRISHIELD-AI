const express = require("express");
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const Prediction = require("../models/Prediction");

const router = express.Router();

global.mockPredictions = global.mockPredictions || [];

router.post("/predict", auth, async (req, res) => {
  try {
    const { N, P, K, soilType, cropType, moisture } = req.body;

    if (!N || !P || !K || !soilType || !cropType || !moisture) {
      return res.status(400).json({ error: "N, P, K, soil type, crop type, and moisture are required" });
    }

    const nVal = parseFloat(N);
    const pVal = parseFloat(P);
    const kVal = parseFloat(K);
    const moistureVal = parseFloat(moisture);

    // Dynamic fertilizer recommendation rule engine
    let fertilizer = "NPK 19-19-19 (Balanced)";
    let deficiency = "None";
    let application = "Apply a balanced compost or NPK 19-19-19. Mix thoroughly in the topsoil.";
    let organic = "Well-rotted farmyard manure (FYM), compost, or Vermicompost.";
    let confidence = 90.0;

    const issues = [];
    if (nVal < 50) {
      issues.push("Nitrogen Deficiency");
    }
    if (pVal < 30) {
      issues.push("Phosphorus Deficiency");
    }
    if (kVal < 35) {
      issues.push("Potassium Deficiency");
    }

    if (issues.length > 0) {
      deficiency = issues.join(", ");
      
      // Determine fertilizer based on deficiencies
      if (nVal < 50 && pVal < 30 && kVal < 35) {
        fertilizer = "NPK 10-26-26";
        application = "Apply as a basal dose during land preparation or sowing. Ensures baseline N, P, and K availability.";
        organic = "Mix chicken manure with compost and bone meal to provide overall nutrition.";
      } else if (nVal < 50 && pVal < 30) {
        fertilizer = "DAP (Di-Ammonium Phosphate) + Urea";
        application = "Apply DAP as basal fertilizer at planting, followed by top-dressing with Urea after 3-4 weeks.";
        organic = "Apply bone meal (for phosphorus) alongside neem cake (slow-release nitrogen).";
      } else if (nVal < 50) {
        fertilizer = "Urea (46% Nitrogen)";
        application = "Apply in 2-3 split doses: first at transplanting/sowing, second during active vegetative growth.";
        organic = "Apply blood meal, alfalfa meal, or fish emulsion spray.";
      } else if (pVal < 30) {
        fertilizer = "Single Super Phosphate (SSP) or DAP";
        application = "Apply SSP near the root zone during sowing. Avoid top-dressing as phosphorus is less mobile in soil.";
        organic = "Use bone meal or rock phosphate powder mixed with organic compost.";
      } else if (kVal < 35) {
        fertilizer = "MOP (Muriate of Potash)";
        application = "Apply at sowing or before flowering. Essential for crop disease resistance and water stress tolerance.";
        organic = "Use wood ash (sparingly), kelp meal, or potassium-rich compost.";
      }
    }

    const result = {
      fertilizer,
      deficiency,
      moisture: moistureVal,
      application,
      organic_solution: organic,
      confidence,
      soilType,
      cropType
    };

    const predictionLog = {
      _id: new mongoose.Types.ObjectId().toString(),
      userId: req.user.id,
      type: "fertilizer",
      inputs: { N: nVal, P: pVal, K: kVal, soilType, cropType, moisture: moistureVal },
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
      console.log("MongoDB offline - Saving fertilizer prediction to global.mockPredictions");
      global.mockPredictions.push(predictionLog);
    }

    res.json(result);
  } catch (err) {
    console.error("Error in fertilizer recommendation route:", err);
    res.status(500).json({ error: "Fertilizer recommendation failed: " + err.message });
  }
});

module.exports = router;
