const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  subscriptionType: {
    type: String,
    enum: ['Student', 'Professional', 'Enterprise'],
    default: 'Student',
  },
  paid: {
    type: Boolean,
    default: false,
  },
  resume: {
    type: String,
    default: null,
  },
  phone: {
    type: String,
    default: null,
  },
  technologies: {
    type: String,
    default: '[]',
  },
  companies: {
    type: String,
    default: '[]',
  },
  appliedJobs: [{
    jobId: String,
    technology: String,
    jobTitle: String,
    company: String,
    appliedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  resetPasswordToken: {
    type: String,
    default: null,
  },
  resetPasswordExpires: {
    type: Date,
    default: null,
  },
});

module.exports = mongoose.model('User', userSchema);