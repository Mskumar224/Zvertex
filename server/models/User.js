const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profile: {
    jobTitle: { type: String, required: true },
    skills: [{ type: String }],
    location: { type: String, required: true },
  },
  subscriptionStatus: { type: String, default: 'TRIAL' },
  trialStart: { type: Date, default: Date.now },
  stripeCustomerId: { type: String },
  subscriptionPlan: { type: String },
  isVerified: { type: Boolean, default: false },
});

module.exports = mongoose.model('User', userSchema);