const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  resume: { type: String },
  linkedIn: { type: String },
  github: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Profile', profileSchema);