const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models"); // Import User model
const authenticate = require("../middleware/authenticate"); // Import authenticate middleware
const nodemailer = require("nodemailer");
const crypto = require("crypto");
require("dotenv").config();

const router = express.Router();

// Use a more robust solution for production instead of simple object storage
let otpStorage = {};

// Send OTP for password reset
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(400).json({ error: "User not found" });

  const otp = crypto.randomInt(100000, 999999).toString();
  otpStorage[email] = otp;

  // Configure nodemailer
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "SustainHub Password Reset OTP",
    text: `Your OTP for password reset is ${otp}. It is valid for 10 minutes.`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error("Failed to send email:", err);
      return res.status(500).json({ error: "Failed to send email" });
    }
    res.json({ message: "OTP sent" });
  });
});

// Reset Password
router.post("/reset-password", async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (otpStorage[email] !== otp)
    return res.status(400).json({ error: "Invalid OTP" });

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await User.update({ password: hashedPassword }, { where: { email } });
  delete otpStorage[email]; // Clear the OTP once used
  res.json({ message: "Password reset successfully" });
});

// Register a new user
router.post("/register", async (req, res) => {
  const { username, email, password, birth_date, school, bio } = req.body;
  const avatar = req.files ? req.files.avatar : null; // Extract avatar from files

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      birth_date,
      school,
      bio,
      avatar: avatar ? avatar.data : null, // Assuming avatar data is stored as binary
    });
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    console.error("Registration server error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Login user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user)
      return res.status(401).json({ error: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ error: "Invalid email or password" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({ token, user });
  } catch (error) {
    console.error("Login server error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get user profile
router.get("/profile", authenticate, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    res.json(user);
  } catch (error) {
    console.error("Profile server error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
