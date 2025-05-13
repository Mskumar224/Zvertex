const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true }, // Unique user email
  password: { type: String, required: true }, // User password (plain-text, consider bcrypt for production)
  name: { type: String }, // User full name
  phone: { type: String, required: true }, // Mandatory phone number
  subscription: { type: String, default: 'NONE' }, // Subscription type (STUDENT, RECRUITER, BUSINESS, NONE)
  resumes: { type: Number, default: 0 }, // Count of uploaded resumes
  submissions: { type: Number, default: 0 }, // Count of job submissions
  jobsApplied: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }], // References to Job model
  profiles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Profile' }], // References to Profile model
  selectedCompanies: [{ type: String }], // Array of selected job platforms (e.g., Indeed, LinkedIn)
  selectedTechnology: { type: String }, // Preferred technology (e.g., JavaScript)
  selectedProfile: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' }, // Active profile reference
  recruiters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // References to recruiter users
  additionalDetails: {
    address: { type: String },
    linkedin: { type: String },
    github: { type: String },
    portfolio: { type: String },
    experience: { type: String },
    education: { type: String },
  }, // Optional user details
  otp: { type: String }, // OTP for signup/subscription verification
  otpExpires: { type: Date }, // OTP expiration timestamp
  pendingSubscription: { type: String }, // Temporary subscription type during OTP verification
  isVerified: { type: Boolean, default: false }, // Tracks account verification status
  isSubscriptionVerified: { type: Boolean, default: false }, // Tracks lifetime subscription OTP verification
});

module.exports = mongoose.model('User', userSchema);