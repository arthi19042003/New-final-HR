const mongoose = require("mongoose");
const { connectHiringManagerDB } = require("../config/db");

let ApplicationModel;

async function getApplicationModel() {
  if (ApplicationModel) return ApplicationModel;

  const conn = await connectHiringManagerDB();

  const ApplicationSchema = new mongoose.Schema({
    candidateName: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    positionTitle: { type: String, required: true },
    resumeUrl: String,
    status: {
      type: String,
      enum: [
        "Received",
        "Reviewed",
        "Interview Scheduled",
        "Offered",
        "Hired",
        "Rejected",
      ],
      default: "Received",
    },
    interviewDate: Date,
    communication: [
      {
        from: String, // "Hiring Manager" or "Candidate"
        message: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
    onboardingStatus: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdAt: { type: Date, default: Date.now },
  });

  ApplicationModel =
    conn.models.Application || conn.model("Application", ApplicationSchema);
  return ApplicationModel;
}

module.exports = getApplicationModel;
