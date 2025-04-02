const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  subscriptionType: { type: String, default: 'STUDENT' },
  paid: { type: Boolean, default: false },
});

module.exports = mongoose.model('User', userSchema);