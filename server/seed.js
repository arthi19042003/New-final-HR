require('dotenv').config();
const mongoose = require('mongoose');
const Position = require('./models/Position');
const Resume = require('./models/Resume');
const User = require('./models/User');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smartsubmissions';

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected');

  await Position.deleteMany({});
  await Resume.deleteMany({});
  await User.deleteMany({});

  const manager = new User({ firstName: 'Sasi', lastName: 'PM', email: 'sasi@example.com', role: 'hiring_manager' });
  await manager.save();

  const p1 = new Position({ title: 'Frontend Developer', department: 'Engineering', project: 'Portal Revamp', hiringManager: manager._id });
  const p2 = new Position({ title: 'Backend Developer', department: 'Engineering', project: 'API Platform', hiringManager: manager._id });
  await p1.save();
  await p2.save();

  const r1 = new Resume({ name: 'Alice Kumar', email: 'alice@example.com', phone: '9999999999', position: p1._id, positionTitle: p1.title, agency: 'TechRecruit', recruiter: 'Rama', status: 'Submitted' });
  const r2 = new Resume({ name: 'Bob Singh', email: 'bob@example.com', phone: '8888888888', position: p2._id, positionTitle: p2.title, agency: 'StaffFinders', recruiter: 'Kumar', status: 'Phone Screen Scheduled' });
  await r1.save();
  await r2.save();

  console.log('Seeded demo data');
  mongoose.disconnect();
}

run().catch(err => console.error(err));
