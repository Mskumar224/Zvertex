const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp: { type: String },
  status: { type: String, default: 'pending' },
  otpExpires: { type: Date },
  subscriptionType: { type: String, default: 'Free' },
  resumeText: { type: String },
  lastJobApplication: { type: Date, default: new Date(0) },
  firstSignup: { type: Boolean, default: true },
  firstLogin: { type: Boolean, default: true },
  firstResumeUpload: { type: Boolean, default: true },
  timeZone: { type: String, default: 'UTC' },
  jobPreferences: {
    jobType: { type: String, enum: ['Full Time', 'Contract', 'Part Time'], default: 'Full Time' },
    locationZip: { type: String },
    jobPosition: { type: String },
  },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
});

module.exports = mongoose.model('User', userSchema);