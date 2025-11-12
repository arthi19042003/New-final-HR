const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const bcrypt = require("bcryptjs");

/**
 * 🔹 LOGIN — For all roles (Hiring Manager, Recruiter, Admin)
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select("+passwordHash");
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    const validPassword = await user.comparePassword(password);
    if (!validPassword)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "default_jwt_secret",
      { expiresIn: "8h" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error("❌ Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * 🔹 REGISTER — For initial testing/setup
 */
router.post("/register", async (req, res) => {
  try {
    const { email, firstName, lastName, password, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already exists" });

    const user = new User({
      email,
      firstName,
      lastName,
      passwordHash: password, // auto-hashed in pre-save hook
      role: role || "hiring_manager",
    });

    await user.save();

    res.json({
      message: "✅ User registered successfully",
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("❌ Registration Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * 🔹 GET PROFILE — Fetch logged-in user info
 */
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-passwordHash");
    if (!user)
      return res.status(404).json({ message: "User not found" });

    res.json({
      name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    });
  } catch (err) {
    console.error("❌ Profile Fetch Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * 🔹 UPDATE PROFILE — Update first/last name & email
 */
router.put("/update-profile", authMiddleware, async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;

    if (!firstName || !email)
      return res.status(400).json({ message: "First name and email are required" });

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { firstName, lastName, email },
      { new: true }
    ).select("-passwordHash");

    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    res.json({
      message: "✅ Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("❌ Profile Update Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
