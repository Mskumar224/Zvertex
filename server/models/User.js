const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  subscriptionType: { type: String, enum: ['STUDENT', 'RECRUITER', 'BUSINESS'], default: 'STUDENT' },
  subscriptionStatus: { type: String, enum: ['TRIAL', 'ACTIVE', 'EXPIRED'], default: 'TRIAL' },
  trialStart: { type: Date, default: Date.now },
  stripeCustomerId: { type: String },
  profiles: [{
    name: { type: String, required: true },
    phone: { type: String },
    technologies: [{ type: String }],
    companies: [{ type: String }],
    resume: { type: String },
    appliedJobs: [{
      jobId: { type: String },
      jobTitle: { type: String },
      company: { type: String },
      date: { type: Date, default: Date.now },
    }],
  }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);