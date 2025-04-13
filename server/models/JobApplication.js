const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  profileId: { type: mongoose.Schema.Types.ObjectId, required: true },
  jobId: { type: String, required: true },
  jobTitle: { type: String, required: true },
  company: { type: String, required: true },
  jobLink: { type: String },
  technology: { type: String },
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ['APPLIED', 'INTERVIEW', 'REJECTED', 'OFFER'], default: 'APPLIED' },
});

module.exports = mongoose.model('JobApplication', jobApplicationSchema);