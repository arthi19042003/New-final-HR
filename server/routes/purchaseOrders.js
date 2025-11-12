// server/routes/purchaseOrders.js
const express = require("express");
const mongoose = require("mongoose");
const { connectHiringManagerDB } = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
let PurchaseOrderModel;

// ✅ Initialize the Purchase Order model once
(async () => {
  try {
    const conn = await connectHiringManagerDB();

    const PurchaseOrderSchema = new mongoose.Schema({
      poNumber: { type: String, required: true, unique: true },
      candidateName: { type: String, required: true },
      positionTitle: { type: String, required: true },
      department: String,
      rate: Number,
      startDate: Date,
      status: {
        type: String,
        enum: ["Draft", "Approved"],
        default: "Draft",
      },
      createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      createdAt: { type: Date, default: Date.now },
    });

    PurchaseOrderModel =
      conn.models.PurchaseOrder ||
      conn.model("PurchaseOrder", PurchaseOrderSchema);

    console.log("✅ Purchase Order model initialized");
  } catch (err) {
    console.error("❌ Error initializing Purchase Order model:", err);
  }
})();

// ✅ Generate PO Number helper
function generatePONumber() {
  return "PO-" + Date.now();
}

// ✅ Create a new Purchase Order
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { candidateName, positionTitle, department, rate, startDate } =
      req.body;

    const po = await PurchaseOrderModel.create({
      poNumber: generatePONumber(),
      candidateName,
      positionTitle,
      department,
      rate,
      startDate,
      createdBy: req.user._id,
    });

    res.status(201).json(po);
  } catch (err) {
    console.error("❌ Error creating PO:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get all POs by hiring manager
router.get("/", authMiddleware, async (req, res) => {
  try {
    const pos = await PurchaseOrderModel.find({
      createdBy: req.user._id,
    }).sort({ createdAt: -1 });

    res.json(pos);
  } catch (err) {
    console.error("❌ Error fetching POs:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Update PO status
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const updated = await PurchaseOrderModel.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "PO not found" });
    res.json(updated);
  } catch (err) {
    console.error("❌ Error updating PO:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
