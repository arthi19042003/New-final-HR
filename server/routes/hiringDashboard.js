// server/routes/hiringDashboard.js
const express = require("express");
const mongoose = require("mongoose");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Use existing mongoose connection (no need to reconnect)
const DashboardSchema = new mongoose.Schema({
  totalSubmissions: { type: Number, default: 0 },
  interviewsScheduled: { type: Number, default: 0 },
  offersMade: { type: Number, default: 0 },
  hired: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now },
});

const DashboardModel =
  mongoose.models.Dashboard || mongoose.model("Dashboard", DashboardSchema);

/**
 * ✅ GET - Summary (latest record)
 */
router.get("/summary", authMiddleware, async (req, res) => {
  try {
    const latest = await DashboardModel.findOne().sort({ updatedAt: -1 });
    res.json(latest || {});
  } catch (err) {
    console.error("❌ Error fetching dashboard summary:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * ✅ GET - All dashboard entries
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const records = await DashboardModel.find().sort({ updatedAt: -1 });
    res.json(records);
  } catch (err) {
    console.error("❌ Error fetching dashboard:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * ✅ POST - Add a new dashboard record
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { totalSubmissions, interviewsScheduled, offersMade, hired } =
      req.body;

    const newData = await DashboardModel.create({
      totalSubmissions,
      interviewsScheduled,
      offersMade,
      hired,
      updatedAt: new Date(),
    });

    res.status(201).json(newData);
  } catch (err) {
    console.error("❌ Error saving dashboard:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
