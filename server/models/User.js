const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp: { type: String },
  status: { type: String, enum: ['pending', 'approved'], default: 'pending' },
  otpExpires: { type: Date },
  submissionsToday: { type: Number, default: 0 },
  lastReset: { type: Date, default: Date.now },
  jobsApplied: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
});

module.exports = mongoose.model('User', userSchema);