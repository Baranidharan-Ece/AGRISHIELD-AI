const express = require("express");
const axios = require("axios");
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const ChatLog = require("../models/ChatLog");

const router = express.Router();

global.mockChatLogs = global.mockChatLogs || [];

// Context-aware local response engine for fallback
function getLocalChatResponse(message) {
  const query = message.toLowerCase();
  
  if (query.includes("soil") && (query.includes("black") || query.includes("cotton"))) {
    return "Black soil is highly suitable for crops such as cotton, soybean, sunflower, sorghum, wheat, and chickpea because it has excellent moisture-retention properties.";
  }
  if (query.includes("tomato") && (query.includes("yellow") || query.includes("spot") || query.includes("blight"))) {
    return "Yellow spots on tomato leaves may indicate Early Blight, Septoria Leaf Spot, or nutrient deficiency.\n\nPossible causes:\n• Fungal infection\n• Nitrogen deficiency\n• Poor drainage\n\nRecommended treatment:\n• Remove infected leaves\n• Apply an appropriate fungicide\n• Avoid overhead watering\n• Improve air circulation";
  }
  if (query.includes("rice") && (query.includes("water") || query.includes("irrigation") || query.includes("require"))) {
    return "Rice generally requires 1200–1500 mm of water during its growing season. The exact amount depends on climate, soil type, and irrigation practices.";
  }
  if (query.includes("rice") && (query.includes("yield") || query.includes("improve"))) {
    return "To improve rice yield, consider:\n1. Using high-yielding certified seeds (such as IR64 or regional hybrids).\n2. Adopting System of Rice Intensification (SRI) which reduces water but improves root development.\n3. Applying optimal Nitrogen, Phosphorus, and Potassium (NPK) in split doses.\n4. Maintaining proper weed control during the first 30 days of growth.";
  }
  if (query.includes("fertilizer") || query.includes("npk")) {
    return "Fertilizers are classified by Nitrogen (N) for vegetative foliage growth, Phosphorus (P) for root system development, and Potassium (K) for crop disease resistance and water stress tolerance.";
  }
  if (query.includes("blight") || query.includes("leaf blight")) {
    return "Leaf Blight is a fungal infection causing dry, brown patches on leaf margins. Treat by removing infected foliage and spraying copper-based fungicide or organic neem oil.";
  }
  if (query.includes("rust")) {
    return "Rust is a fungal disease producing orange-brown powdery pustules. Prune infected sections and apply sulfur fungicide or organic garlic spray.";
  }
  if (query.includes("hello") || query.includes("hi ") || query.includes("hey")) {
    return "Hello! I am AgriShield AI, your agricultural assistant. Ask me questions about crops, soil health, plant diseases, or fertilizer recommendations!";
  }
  
  return "Successful crop cultivation requires monitoring soil pH (optimal range is 6.0 - 7.0), balanced fertilizer applications (NPK), root-level watering to prevent fungal leaf blights, and choosing seasonal crops (Kharif for summer/monsoon, Rabi for winter). Let me know how I can assist with these parameters!";
}

router.post("/", auth, async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    let reply = "";
    
    // Save user message
    const userLog = {
      _id: new mongoose.Types.ObjectId().toString(),
      userId: req.user.id,
      role: "user",
      content: message,
      createdAt: new Date()
    };

    const isDbConnected = mongoose.connection.readyState === 1;
    if (isDbConnected) {
      const dbUserLog = new ChatLog(userLog);
      await dbUserLog.save();
    } else {
      global.mockChatLogs.push(userLog);
    }

    const systemPrompt = "You are AgriShield AI, an intelligent agricultural assistant. Help farmers with crop recommendation, fertilizer guidance, plant diseases, weather advice, irrigation, soil health, pest management, government agricultural schemes, and sustainable farming. Always provide practical, concise and accurate answers. If the user asks something unrelated to agriculture, politely answer it if possible, but prioritize agricultural assistance. Never repeat the user's message. Always generate a fresh response.";

    // Option 1: Gemini API
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "mock-key") {
      try {
        const contents = (history || []).map(h => ({
          role: h.role === "assistant" ? "model" : "user",
          parts: [{ text: h.content }]
        }));
        
        contents.push({
          role: "user",
          parts: [{ text: message }]
        });

        const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
          {
            contents,
            systemInstruction: {
              parts: [{ text: systemPrompt }]
            }
          },
          { timeout: 8000 }
        );

        if (response.data && response.data.candidates && response.data.candidates[0].content.parts[0].text) {
          reply = response.data.candidates[0].content.parts[0].text;
        } else {
          throw new Error("Invalid Gemini API response structure");
        }
      } catch (err) {
        console.error("Gemini API call failed, falling back:", err.message);
        reply = getLocalChatResponse(message);
      }
    } 
    // Option 2: OpenAI API
    else if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== "mock-openai-key") {
      try {
        const messages = [
          { role: "system", content: systemPrompt }
        ];
        
        (history || []).forEach(h => {
          messages.push({
            role: h.role === "assistant" ? "assistant" : "user",
            content: h.content
          });
        });

        messages.push({ role: "user", content: message });

        const response = await axios.post(
          "https://api.openai.com/v1/chat/completions",
          {
            model: "gpt-4o-mini", // Use cost-effective gpt-4o-mini
            messages: messages,
          },
          {
            headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
            timeout: 8000
          }
        );

        if (response.data && response.data.choices && response.data.choices[0].message.content) {
          reply = response.data.choices[0].message.content;
        } else {
          throw new Error("Invalid OpenAI API response structure");
        }
      } catch (err) {
        console.error("OpenAI API call failed, falling back:", err.message);
        reply = getLocalChatResponse(message);
      }
    } 
    // Option 3: Fallback response engine
    else {
      reply = getLocalChatResponse(message);
    }

    // Save assistant reply
    const assistantLog = {
      _id: new mongoose.Types.ObjectId().toString(),
      userId: req.user.id,
      role: "assistant",
      content: reply,
      createdAt: new Date()
    };

    if (isDbConnected) {
      const dbAssistantLog = new ChatLog(assistantLog);
      await dbAssistantLog.save();
    } else {
      global.mockChatLogs.push(assistantLog);
    }

    res.json({ reply });
  } catch (err) {
    console.error("Error in chat route:", err);
    res.status(500).json({ error: "Chatbot error: " + err.message });
  }
});

module.exports = router;
