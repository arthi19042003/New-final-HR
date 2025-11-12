// server/routes/positions.js
const express = require("express");
const mongoose = require("mongoose");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Use shared connection
const PositionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  department: String,
  description: String,
  requiredSkills: [String],
  location: String,
  openings: { type: Number, default: 1 },
  status: { type: String, enum: ["Open", "Closed"], default: "Open" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

const PositionModel =
  mongoose.models.Position || mongoose.model("Position", PositionSchema);

/**
 * ✅ GET - All positions for the logged-in hiring manager
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const positions = await PositionModel.find({
      createdBy: req.user._id,
    }).sort({ createdAt: -1 });

    res.json(positions);
  } catch (err) {
    console.error("❌ Error fetching positions:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * ✅ POST - Create new position
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const newPosition = await PositionModel.create({
      ...req.body,
      createdBy: req.user._id,
    });

    res.status(201).json(newPosition);
  } catch (err) {
    console.error("❌ Error creating position:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * ✅ PUT - Update position
 */
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const updated = await PositionModel.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      req.body,
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ message: "Position not found" });

    res.json(updated);
  } catch (err) {
    console.error("❌ Error updating position:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * ✅ DELETE - Delete position
 */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deleted = await PositionModel.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!deleted)
      return res.status(404).json({ message: "Position not found" });

    res.json({ message: "Position deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting position:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
