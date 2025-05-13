const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  subscription: String,
  otp: String,
  isVerified: Boolean,
  role: String,
  selectedTechnology: String,
  selectedCompanies: [String],
  profiles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Profile' }],
  recruiters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recruiter' }],
  jobsApplied: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
  resumes: { type: Number, default: 0 }
});

module.exports = mongoose.model('User', userSchema);