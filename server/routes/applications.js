const express = require("express");
const getApplicationModel = require("../models/Application");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// 📥 Get all applications for the hiring manager
router.get("/", authMiddleware, async (req, res) => {
  try {
    const Application = await getApplicationModel();
    const apps = await Application.find({ createdBy: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(apps);
  } catch (err) {
    console.error("Error fetching applications:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 📝 Review an application
router.put("/:id/review", authMiddleware, async (req, res) => {
  try {
    const Application = await getApplicationModel();
    const app = await Application.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      { status: "Reviewed" },
      { new: true }
    );
    res.json(app);
  } catch (err) {
    console.error("Error reviewing application:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 📅 Schedule Interview
router.put("/:id/schedule", authMiddleware, async (req, res) => {
  try {
    const { interviewDate } = req.body;
    const Application = await getApplicationModel();
    const app = await Application.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      { interviewDate, status: "Interview Scheduled" },
      { new: true }
    );
    res.json(app);
  } catch (err) {
    console.error("Error scheduling interview:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 💬 Send message (Hiring Manager ↔ Candidate)
router.post("/:id/message", authMiddleware, async (req, res) => {
  try {
    const { message, from } = req.body;
    const Application = await getApplicationModel();
    const app = await Application.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      { $push: { communication: { from, message } } },
      { new: true }
    );
    res.json(app);
  } catch (err) {
    console.error("Error sending message:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Hire candidate
router.put("/:id/hire", authMiddleware, async (req, res) => {
  try {
    const Application = await getApplicationModel();
    const app = await Application.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      { status: "Hired", onboardingStatus: "In Progress" },
      { new: true }
    );
    res.json(app);
  } catch (err) {
    console.error("Error hiring candidate:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 🚀 Update onboarding status
router.put("/:id/onboarding", authMiddleware, async (req, res) => {
  try {
    const { onboardingStatus } = req.body;
    const Application = await getApplicationModel();
    const app = await Application.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      { onboardingStatus },
      { new: true }
    );
    res.json(app);
  } catch (err) {
    console.error("Error updating onboarding status:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 🧾 Get all onboarding candidates
router.get("/onboarding/all", authMiddleware, async (req, res) => {
  try {
    const Application = await getApplicationModel();
    const apps = await Application.find({
      createdBy: req.user._id,
      onboardingStatus: { $ne: "Pending" },
    }).sort({ updatedAt: -1 });
    res.json(apps);
  } catch (err) {
    console.error("Error fetching onboarding list:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 📬 Get all messages (Inbox view)
router.get("/inbox/all", authMiddleware, async (req, res) => {
  try {
    const Application = await getApplicationModel();
    const apps = await Application.find({ createdBy: req.user._id })
      .select("candidateName position communication")
      .sort({ "communication.timestamp": -1 });

    const allMessages = apps.flatMap((app) =>
      app.communication.map((msg) => ({
        candidateName: app.candidateName,
        position: app.position,
        ...msg,
      }))
    );

    res.json(allMessages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
  } catch (err) {
    console.error("Error fetching inbox:", err);
    res.status(500).json({ message: "Server error" });
  }
});
// 📜 Candidate History by Email
router.get("/history/:email", authMiddleware, async (req, res) => {
  try {
    const Application = await getApplicationModel();
    const history = await Application.find({
      email: req.params.email,
      createdBy: req.user._id,
    }).sort({ createdAt: -1 });
    res.json(history);
  } catch (err) {
    console.error("Error fetching history:", err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
