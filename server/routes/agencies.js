const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const mongoose = require("mongoose");

const router = express.Router();

// Schema for agency invites
const AgencyInviteSchema = new mongoose.Schema({
  agencyName: { type: String, required: true },
  contactEmail: { type: String, required: true },
  invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  positionId: { type: mongoose.Schema.Types.ObjectId, ref: "Position", required: true },
  invitationStatus: {
    type: String,
    enum: ["Invited", "Accepted", "Declined"],
    default: "Invited",
  },
  message: String,
  createdAt: { type: Date, default: Date.now },
});

const AgencyInvite = mongoose.models.AgencyInvite || mongoose.model("AgencyInvite", AgencyInviteSchema);

// ✅ Invite an agency/recruiter
router.post("/invite", authMiddleware, async (req, res) => {
  try {
    const { agencyName, contactEmail, positionId, message } = req.body;
    const invite = await AgencyInvite.create({
      agencyName,
      contactEmail,
      invitedBy: req.user._id,
      positionId,
      message,
    });
    res.json({ success: true, invite });
  } catch (err) {
    console.error("Error inviting agency:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ Get all invites for a hiring manager
router.get("/", authMiddleware, async (req, res) => {
  try {
    const invites = await AgencyInvite.find({ invitedBy: req.user._id })
      .populate("positionId", "title department")
      .sort({ createdAt: -1 });
    res.json(invites);
  } catch (err) {
    console.error("Error fetching invites:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Update invitation status
router.put("/:id/status", authMiddleware, async (req, res) => {
  try {
    const { invitationStatus } = req.body;
    const updated = await AgencyInvite.findOneAndUpdate(
      { _id: req.params.id, invitedBy: req.user._id },
      { invitationStatus },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    console.error("Error updating invitation:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
