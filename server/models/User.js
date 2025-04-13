const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
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
    enum: ['Student', 'Recruiter', 'Business'],
    required: true,
  },
  trialEndDate: {
    type: Date,
    required: true,
  },
  resume: {
    type: String,
    default: null,
  },
  phone: {
    type: String,
    default: '',
  },
  technologies: {
    type: [String],
    default: [],
  },
  companies: {
    type: [String],
    default: [],
  },
  appliedJobs: {
    type: [
      {
        jobId: String,
        jobTitle: String,
        company: String,
        technology: String,
        jobLink: String,
        date: { type: Date, default: Date.now },
      },
    ],
    default: [],
  },
  profiles: [
    {
      id: Number,
      resume: { type: String, default: null },
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      technologies: { type: [String], default: [] },
      companies: { type: [String], default: [] },
      appliedJobs: [
        {
          jobId: String,
          jobTitle: String,
          company: String,
          technology: String,
          jobLink: String,
          date: { type: Date, default: Date.now },
        },
      ],
      profiles: { type: Array, default: [] }, // For Business sub-profiles
    },
  ],
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('user', UserSchema);