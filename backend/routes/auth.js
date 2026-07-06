const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const router = express.Router();

// Shared In-Memory User Database fallback for offline/development mode
global.mockUsers = global.mockUsers || [
  {
    _id: "60c72b2f9b1d8a2a4c8e762d",
    name: "Demo Farmer",
    email: "farmer@agrishield.com",
    passwordHash: "$2b$10$tZ2z9aJ9cKzP9.oFfBfD0uE1r5E.s8lW3mZkO5S9u7C9K9q1n4K1q", // hashed "password123"
    createdAt: new Date()
  }
];

// Signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required" });
    }

    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "Email is already registered" });
      }

      const user = new User({ name, email, password });
      await user.save();
      return res.status(201).json({ message: "User created successfully" });
    } else {
      console.log("MongoDB offline - Running in Memory Fallback Mode for Signup");
      const existingUser = global.mockUsers.find(u => u.email === email);
      if (existingUser) {
        return res.status(400).json({ error: "Email is already registered (Memory)" });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = {
        _id: new mongoose.Types.ObjectId().toString(),
        name,
        email,
        passwordHash,
        createdAt: new Date()
      };
      global.mockUsers.push(newUser);
      return res.status(201).json({ message: "User created successfully (In-Memory)" });
    }
  } catch (err) {
    res.status(450 || 400).json({ error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      const user = await User.findOne({ email });
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "supersecretkey", {
        expiresIn: "1d",
      });

      return res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    } else {
      console.log("MongoDB offline - Running in Memory Fallback Mode for Login");
      const user = global.mockUsers.find(u => u.email === email);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials (User not found in memory)" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid credentials (Password check failed)" });
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "supersecretkey", {
        expiresIn: "1d",
      });

      return res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    }
  } catch (err) {
    res.status(500).json({ error: "Server error during login: " + err.message });
  }
});

// Profile
router.get("/profile", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Authorization token missing" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecretkey");

    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.json(user);
    } else {
      console.log("MongoDB offline - Running in Memory Fallback Mode for Profile");
      const user = global.mockUsers.find(u => u._id.toString() == decoded.id.toString());
      if (!user) {
        return res.status(404).json({ error: "User not found in memory" });
      }
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      });
    }
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
});

module.exports = router;
