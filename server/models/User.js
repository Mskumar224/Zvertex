const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  subscription: String,
  subscriptionPlan: String,
  resume: String,
  trialActive: Boolean,
  trialStart: Date,
  location: String,
  technologies: [String],
  jobsApplied: [{ jobId: String, title: String, company: String, appliedAt: Date }],
});

module.exports = mongoose.model('User', userSchema);