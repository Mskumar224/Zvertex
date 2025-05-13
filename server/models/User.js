const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  subscription: { type: String, default: 'NONE' },
  pendingSubscription: { type: String },
  selectedCompanies: [{ type: String }],
  selectedTechnology: { type: String },
  otp: { type: String },
  otpExpires: { type: Date },
  isVerified: { type: Boolean, default: false },
  isSubscriptionVerified: { type: Boolean, default: false },
  profiles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Profile' }],
  jobsApplied: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
  recruiters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recruiter' }],
  additionalDetails: { type: mongoose.Schema.Types.Mixed },
  resumes: { type: Number, default: 0 }
});

module.exports = mongoose.model('User', userSchema);