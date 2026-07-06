const express = require("express");
const axios = require("axios");
const router = express.Router();

router.post("/", async (req, res) => {
  const { location } = req.body;
  const loc = location || "Chennai";

  const weatherApiKey = process.env.OPENWEATHER_API_KEY;

  if (weatherApiKey && weatherApiKey !== "mock-weather-key") {
    try {
      const url = `http://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(loc)}&appid=${weatherApiKey}&units=metric`;
      const response = await axios.get(url, { timeout: 3000 });
      const data = response.data;
      
      const weatherData = {
        temperature: data.main.temp,
        humidity: data.main.humidity,
        rainfall: data.rain ? (data.rain["1h"] || data.rain["3h"] || 0) : 0,
        wind_speed: data.wind.speed,
        location: data.name
      };
      
      return res.json(weatherData);
    } catch (err) {
      console.log("Weather API failed, falling back to mock weather data:", err.message);
    }
  }

  // Fallback realistic weather data generator
  let temp = 28.5;
  let hum = 72;
  let rain = 5;
  let wind = 4.2;

  if (loc.toLowerCase() === "chennai") {
    temp = 31.2;
    hum = 78;
    rain = 2;
    wind = 3.6;
  } else if (loc.toLowerCase() === "delhi") {
    temp = 34.0;
    hum = 45;
    rain = 0;
    wind = 2.8;
  } else if (loc.toLowerCase() === "mumbai") {
    temp = 29.0;
    hum = 85;
    rain = 25;
    wind = 5.1;
  }

  res.json({
    temperature: temp,
    humidity: hum,
    rainfall: rain,
    wind_speed: wind,
    location: loc,
    isMock: true
  });
});

module.exports = router;
