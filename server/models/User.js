const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  subscription: { type: String, default: 'NONE' },
  resumes: { type: Number, default: 0 },
  submissions: { type: Number, default: 0 },
  jobsApplied: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
  resumesUploaded: { type: Number, default: 0 },
  submissionsToday: { type: Number, default: 0 },
  lastReset: { type: Date, default: Date.now },
  otp: { type: String },
  resetOtp: { type: String },
  isVerified: { type: Boolean, default: false },
  preferences: { type: Object, default: { companies: [], keywords: [] } },
  profile: {
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    experience: { type: String, default: '' },
    education: { type: String, default: '' },
    isCompleted: { type: Boolean, default: false }
  },
  firstLoginEmailSent: { type: Boolean, default: false }, // Track first login email
  firstLogoutEmailSent: { type: Boolean, default: false } // Track first logout email
});

module.exports = mongoose.model('User', userSchema);