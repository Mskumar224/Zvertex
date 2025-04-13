const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  subscription: {
    type: String,
    enum: ['None', 'Basic', 'Pro', 'Enterprise'],
    default: 'None',
  },
  trialStart: {
    type: Date,
  },
  trialActive: {
    type: Boolean,
    default: false,
  },
  resume: {
    filename: String,
    path: String,
    mimetype: String,
    uploadedAt: Date,
  },
  jobPreferences: {
    title: String,
    location: String,
    skills: [String],
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', userSchema);