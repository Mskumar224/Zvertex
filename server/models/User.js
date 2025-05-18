const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // In production, hash with bcrypt
  subscription: { type: String, default: 'NONE' },
  resumes: { type: Number, default: 0 },
  submissions: { type: Number, default: 0 },
  jobsApplied: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
  resumesUploaded: { type: Number, default: 0 },
  submissionsToday: { type: Number, default: 0 },
  lastReset: { type: Date, default: Date.now },
  otp: { type: String }, // Store OTP (in production, hash and add expiration)
  isVerified: { type: Boolean, default: false },
  preferences: { type: Object, default: { companies: [], keywords: [] } }
});

module.exports = mongoose.model('User', userSchema);