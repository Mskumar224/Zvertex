const mongoose = require('mongoose');

const recruiterSchema = new mongoose.Schema({
  name: String,
  email: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  profiles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Profile' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Recruiter', recruiterSchema);