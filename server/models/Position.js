const mongoose = require('mongoose');
const { connectHiringManagerDB } = require('../config/db');

let conn;

// Ensure connection only once
async function initConnection() {
  if (!conn) {
    conn = await connectHiringManagerDB();
  }
  return conn;
}

const PositionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  department: String,
  description: String,
  requiredSkills: [String],
  location: String,
  openings: { type: Number, default: 1 },
  status: { type: String, enum: ['Open', 'Closed'], default: 'Open' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

let Position;

// This wrapper ensures the model uses the correct connection
async function getPositionModel() {
  const connection = await initConnection();
  Position = connection.models.Position || connection.model('Position', PositionSchema);
  return Position;
}

module.exports = getPositionModel;
