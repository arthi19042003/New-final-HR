const mongoose = require('mongoose');
const { Schema } = mongoose;

const ResumeSchema = new Schema({
  name: String,
  email: String,
  phone: String,
  position: { type: Schema.Types.ObjectId, ref: 'Position' },
  positionTitle: String,
  agency: String,
  recruiter: String,
  status: {
    type: String,
    enum: ['Submitted','Under Review','Phone Screen Scheduled','Shortlisted','Rejected','Onsite Scheduled','Hired'],
    default: 'Submitted'
  },
  notes: [{ by: String, text: String, date: Date }],
  appliedAt: { type: Date, default: Date.now },
  metadata: Schema.Types.Mixed
});

module.exports = mongoose.model('Resume', ResumeSchema);
