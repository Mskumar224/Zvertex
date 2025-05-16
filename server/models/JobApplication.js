const mongoose = require('mongoose');

const JobApplicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  jobId: {
    type: String,
    required: true,
  },
  jobTitle: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  jobLink: {
    type: String,
    required: true,
  },
  technology: {
    type: String,
    required: true,
  },
  profileId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  status: {
    type: String,
    enum: ['APPLIED', 'INTERVIEW', 'REJECTED', 'OFFER'],
    default: 'APPLIED',
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('JobApplication', JobApplicationSchema);