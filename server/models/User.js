const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    index: true, // Add index for faster queries
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  subscriptionType: {
    type: String,
    enum: ['STUDENT', 'RECRUITER', 'BUSINESS'],
    default: 'STUDENT',
  },
  subscriptionStatus: {
    type: String,
    enum: ['PENDING', 'TRIAL', 'ACTIVE', 'EXPIRED'],
    default: 'PENDING',
  },
  trialStart: {
    type: Date,
    default: Date.now,
  },
  otp: {
    type: String,
  },
  otpExpires: {
    type: Date,
  },
  profiles: [
    {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, required: true },
      technologies: [String],
      companies: [String],
      resume: String,
      additionalDetails: Object,
    },
  ],
  recruiters: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});

module.exports = mongoose.model('User', UserSchema);