const express = require("express");
const getApplicationModel = require("../models/Application");
const authMiddleware = require("../middleware/authMiddleware");
const { sendOnboardingEmail } = require("../utils/emailService");

const router = express.Router();

// ✅ Get all candidates in onboarding
router.get("/", authMiddleware, async (req, res) => {
  try {
    const Application = await getApplicationModel();
    const onboarded = await Application.find({
      createdBy: req.user._id,
      status: "Hired",
    }).sort({ createdAt: -1 });
    res.json(onboarded);
  } catch (err) {
    console.error("Error fetching onboarding list:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Update onboarding status + email notification
router.put("/:id/status", authMiddleware, async (req, res) => {
  try {
    const { onboardingStatus } = req.body;
    const Application = await getApplicationModel();
    const updated = await Application.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      { onboardingStatus },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Candidate not found" });

    // 💌 Determine email message based on new status
    let subject, message;
    switch (onboardingStatus) {
      case "Pending":
        subject = "Your Onboarding Process is Pending";
        message = `Hello ${updated.candidateName}, your onboarding process will begin soon. Please wait for HR to contact you.`;
        break;
      case "In Progress":
        subject = "Onboarding In Progress";
        message = `Hello ${updated.candidateName}, your onboarding process has started. Please complete the required documents and formalities.`;
        break;
      case "Completed":
        subject = "Welcome Aboard! Onboarding Completed 🎉";
        message = `Congratulations ${updated.candidateName}, your onboarding process is now complete. Welcome to the team!`;
        break;
    }

    // ✉️ Send email to candidate
    if (updated.email) {
      await sendOnboardingEmail(updated.email, subject, message);
    }

    // 📤 Optionally notify HR or team (set via ENV)
    if (process.env.HR_EMAIL) {
      await sendOnboardingEmail(
        process.env.HR_EMAIL,
        `Candidate ${updated.candidateName} - ${onboardingStatus}`,
        `The onboarding status for ${updated.candidateName} (${updated.position}) has been updated to "${onboardingStatus}".`
      );
    }

    res.json(updated);
  } catch (err) {
    console.error("Error updating onboarding status:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
