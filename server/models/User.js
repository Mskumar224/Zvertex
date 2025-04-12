const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  subscriptionType: { type: String, default: 'Trial' },
  paid: { type: Boolean, default: false },
  trialEnds: { type: Date },
  phone: String,
  resume: String,
  appliedJobs: [{
    jobId: String,
    technology: String,
    jobTitle: String,
    company: String,
    date: { type: Date, default: Date.now }
  }],
});

module.exports = mongoose.model('User', userSchema);