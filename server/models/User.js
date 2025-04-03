const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  subscriptionType: { type: String, enum: ['STUDENT', 'VENDOR', 'BUSINESS'], default: 'STUDENT' },
  resume: { type: String },
  phone: { type: String },
  fullName: { type: String },
  address: { type: String },
  appliedJobs: [{
    jobId: { type: String },
    technology: { type: String },
    date: { type: Date, default: Date.now },
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true }
  }],
  resetToken: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);