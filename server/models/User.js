const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp: { type: String },
  status: { type: String, default: 'pending' },
  otpExpires: { type: Date },
  subscriptionType: { type: String, default: 'Free' }, // Added subscription type
});

module.exports = mongoose.model('User', userSchema);